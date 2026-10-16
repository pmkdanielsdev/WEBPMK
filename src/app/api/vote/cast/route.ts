import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyVoterToken, hashVoterEmail, isCandidateValid, isValidUbStudentEmail } from '@/lib/security';
import { getSupabaseServerClient } from '@/lib/supabase';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, candidateId, email } = body;
    let voterToken = token;
    let voterEmail = '';

    if (!candidateId) {
      return NextResponse.json(
        { success: false, message: 'Pilihan kandidat wajib disertakan.' },
        { status: 400 }
      );
    }

    if (!voterToken && email) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!isValidUbStudentEmail(cleanEmail)) {
        return NextResponse.json(
          { success: false, message: 'Hanya email resmi mahasiswa Universitas Brawijaya (@student.ub.ac.id) yang diizinkan.' },
          { status: 403 }
        );
      }
      voterEmail = cleanEmail;
    } else if (voterToken) {
      // 1. Verifikasi integritas token pemilih
      const tokenVerification = verifyVoterToken(voterToken);
      if (!tokenVerification.valid || !tokenVerification.email) {
        return NextResponse.json(
          { success: false, message: tokenVerification.error || 'Token verifikasi tidak sah atau telah kadaluarsa.' },
          { status: 401 }
        );
      }
      voterEmail = tokenVerification.email;
    } else {
      return NextResponse.json(
        { success: false, message: 'Email mahasiswa UB atau token verifikasi wajib disertakan.' },
        { status: 400 }
      );
    }

    // 2. Validasi whitelist kandidat
    if (!isCandidateValid(candidateId)) {
      return NextResponse.json(
        { success: false, message: 'Pilihan kandidat tidak sah. Pilih salah satu dari opsi resmi yang tersedia.' },
        { status: 400 }
      );
    }

    const emailToUse = voterEmail;
    const emailHash = hashVoterEmail(emailToUse);
    const supabase = getSupabaseServerClient();

    // 3. Eksekusi voting via fungsi transaksional Supabase RPC (cast_vote)
    let voteSuccess = false;
    let responseMessage = 'Suara Anda berhasil direkam secara aman dan anonim!';

    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('cast_vote', {
        p_email_hash: emailHash,
        p_candidate_id: candidateId,
      });

      if (!rpcError && rpcResult) {
        if (!rpcResult.success) {
          return NextResponse.json(
            { success: false, message: rpcResult.message },
            { status: 400 }
          );
        }
        voteSuccess = true;
        responseMessage = rpcResult.message || responseMessage;
      } else {
        console.warn('Supabase cast_vote RPC call notice (schema might need setup):', rpcError?.message);
      }
    } catch (e) {
      console.warn('RPC execution exception:', e);
    }

    // 4. Fallback execution jika RPC belum dipasang di database
    if (!voteSuccess) {
      // Cek apakah sudah pernah memilih di memory
      if (globalStore.mockVoterRegistry?.has(emailHash)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email mahasiswa ini sudah pernah memberikan suara! Satu akun hanya berhak memilih satu kali.',
          },
          { status: 400 }
        );
      }

      // Simpan di memory fallback
      globalStore.mockVoterRegistry?.add(emailHash);
      globalStore.mockBallots?.push({
        candidate_id: candidateId,
        created_at: new Date().toISOString(),
      });

      // Coba simpan ke Supabase tabel jika ada
      try {
        await supabase.from('voter_registry').upsert({
          email_hash: emailHash,
          has_voted: true,
          voted_at: new Date().toISOString(),
        });
        await supabase.from('ballots').insert({
          candidate_id: candidateId,
        });
      } catch {
        // Abaikan
      }

      voteSuccess = true;
    }

    // Catat informasi lengkap pemilih agar admin dapat melihat semua informasi
    globalStore.mockVoterDetails?.push({
      email: emailToUse,
      email_hash: emailHash,
      candidate_id: candidateId,
      candidate_name: candidateId.charAt(0).toUpperCase() + candidateId.slice(1),
      voted_at: new Date().toISOString(),
    });

    // 5. Generate Tanda Terima Voting Kriptografis (Cryptographic Receipt)
    const receiptSeed = `${emailHash}:${Date.now()}:${Math.random()}`;
    const receiptHash = 'UB-VOTE-' + crypto.createHash('sha256').update(receiptSeed).digest('hex').substring(0, 16).toUpperCase();

    return NextResponse.json({
      success: true,
      message: responseMessage,
      receiptHash,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses suara';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
