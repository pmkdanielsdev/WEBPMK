"use client";

import React, { useState } from "react";
import { Divisi } from "@/types/pengurus";
import DivisionButtonCard from "./DivisionLogo";
import { Layers, Network } from "lucide-react";

interface OrgChartTreeProps {
  divisions: Divisi[];
  onSelectDivision: (division: Divisi) => void;
}

export default function OrgChartTree({
  divisions,
  onSelectDivision,
}: OrgChartTreeProps) {
  // Mode switcher for mobile: "flow" (hierarchical flow) or "tree" (full diagram pan)
  const [mobileViewMode, setMobileViewMode] = useState<"flow" | "tree">("flow");

  // Helper to find division by id or name
  const findDiv = (idOrName: string, defaultName: string = "") => {
    return (
      divisions.find((d) => d.id === idOrName) ||
      divisions.find((d) => d.name.toLowerCase().includes(idOrName.toLowerCase())) || {
        id: idOrName,
        name: defaultName || idOrName,
        komisi: "",
        icon_name: "sparkles",
        description: "",
        order_priority: 99,
        members: [],
      }
    );
  };

  const ketuaUmum = findDiv("ketua_umum", "Ketua Umum");
  const wakilKetuaUmum = findDiv("wakil_ketua_umum", "Wakil Ketua Umum");
  const sekretaris = findDiv("sekretaris", "Sekretaris");
  const bendahara = findDiv("bendahara", "Bendahara");

  // Merge Sekretaris & Bendahara into Sekben (or find existing sekben division)
  const existingSekben = divisions.find(
    (d) => d.id === "sekben" || d.name.toLowerCase().includes("sekben")
  );
  const sekben: Divisi = existingSekben || {
    id: "sekben",
    name: "Sekretariat & Kebendaharaan",
    komisi: "BPH",
    icon_name: "pen",
    description:
      "Mengelola tata kelola administrasi surat-menyurat, arsip rapat, serta sirkulasi keuangan, transparansi pembukuan kas, dan penyusunan anggaran PMK Daniel FILKOM UB.",
    group_photo_url: sekretaris.group_photo_url || bendahara.group_photo_url || "/images/persekutuan.webp",
    order_priority: 3,
    members: [
      ...(sekretaris.members || []),
      ...(bendahara.members || []),
    ],
  };

  const pembinaan = findDiv("pembinaan", "Pembinaan");
  const pemerhati = findDiv("pemerhati", "Pemerhati");
  const acara = findDiv("acara", "Acara");
  const mediaRelasi = findDiv("media_relasi", "Media & Relasi");

  const teknisInventaris = findDiv("teknis_inventaris", "Teknis & Inventaris");
  const acaraSub = findDiv("acara_sub", "Acara");
  const minatBakat = findDiv("minat_bakat", "Minat Bakat & Misi Pelayanan");
  const media = findDiv("media", "Media");
  const relasi = findDiv("relasi", "Relasi");

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Mobile Mode Switcher (Visible only on mobile < md) */}
      <div className="flex md:hidden items-center justify-center p-1 bg-slate-100 rounded-full border border-slate-200 mb-6 max-w-xs w-full shadow-inner">
        <button
          onClick={() => setMobileViewMode("flow")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold font-plusJakarta transition-all ${
            mobileViewMode === "flow"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers size={14} />
          <span>Alur Hirarki</span>
        </button>
        <button
          onClick={() => setMobileViewMode("tree")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold font-plusJakarta transition-all ${
            mobileViewMode === "tree"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Network size={14} />
          <span>Bagan Pohon</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: HIERARCHICAL VERTICAL FLOW (Active on Mobile if mode is "flow") */}
      {/* ========================================================================= */}
      <div className={`w-full flex-col gap-6 max-w-md mx-auto ${mobileViewMode === "flow" ? "flex md:hidden" : "hidden"}`}>
        
        {/* Section 1: Badan Pengurus Harian (BPH) */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          <div className="flex items-center gap-2 self-start px-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Badan Pengurus Harian (BPH)
            </h2>
          </div>

          {/* Ketua Umum */}
          <div className="w-full max-w-[240px]">
            <DivisionButtonCard
              divisionId={ketuaUmum.id}
              onClick={() => onSelectDivision(ketuaUmum)}
              className="w-full"
            />
          </div>

          {/* Line connector down */}
          <div className="w-0.5 h-3 bg-primary/40" />

          {/* Wakil Ketua Umum */}
          <div className="w-full max-w-[240px]">
            <DivisionButtonCard
              divisionId={wakilKetuaUmum.id}
              onClick={() => onSelectDivision(wakilKetuaUmum)}
              className="w-full"
            />
          </div>

          {/* Line connector down */}
          <div className="w-0.5 h-3 bg-primary/40" />

          {/* Sekben (Sekretariat & Kebendaharaan) */}
          <div className="w-full max-w-[240px]">
            <DivisionButtonCard
              divisionId="sekben"
              onClick={() => onSelectDivision(sekben)}
              className="w-full"
            />
          </div>
        </div>

        {/* Section 2: 4 Komisi Utama & Sub-Divisi */}
        <div className="flex flex-col gap-4 mt-2 pt-5 border-t border-slate-100 w-full">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Komisi & Bidang Pelayanan
            </h2>
          </div>

          {/* Komisi 1: Pembinaan */}
          <div className="w-full flex flex-col items-center">
            <DivisionButtonCard
              divisionId={pembinaan.id}
              onClick={() => onSelectDivision(pembinaan)}
              className="w-full max-w-[240px]"
            />
          </div>

          {/* Komisi 2: Pemerhati */}
          <div className="w-full flex flex-col items-center">
            <DivisionButtonCard
              divisionId={pemerhati.id}
              onClick={() => onSelectDivision(pemerhati)}
              className="w-full max-w-[240px]"
            />
          </div>

          {/* Komisi 3: Acara (with nested sub-divisions) */}
          <div className="w-full flex flex-col items-center">
            <DivisionButtonCard
              divisionId={acara.id}
              onClick={() => onSelectDivision(acara)}
              className="w-full max-w-[240px]"
            />

            {/* Sub-Divisions Branch */}
            <div className="relative flex flex-col gap-2.5 pl-4 mt-2 border-l-2 border-dashed border-primary/40 w-full max-w-[240px] ml-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sub-Divisi Acara:
              </span>
              <div className="relative flex items-center">
                <div className="absolute -left-4 w-4 border-t-2 border-dashed border-primary/40" />
                <DivisionButtonCard
                  divisionId={teknisInventaris.id}
                  onClick={() => onSelectDivision(teknisInventaris)}
                  className="w-full"
                />
              </div>
              <div className="relative flex items-center">
                <div className="absolute -left-4 w-4 border-t-2 border-dashed border-primary/40" />
                <DivisionButtonCard
                  divisionId={acaraSub.id}
                  onClick={() => onSelectDivision(acaraSub)}
                  className="w-full"
                />
              </div>
              <div className="relative flex items-center">
                <div className="absolute -left-4 w-4 border-t-2 border-dashed border-primary/40" />
                <DivisionButtonCard
                  divisionId={minatBakat.id}
                  onClick={() => onSelectDivision(minatBakat)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Komisi 4: Media & Relasi (with nested sub-divisions) */}
          <div className="w-full flex flex-col items-center">
            <DivisionButtonCard
              divisionId={mediaRelasi.id}
              onClick={() => onSelectDivision(mediaRelasi)}
              className="w-full max-w-[240px]"
            />

            {/* Sub-Divisions Branch */}
            <div className="relative flex flex-col gap-2.5 pl-4 mt-2 border-l-2 border-dashed border-primary/40 w-full max-w-[240px] ml-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sub-Divisi Media & Relasi:
              </span>
              <div className="relative flex items-center">
                <div className="absolute -left-4 w-4 border-t-2 border-dashed border-primary/40" />
                <DivisionButtonCard
                  divisionId={media.id}
                  onClick={() => onSelectDivision(media)}
                  className="w-full"
                />
              </div>
              <div className="relative flex items-center">
                <div className="absolute -left-4 w-4 border-t-2 border-dashed border-primary/40" />
                <DivisionButtonCard
                  divisionId={relasi.id}
                  onClick={() => onSelectDivision(relasi)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP TREE VIEW (And Mobile if "tree" mode is selected) */}
      {/* ========================================================================= */}
      <div className={`w-full overflow-x-auto py-4 px-2 justify-center custom-scrollbar ${mobileViewMode === "tree" ? "flex" : "hidden md:flex"}`}>
        <div className="min-w-[1000px] max-w-5xl flex flex-col items-center select-none">
          
          {/* LEVEL 1: KETUA UMUM */}
          <div className="flex flex-col items-center">
            <div className="w-[210px]">
              <DivisionButtonCard
                divisionId={ketuaUmum.id}
                onClick={() => onSelectDivision(ketuaUmum)}
                className="w-[210px]"
              />
            </div>
            <div className="w-0.5 h-6 bg-primary/50" />
          </div>

          {/* LEVEL 2: WAKIL KETUA UMUM */}
          <div className="flex flex-col items-center">
            <div className="w-[210px]">
              <DivisionButtonCard
                divisionId={wakilKetuaUmum.id}
                onClick={() => onSelectDivision(wakilKetuaUmum)}
                className="w-[210px]"
              />
            </div>
            <div className="w-0.5 h-6 bg-primary/50" />
          </div>

          {/* LEVEL 3: SEKBEN (Di bawah Wakil Ketua Umum) */}
          <div className="flex flex-col items-center">
            <div className="w-[210px]">
              <DivisionButtonCard
                divisionId="sekben"
                onClick={() => onSelectDivision(sekben)}
                className="w-[210px]"
              />
            </div>
            <div className="w-0.5 h-8 bg-primary/50" />
          </div>

          {/* LEVEL 4: 4 KOMISI SEJAJAR DENGAN SUB-DIVISI VERTIKAL */}
          <div className="relative w-full flex flex-col items-center">
            
            {/* Level 4 Horizontal Main Bus Line */}
            <div className="absolute top-0 left-[110px] right-[110px] h-0.5 bg-primary/50" />

            {/* 4 Equal Commission Columns Grid */}
            <div className="grid grid-cols-4 gap-6 w-full pt-6">
              
              {/* COLUMN 1: Pembinaan */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={pembinaan.id}
                    onClick={() => onSelectDivision(pembinaan)}
                    className="w-[210px]"
                  />
                </div>
              </div>

              {/* COLUMN 2: Pemerhati */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={pemerhati.id}
                    onClick={() => onSelectDivision(pemerhati)}
                    className="w-[210px]"
                  />
                </div>
              </div>

              {/* COLUMN 3: Acara & Sub-Divisi Vertikal */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={acara.id}
                    onClick={() => onSelectDivision(acara)}
                    className="w-[210px]"
                  />
                </div>

                <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1 items-center">
                  <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={teknisInventaris.id}
                      onClick={() => onSelectDivision(teknisInventaris)}
                      className="w-full"
                    />
                  </div>

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={acaraSub.id}
                      onClick={() => onSelectDivision(acaraSub)}
                      className="w-full"
                    />
                  </div>

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={minatBakat.id}
                      onClick={() => onSelectDivision(minatBakat)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* COLUMN 4: Media & Relasi & Sub-Divisi Vertikal */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={mediaRelasi.id}
                    onClick={() => onSelectDivision(mediaRelasi)}
                    className="w-[210px]"
                  />
                </div>

                <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1 items-center">
                  <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={media.id}
                      onClick={() => onSelectDivision(media)}
                      className="w-full"
                    />
                  </div>

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={relasi.id}
                      onClick={() => onSelectDivision(relasi)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
