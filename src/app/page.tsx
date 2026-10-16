'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Vote, 
  RefreshCw, 
  FileText, 
  X, 
  Send, 
  RotateCcw, 
  Check, 
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Copy
} from 'lucide-react';
import { CANDIDATES } from '@/lib/candidates';
import { Candidate } from '@/types/voting';

export default function VotingPage() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'IDLE' | 'CHECKING' | 'VALID' | 'INVALID_DOMAIN' | 'ALREADY_VOTED'>('IDLE');
  const [emailMessage, setEmailMessage] = useState('');
  const [voterToken, setVoterToken] = useState<string | null>(null);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Verifikasi otomatis email UB saat user selesai mengetik
  useEffect(() => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailStatus('IDLE');
      setEmailMessage('');
      setVoterToken(null);
      return;
    }

    if (!cleanEmail.endsWith('@student.ub.ac.id')) {
      setEmailStatus('INVALID_DOMAIN');
      setEmailMessage('Wajib menggunakan email resmi mahasiswa Universitas Brawijaya (@student.ub.ac.id)');
      setVoterToken(null);
      return;
    }

    // Debounce verifikasi ke server
    setEmailStatus('CHECKING');
    setEmailMessage('Memeriksa status akun mahasiswa UB...');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/ub-form-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setEmailStatus('VALID');
          setEmailMessage('Akun Mahasiswa UB terverifikasi. Anda memiliki 1 hak suara sah.');
          setVoterToken(data.token);
        } else if (data.hasVoted) {
          setEmailStatus('ALREADY_VOTED');
          setEmailMessage(data.message || 'Email ini sudah pernah memberikan suara! (1 mahasiswa = 1 suara)');
          setVoterToken(null);
        } else {
          setEmailStatus('INVALID_DOMAIN');
          setEmailMessage(data.message || 'Format email tidak valid.');
          setVoterToken(null);
        }
      } catch {
        // Fallback jika offline: anggap valid jika berakhiran @student.ub.ac.id
        setEmailStatus('VALID');
        setEmailMessage('Akun Mahasiswa UB valid.');
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [email]);

  // Klik Kirim Suara -> Tampilkan Modal Konfirmasi
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@student.ub.ac.id')) {
      setErrorMessage('Silakan isi email mahasiswa UB resmi (@student.ub.ac.id) Anda terlebih dahulu.');
      return;
    }

    if (emailStatus === 'ALREADY_VOTED') {
      setErrorMessage('Email ini sudah pernah digunakan untuk voting. Hak suara hanya 1 kali.');
      return;
    }

    if (!selectedCandidate) {
      setErrorMessage('Silakan pilih salah satu kandidat Calon Ketua PMK Daniel.');
      return;
    }

    setShowConfirmModal(true);
  };

  // Eksekusi Submit Final Suara
  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/vote/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: voterToken,
          email: email.trim().toLowerCase(),
          candidateId: selectedCandidate.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengirimkan suara.');
      }

      setReceiptHash(data.receiptHash);
      setIsSubmitted(true);
      setShowConfirmModal(false);

      // Konfeti selebrasi voting berhasil
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses suara.');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Formulir
  const handleResetForm = () => {
    if (confirm('Kosongkan semua isian formulir?')) {
      setEmail('');
      setSelectedCandidate(null);
      setErrorMessage(null);
      setEmailStatus('IDLE');
      setEmailMessage('');
      setVoterToken(null);
    }
  };

  const handleCopyReceipt = () => {
    if (receiptHash) {
      navigator.clipboard.writeText(receiptHash);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center">
      {/* Container Google Form Card Style */}
      <div className="w-full max-w-3xl space-y-4 sm:space-y-5">
        
        {/* ========================================================
            KARTU 1: HEADER FORMULIR GOOGLE FORM STYLE DENGAN BRAND PMK
            ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden relative">
          {/* Top Decorative Stripe - PMK Daniel Indigo & Flame Orange */}
          <div className="h-3.5 w-full bg-gradient-to-r from-[#3E4095] via-[#5D5FC4] to-[#F58732]" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative shrink-0">
                <Image
                  src="/pmk-logo.png"
                  alt="PMK Daniel"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E4095] bg-[#3E4095]/10 px-2.5 py-0.5 rounded-full">
                  Universitas Brawijaya
                </span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">PMK Daniel FILKOM UB</p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pemilihan Calon Ketua PMK Daniel 2026
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Formulir pemungutan suara resmi pemilihan Ketua PMK Daniel FILKOM Universitas Brawijaya periode 2026/2027.
              Gunakan hak suara Anda secara demokratis, jujur, dan bertanggung jawab. Kerahasiaan suara pemilih dijamin oleh sistem (Secret Ballot).
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-red-500 font-medium">
                * Menunjukkan pertanyaan yang wajib diisi
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Lock className="w-3.5 h-3.5 text-[#3E4095]" />
                1 Mahasiswa = 1 Suara Sah
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            JIKA SUDAH SUKSES TERKIRIM: TAMPILKAN LAYAR GOOGLE FORM SUCCESS
            ======================================================== */}
        {isSubmitted ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Tanggapan Telah Direkam
            </span>

            <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">
              Suara Anda Berhasil Dikirim!
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              Terima kasih telah berpartisipasi dalam Pemilihan Ketua PMK Daniel FILKOM UB 2026. Suara Anda telah tercatat secara anonim dan aman.
            </p>

            {receiptHash && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto mb-6 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Tanda Terima Suara (Proof of Vote)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReceipt}
                    className="text-xs text-[#3E4095] hover:text-[#2B2C6E] flex items-center gap-1 font-medium"
                  >
                    {copiedReceipt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-sm font-bold text-slate-900 break-all">
                  {receiptHash}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Kode kriptografis ini membuktikan suara Anda sah tanpa membuka nama calon yang Anda pilih.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/hasil"
                target="_blank"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F58732] hover:bg-[#E07421] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
              >
                <BarChart3 className="w-4 h-4" />
                Lihat Grafik Hasil
              </Link>
              <Link
                href="/aaddmmiinn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3E4095] hover:bg-[#2B2C6E] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Dashboard Admin
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================
              FORMULIR UTAMA PEMILIHAN (GOOGLE FORM STYLE)
              ======================================================== */
          <form onSubmit={handleSubmitForm} className="space-y-4 sm:space-y-5">
            {/* Banner Error jika ada */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-bold">Perhatian</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* ========================================================
                KARTU 2: VERIFIKASI AKUN MAHASISWA UB (GOOGLE FORM STYLE)
                ======================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <label htmlFor="ubEmailInput" className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                Email Mahasiswa Universitas Brawijaya <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Wajib login menggunakan akun Google resmi UB Anda yang berakhiran <span className="font-mono font-medium text-slate-700">@student.ub.ac.id</span>
              </p>

              <div className="relative">
                <input
                  id="ubEmailInput"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: 215150200111xxx@student.ub.ac.id"
                  className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base outline-hidden transition-all ${
                    emailStatus === 'VALID'
                      ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20'
                      : emailStatus === 'INVALID_DOMAIN' || emailStatus === 'ALREADY_VOTED'
                      ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                      : 'border-slate-300 focus:border-[#3E4095] focus:ring-2 focus:ring-[#3E4095]/15'
                  }`}
                />

                {emailStatus === 'CHECKING' && (
                  <div className="absolute right-3.5 top-3.5 text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                )}
                {emailStatus === 'VALID' && (
                  <div className="absolute right-3.5 top-3.5 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {(emailStatus === 'INVALID_DOMAIN' || emailStatus === 'ALREADY_VOTED') && (
                  <div className="absolute right-3.5 top-3.5 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Status feedback message */}
              {emailMessage && (
                <div
                  className={`mt-2.5 text-xs flex items-center gap-1.5 font-medium ${
                    emailStatus === 'VALID'
                      ? 'text-emerald-700'
                      : emailStatus === 'CHECKING'
                      ? 'text-slate-500'
                      : 'text-red-600'
                  }`}
                >
                  {emailStatus === 'VALID' && <Check className="w-3.5 h-3.5 shrink-0" />}
                  {emailStatus === 'ALREADY_VOTED' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span>{emailMessage}</span>
                </div>
              )}
            </div>

            {/* ========================================================
                KARTU 3: PILIHAN KANDIDAT KETUA (RESPONSIVE CARDS)
                ======================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="mb-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Pilih Calon Ketua PMK Daniel FILKOM UB <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik salah satu kartu di bawah ini untuk memilih kandidat pilihan Anda:
                </p>
              </div>

              {/* Responsive Grid of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {CANDIDATES.map((cand) => {
                  const isSelected = selectedCandidate?.id === cand.id;

                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedCandidate(cand);
                        }
                      }}
                      className={`relative text-left rounded-xl transition-all duration-200 cursor-pointer p-4 flex flex-col justify-between select-none ${
                        isSelected
                          ? 'border-2 border-[#3E4095] bg-[#3E4095]/[0.03] ring-4 ring-[#3E4095]/10 shadow-md translate-y-[-2px]'
                          : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs hover:translate-y-[-1px]'
                      }`}
                    >
                      {/* Top Header Card: Radio Circle + Nomor Urut */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Radio Circle Indicator */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'border-[#3E4095] bg-[#3E4095] text-white shadow-xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Nomor Urut Badge */}
                        <span
                          className="text-xs font-black px-2.5 py-0.5 rounded-full text-white shadow-xs"
                          style={{ backgroundColor: cand.avatarColor }}
                        >
                          0{cand.number}
                        </span>
                      </div>

                      {/* Monogram / Inisial Avatar */}
                      <div className="text-center my-1">
                        <div
                          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-lg font-black shadow-xs mb-2 transition-transform duration-200 group-hover:scale-105"
                          style={{ backgroundColor: cand.avatarColor }}
                        >
                          {cand.displayName.substring(0, 2).toUpperCase()}
                        </div>

                        {/* Nama Calon */}
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          {cand.displayName}
                        </h3>

                        {/* Slogan / Tagline */}
                        <p className="text-[11px] text-slate-500 italic mt-1 min-h-[32px] line-clamp-2 px-1">
                          &ldquo;{cand.tagline}&rdquo;
                        </p>
                      </div>

                      {/* Visi Ringkas */}
                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 my-2 text-left">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
                          Visi Utama
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {cand.vision}
                        </p>
                      </div>

                      {/* Tombol Lihat Detail Visi Misi */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailCandidate(cand);
                          }}
                          className="text-[11px] text-[#3E4095] hover:text-[#2B2C6E] font-semibold flex items-center gap-1 hover:underline"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Visi & Misi</span>
                        </button>

                        {isSelected ? (
                          <span className="text-[10px] font-bold text-[#3E4095] bg-[#3E4095]/10 px-2 py-0.5 rounded-full">
                            ✓ Dipilih
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Klik untuk pilih
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================
                KARTU 4: BOTTOM ACTION BAR (GOOGLE FORM SUBMIT STYLE)
                ======================================================== */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isSubmitting || emailStatus === 'ALREADY_VOTED'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3E4095] hover:bg-[#2B2C6E] disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Suara</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-200/60 transition"
                >
                  Kosongkan formulir
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center sm:text-right">
                <span>Formulir E-Voting Resmi PMK Daniel FILKOM UB</span>
              </div>
            </div>
          </form>
        )}

        {/* Footnote Privasi */}
        <div className="text-center text-[11px] text-slate-400 pt-4 pb-8 space-y-1">
          <p>Sistem E-Voting Terenkripsi Universitas Brawijaya • Asas Luber Jurdil</p>
          <p>Pilihan kandidat tidak dapat dikaitkan dengan identitas nama pemilih.</p>
        </div>
      </div>

      {/* ========================================================
          MODAL 1: DETAIL VISI & MISI KANDIDAT
          ======================================================== */}
      {detailCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-left animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-xs"
                  style={{ backgroundColor: detailCandidate.avatarColor }}
                >
                  0{detailCandidate.number}
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {detailCandidate.displayName}
                  </h3>
                  <p className="text-xs text-slate-500">Calon Ketua PMK Daniel FILKOM UB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailCandidate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Tagline
                </h4>
                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  &ldquo;{detailCandidate.tagline}&rdquo;
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Visi
                </h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {detailCandidate.vision}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Misi
                </h4>
                <ul className="space-y-2">
                  {detailCandidate.mission.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#3E4095]/10 text-[#3E4095] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedCandidate(detailCandidate);
                  setDetailCandidate(null);
                }}
                className="bg-[#3E4095] hover:bg-[#2B2C6E] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs transition"
              >
                Pilih {detailCandidate.displayName}
              </button>
              <button
                type="button"
                onClick={() => setDetailCandidate(null)}
                className="bg-slate-100 text-slate-700 font-medium text-xs py-2 px-4 rounded-xl hover:bg-slate-200 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: KONFIRMASI PENGIRIMAN SUARA
          ======================================================== */}
      {showConfirmModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-black shadow-md mb-3"
              style={{ backgroundColor: selectedCandidate.avatarColor }}
            >
              0{selectedCandidate.number}
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Konfirmasi Pilihan Suara
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Pastikan pilihan Anda sudah sesuai sebelum mengirimkan formulir:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-left space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Kandidat Pilihan:
                </span>
                <p className="text-base font-black text-slate-900">
                  {selectedCandidate.displayName} (Kandidat 0{selectedCandidate.number})
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Akun Pemilih:
                </span>
                <p className="text-xs font-mono font-medium text-slate-700">
                  {email}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] text-left p-3 rounded-xl mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Perhatian:</strong> Pilihan tidak dapat diubah setelah formulir dikirim. Hak suara Anda hanya berlaku 1 kali.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 text-xs sm:text-sm hover:bg-slate-100 transition"
              >
                Ubah Pilihan
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5"
                style={{ backgroundColor: selectedCandidate.avatarColor }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Merekam...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ya, Kirim Suara</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
