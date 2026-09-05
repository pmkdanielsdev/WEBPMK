"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Divisi } from "@/types/pengurus";
import { normalizePengurusImageUrl } from "@/services/pengurusService";
import DivisionButtonCard from "./DivisionLogo";
import { 
  X, 
  Users,
  Award,
  ChevronRight
} from "lucide-react";

interface DivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Divisi | null;
}

export default function DivisionModal({
  isOpen,
  onClose,
  division,
}: DivisionModalProps) {
  // Prevent Lenis smooth scroll from hijacking modal scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-lenis-prevent", "true");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    };
  }, [isOpen]);

  if (!isOpen || !division) return null;

  const isSingleLeader = division.id === "ketua_umum" || (division.members && division.members.length === 1 && division.komisi === "BPH");
  const mainLeader = division.members && division.members.length > 0 ? division.members[0] : null;

  // Group members into Leaders vs Staff/Anggota
  const leaders = (division.members || []).filter(m => 
    m.role.toLowerCase().includes("ketua") || 
    m.role.toLowerCase().includes("koordinator") || 
    m.role.toLowerCase().includes("wakil") ||
    m.role.toLowerCase().includes("sekretaris") ||
    m.role.toLowerCase().includes("bendahara")
  );
  const staff = (division.members || []).filter(m => !leaders.some(l => l.id === m.id));

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain transition-all animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scaleUp font-plusJakarta text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Blue Header with Centered Official Logo Badge */}
        <div className="relative h-20 bg-primary flex items-center justify-center shrink-0">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
            title="Tutup"
          >
            <X size={18} />
          </button>

          {/* Centered Icon Badge with official button image */}
          <div className="w-auto h-12 max-w-[200px] flex items-center justify-center transform translate-y-3 drop-shadow-lg">
            <DivisionButtonCard divisionId={division.id} className="w-[180px]" />
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain p-6 pt-5 flex flex-col gap-5 text-center font-plusJakarta"
        >
          {/* Photo Section - Exactly 16:10 matching admin cropper with shrink-0 */}
          <div className="relative w-full aspect-[16/10] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100 mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                normalizePengurusImageUrl(
                  (isSingleLeader && mainLeader
                    ? mainLeader.photo_url || division.group_photo_url
                    : division.group_photo_url) || "/images/persekutuan.webp"
                )
              }
              alt={isSingleLeader && mainLeader ? mainLeader.name : division.name}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/images/persekutuan.webp")) {
                  target.src = "/images/persekutuan.webp";
                }
              }}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {isSingleLeader && mainLeader ? mainLeader.name : division.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/15">
                {isSingleLeader && mainLeader ? mainLeader.role : (division.komisi || "Divisi Pelayanan")}
              </span>
            </div>
          </div>

          {/* Description Paragraph */}
          {division.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify px-1">
              {division.description}
            </p>
          )}

          {/* Division Members Section with Photo Portraits */}
          <div className="mt-1 pt-4 border-t border-slate-100 flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Users size={14} className="text-primary" />
                <span>Susunan Potret Pengurus & Anggota</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {division.members?.length || 0} Pengurus
              </span>
            </div>

            {(!division.members || division.members.length === 0) ? (
              <p className="text-xs text-slate-400 italic">Belum ada anggota terdata.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Leaders Section */}
                {leaders.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Koordinator & Pimpinan:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {leaders.map((leader) => (
                        <div
                          key={leader.id}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-primary/30 transition-all shadow-xs"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-amber-400/40 shadow-xs shrink-0">
                            <Image
                              src={normalizePengurusImageUrl(leader.photo_url)}
                              alt={leader.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-xs text-slate-900 truncate">
                              {leader.name}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 truncate">
                              <Award size={11} className="shrink-0" />
                              {leader.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff / Members List with Avatars */}
                {staff.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Anggota Divisi:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {staff.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-primary/30 transition-all shadow-xs"
                        >
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                            <Image
                              src={normalizePengurusImageUrl(m.photo_url)}
                              alt={m.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {m.name}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">
                              {m.role || "Anggota"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
