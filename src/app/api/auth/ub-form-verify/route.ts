import { NextRequest, NextResponse } from 'next/server';
import { isValidUbStudentEmail, hashVoterEmail, generateVoterToken } from '@/lib/security';
import { getSupabaseServerClient } from '@/lib/supabase';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Alamat email mahasiswa UB wajib diisi.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Validasi Domain Resmi Mahasiswa UB (@student.ub.ac.id)
    if (!isValidUbStudentEmail(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format tidak valid. Anda wajib menggunakan email resmi mahasiswa Universitas Brawijaya (@student.ub.ac.id).',
        },
        { status: 403 }
      );
    }

    const emailHash = hashVoterEmail(normalizedEmail);
    const supabase = getSupabaseServerClient();

    // 2. Cek apakah email sudah pernah memberikan suara
    let hasAlreadyVoted = false;
    try {
      const { data: voterData, error: voterCheckError } = await supabase
        .from('voter_registry')
        .select('has_voted')
        .eq('email_hash', emailHash)
        .maybeSingle();

      if (!voterCheckError && voterData?.has_voted) {
        hasAlreadyVoted = true;
      } else {
        hasAlreadyVoted = globalStore.mockVoterRegistry?.has(emailHash) || false;
      }
    } catch {
      hasAlreadyVoted = globalStore.mockVoterRegistry?.has(emailHash) || false;
    }

    if (hasAlreadyVoted) {
      return NextResponse.json(
        {
          success: false,
          hasVoted: true,
          message: 'Email mahasiswa ini sudah pernah digunakan untuk memilih. Setiap mahasiswa hanya memiliki 1 (satu) hak suara sah.',
        },
        { status: 400 }
      );
    }

    // 3. Buat token pemilih sah
    const token = generateVoterToken(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Akun mahasiswa Universitas Brawijaya terverifikasi.',
      email: normalizedEmail,
      token,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
