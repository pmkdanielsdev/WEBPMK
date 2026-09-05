"use client";

import React from "react";

interface DivisionButtonProps {
  divisionId?: string;
  onClick?: () => void;
  className?: string;
}

const BUTTON_IMAGE_MAP: Record<string, { light: string; dark: string }> = {
  ketua_umum: {
    light: "/images/logos/ketua umum bg putih.png",
    dark: "/images/logos/ketua umum bg biru.png",
  },
  wakil_ketua_umum: {
    light: "/images/logos/waketum bg putih.png",
    dark: "/images/logos/waketum bg biru.png",
  },
  sekretaris: {
    light: "/images/logos/sekretaris bg putih.png",
    dark: "/images/logos/sekretaris bg biru.png",
  },
  bendahara: {
    light: "/images/logos/bendahara bg putih.png",
    dark: "/images/logos/bendahara bg biru.png",
  },
  sekben: {
    light: "/images/logos/sekben bg putih.png",
    dark: "/images/logos/sekben bg biru.png",
  },
  pembinaan: {
    light: "/images/logos/pembinaan bg putih.png",
    dark: "/images/logos/pembinaan bg biru.png",
  },
  pemerhati: {
    light: "/images/logos/pemerhati bg putih.png",
    dark: "/images/logos/pemerhati bg biru.png",
  },
  acara: {
    light: "/images/logos/acara bg putih.png",
    dark: "/images/logos/acara bg biru.png",
  },
  media_relasi: {
    light: "/images/logos/media relasi bg putih.png",
    dark: "/images/logos/media relasi bg biru.png",
  },
  teknis_inventaris: {
    light: "/images/logos/inventaris bg putih.png",
    dark: "/images/logos/inventaris bg biru.png",
  },
  acara_sub: {
    light: "/images/logos/acara bg putih.png",
    dark: "/images/logos/acara bg biru.png",
  },
  minat_bakat: {
    light: "/images/logos/mitkatpel bg putih.png",
    dark: "/images/logos/mitkatpel bg biru.png",
  },
  media: {
    light: "/images/logos/media bg putih.png",
    dark: "/images/logos/media bg biru.png",
  },
  relasi: {
    light: "/images/logos/relasi bg putih.png",
    dark: "/images/logos/relasi bg biru.png",
  },
};

export function getDivisionButtonImages(divisionId?: string) {
  if (!divisionId) {
    return {
      light: "/images/logos/ketua umum bg putih.png",
      dark: "/images/logos/ketua umum bg biru.png",
    };
  }

  const key = divisionId.toLowerCase();
  for (const mapKey of Object.keys(BUTTON_IMAGE_MAP)) {
    if (key === mapKey) {
      return BUTTON_IMAGE_MAP[mapKey];
    }
  }

  // Fallbacks by partial keywords
  if (key.includes("ketua") && !key.includes("wakil")) return BUTTON_IMAGE_MAP.ketua_umum;
  if (key.includes("wakil") || key.includes("waketum")) return BUTTON_IMAGE_MAP.wakil_ketua_umum;
  if (key.includes("sekben") || key.includes("sekretariat")) return BUTTON_IMAGE_MAP.sekben;
  if (key.includes("sekretaris")) return BUTTON_IMAGE_MAP.sekretaris;
  if (key.includes("bendahara")) return BUTTON_IMAGE_MAP.bendahara;
  if (key.includes("pembinaan")) return BUTTON_IMAGE_MAP.pembinaan;
  if (key.includes("pemerhati")) return BUTTON_IMAGE_MAP.pemerhati;
  if (key.includes("inventaris") || key.includes("teknis")) return BUTTON_IMAGE_MAP.teknis_inventaris;
  if (key.includes("bakat") || key.includes("mitkatpel")) return BUTTON_IMAGE_MAP.minat_bakat;
  if (key.includes("media") && key.includes("relasi")) return BUTTON_IMAGE_MAP.media_relasi;
  if (key.includes("media")) return BUTTON_IMAGE_MAP.media;
  if (key.includes("relasi")) return BUTTON_IMAGE_MAP.relasi;
  if (key.includes("acara")) return BUTTON_IMAGE_MAP.acara;

  return BUTTON_IMAGE_MAP.ketua_umum;
}

export default function DivisionButtonCard({
  divisionId,
  onClick,
  className = "",
}: DivisionButtonProps) {
  const images = getDivisionButtonImages(divisionId);

  return (
    <button
      onClick={onClick}
      className={`group relative inline-block cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 filter drop-shadow-sm hover:drop-shadow-md select-none ${className}`}
      title="Klik untuk melihat detail & anggota"
    >
      {/* Light state (White background button) */}
      <img
        src={images.light}
        alt="Button Card"
        className="w-full h-auto object-contain block group-hover:hidden transition-all duration-150"
      />
      {/* Dark state on hover (Blue background button) */}
      <img
        src={images.dark}
        alt="Button Card Active"
        className="w-full h-auto object-contain hidden group-hover:block transition-all duration-150"
      />
    </button>
  );
}
