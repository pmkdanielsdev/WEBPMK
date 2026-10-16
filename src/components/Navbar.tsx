'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, BarChart3, Vote } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 relative shrink-0">
            <Image
              src="/pmk-logo.png"
              alt="Logo PMK Daniel"
              width={36}
              height={36}
              className="object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                E-VOTING <span className="text-[#3E4095]">PMK DANIEL</span>
              </span>
              <span className="bg-[#F58732]/15 text-[#D96B1C] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                UB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Pemilihan Calon Ketua PMK Daniel FILKOM Universitas Brawijaya
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">Secret Ballot Protected</span>
          </div>

          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              pathname === '/'
                ? 'text-[#3E4095] bg-[#3E4095]/10 border border-[#3E4095]/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Formulir Suara
          </Link>

          <Link
            href="/mc"
            target="_blank"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              pathname === '/mc'
                ? 'text-[#F58732] bg-[#F58732]/10 border border-[#F58732]/30'
                : 'text-slate-600 hover:text-[#F58732] hover:bg-orange-50/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F58732] animate-pulse" />
            <span>Layar MC</span>
          </Link>

          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              pathname === '/admin'
                ? 'text-[#3E4095] bg-[#3E4095]/10 border border-[#3E4095]/30'
                : 'text-slate-600 hover:text-[#3E4095] hover:bg-indigo-50/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#3E4095]" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
