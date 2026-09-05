import apiClient from "@/lib/axios";
import { Divisi, DivisiInput, PengurusMember, PengurusMemberInput } from "@/types/pengurus";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const LOCAL_STORAGE_DIVISI_KEY = "pmk_local_divisi_data";

export const DEFAULT_DIVISIONS: Divisi[] = [
  {
    id: "ketua_umum",
    name: "Ketua Umum",
    komisi: "BPH",
    icon_name: "crown",
    description: "Bertanggung jawab penuh atas arah kepemimpinan, visi misi rohani, serta koordinasi seluruh badan pelayanan PMK Daniel FILKOM UB.",
    group_photo_url: "/images/bastian.webp",
    order_priority: 1,
    members: [
      { id: "m_01", divisi_id: "ketua_umum", name: "Bastian Nevan Baruch", role: "Ketua Umum", photo_url: "/images/bastian.webp", period: "2025/2026", order_priority: 1 }
    ]
  },
  {
    id: "sekretaris",
    name: "Sekretaris",
    komisi: "BPH",
    icon_name: "pen",
    description: "Mengelola tata kelola administrasi surat-menyurat, persuratan resmi, proposal perizinan birokrasi fakultas, arsip notulensi rapat, dan inventaris berkas PMK Daniel.",
    group_photo_url: "/images/persekutuan.webp",
    order_priority: 2,
    members: [
      { id: "m_02", divisi_id: "sekretaris", name: "Gracia Stephanie", role: "Sekretaris 1", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 1 },
      { id: "m_03", divisi_id: "sekretaris", name: "Patricia Putri", role: "Sekretaris 2", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 2 }
    ]
  },
  {
    id: "wakil_ketua_umum",
    name: "Wakil Ketua Umum",
    komisi: "BPH",
    icon_name: "shield",
    description: "Mendampingi Ketua Umum dalam koordinasi internal komisi-komisi, pengawasan jalannya program kerja persekutuan, dan keselarasan antar bidang pelayanan.",
    group_photo_url: "/images/christo.webp",
    order_priority: 3,
    members: [
      { id: "m_04", divisi_id: "wakil_ketua_umum", name: "Christo Emmanuel", role: "Wakil Ketua Umum", photo_url: "/images/christo.webp", period: "2025/2026", order_priority: 1 }
    ]
  },
  {
    id: "bendahara",
    name: "Bendahara",
    komisi: "BPH",
    icon_name: "wallet",
    description: "Mengatur sirkulasi keuangan, pembukuan kas persekutuan, transparansi anggaran, penyusunan LPJ dana, serta alokasi dana persepuluhan dan persembahan kasih.",
    group_photo_url: "/images/persekutuan.webp",
    order_priority: 4,
    members: [
      { id: "m_05", divisi_id: "bendahara", name: "Nathania Michelle", role: "Bendahara 1", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 1 },
      { id: "m_06", divisi_id: "bendahara", name: "Samuel Timothy", role: "Bendahara 2", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 2 }
    ]
  },
  {
    id: "pembinaan",
    name: "Pembinaan",
    komisi: "Komisi 1",
    icon_name: "book",
    description: "Merancang kurikulum pembinaan rohani mahasiswa Kristen FILKOM, kelompok kecil (KTB), pendalaman Alkitab, serta pembinaan karakter spiritual.",
    group_photo_url: "/images/campdaniel.webp",
    order_priority: 5,
    members: [
      { id: "m_07", divisi_id: "pembinaan", name: "Jonathan Kevin", role: "Ketua Pembinaan", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 1 },
      { id: "m_08", divisi_id: "pembinaan", name: "Debora Angeline", role: "Wakil Ketua Pembinaan", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 2 },
      { id: "m_09", divisi_id: "pembinaan", name: "Daniel Ezra", role: "Anggota Pembinaan", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 3 },
      { id: "m_10", divisi_id: "pembinaan", name: "Ruth Valerie", role: "Anggota Pembinaan", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 4 }
    ]
  },
  {
    id: "pemerhati",
    name: "Pemerhati",
    komisi: "Komisi 2",
    icon_name: "heart",
    description: "Melayani doa syafaat, kepedulian jemaat, sambutan ramah bagi mahasiswa baru, kartu ucapan hari ulang tahun, serta konseling dan kunjungan kasih bagi anggota yang membutuhkan.",
    group_photo_url: "/images/persekutuan.webp",
    order_priority: 6,
    members: [
      { id: "m_11", divisi_id: "pemerhati", name: "Joshua Alexander", role: "Ketua Pemerhati", photo_url: "/images/joshua.webp", period: "2025/2026", order_priority: 1 },
      { id: "m_12", divisi_id: "pemerhati", name: "Ester Naomi", role: "Wakil Ketua Pemerhati", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 2 },
      { id: "m_13", divisi_id: "pemerhati", name: "Grace Febiola", role: "Anggota Pemerhati", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 3 }
    ]
  },
  {
    id: "acara",
    name: "Acara",
    komisi: "Komisi 3",
    icon_name: "sparkles",
    description: "Merancang konsep tematik, rundown, dan memandu dinamika ibadah persekutuan jumat mingguan, Welcoming Party, Retreat/Camp Daniel, Natal, dan Paskah.",
    group_photo_url: "/images/campdaniel.webp",
    order_priority: 7,
    members: [
      { id: "m_14", divisi_id: "acara", name: "Timothy Aaron", role: "Koordinator Komisi Acara", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 1 },
      { id: "m_15", divisi_id: "acara", name: "Rachel Jovita", role: "Wakil Koordinator Acara", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 2 }
    ]
  },
  {
    id: "media_relasi",
    name: "Media & Relasi",
    komisi: "Komisi 4",
    icon_name: "video",
    description: "Pusat media komunikasi kreatif, dokumentasi fotografi/videografi, publikasi visual digital, siaran persekutuan, serta menjalin kemitraan relasi strategis eksternal.",
    group_photo_url: "/images/joshua.webp",
    order_priority: 8,
    members: [
      { id: "m_16", divisi_id: "media_relasi", name: "Dave Christian", role: "Koordinator Komisi Medrel", photo_url: "/images/joshua.webp", period: "2025/2026", order_priority: 1 },
      { id: "m_17", divisi_id: "media_relasi", name: "Hanna Pricilla", role: "Wakil Koordinator Medrel", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 2 }
    ]
  },
  {
    id: "teknis_inventaris",
    name: "Teknis & Inventaris",
    komisi: "Sub Komisi 3 (Acara)",
    icon_name: "settings",
    description: "Mengatur perlengkapan sound system, instrumen musik, proyektor, lighting, serta memastikan kesiapan teknis ruang persekutuan.",
    group_photo_url: "/images/persekutuan.webp",
    order_priority: 9,
    members: [
      { id: "m_18", divisi_id: "teknis_inventaris", name: "Michael Ryan", role: "Ketua Divisi Teknis", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 1 }
    ]
  },
  {
    id: "acara_sub",
    name: "Acara",
    komisi: "Sub Komisi 3 (Acara)",
    icon_name: "calendar",
    description: "Pelaksana teknis jalannya rundown liturgi persekutuan mingguan, briefing pembicara, koordinasi song leader, singer, dan pemusik.",
    group_photo_url: "/images/campdaniel.webp",
    order_priority: 10,
    members: [
      { id: "m_19", divisi_id: "acara_sub", name: "Sarah Clarissa", role: "Ketua Divisi Acara Pelaksana", photo_url: "/images/campdaniel.webp", period: "2025/2026", order_priority: 1 }
    ]
  },
  {
    id: "minat_bakat",
    name: "Minat Bakat & Misi Pelayanan",
    komisi: "Sub Komisi 3 (Acara)",
    icon_name: "music",
    description: "Wadah penumbuhkembangan talenta seni musik, vokal, drama, serta menginisiasi misi bakti sosial kasih ke panti asuhan dan masyarakat sekitar.",
    group_photo_url: "/images/persekutuan.webp",
    order_priority: 11,
    members: [
      { id: "m_20", divisi_id: "minat_bakat", name: "David Christian", role: "Ketua Divisi Minat Bakat", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 1 }
    ]
  },
  {
    id: "media",
    name: "Media",
    komisi: "Sub Komisi 4 (Medrel)",
    icon_name: "camera",
    description: "Membuat desain grafis feed Instagram, poster pengumuman, dokumentasi foto/video momen persekutuan, video recap kegiatan, dan pengelolaan website.",
    group_photo_url: "/images/joshua.webp",
    order_priority: 12,
    members: [
      { id: "m_21", divisi_id: "media", name: "Jeremy Matthew", role: "Ketua Divisi Media Visual", photo_url: "/images/joshua.webp", period: "2025/2026", order_priority: 1 }
    ]
  },
  {
    id: "relasi",
    name: "Relasi",
    komisi: "Sub Komisi 4 (Medrel)",
    icon_name: "users",
    description: "Menjalin jejaring tali kasih dengan PMK fakultas lain se-Universitas Brawijaya, gereja-gereja lokal, alumni PMK Daniel, dan lembaga pelayanan kampus.",
    group_photo_url: "/images/persekutuan.webp",
    order_priority: 13,
    members: [
      { id: "m_22", divisi_id: "relasi", name: "Rebeca Amanda", role: "Ketua Divisi Relasi", photo_url: "/images/persekutuan.webp", period: "2025/2026", order_priority: 1 }
    ]
  }
];

export function normalizePengurusImageUrl(url?: string): string {
  if (!url || !url.trim()) {
    return "/images/persekutuan.webp";
  }
  if (url.includes("pub-317e9a74788b4b17a1deee01aa307c7c.r2.dev")) {
    return url.replace(
      "https://pub-317e9a74788b4b17a1deee01aa307c7c.r2.dev",
      "https://pmkdaniel-api.danielmemory26.workers.dev/api/upload"
    );
  }
  return url;
}

function normalizeDivision(div: Divisi): Divisi {
  return {
    ...div,
    group_photo_url: normalizePengurusImageUrl(div.group_photo_url),
    members: (div.members || []).map(m => ({
      ...m,
      photo_url: normalizePengurusImageUrl(m.photo_url),
    })),
  };
}

function getLocalDivisions(): Divisi[] {
  if (typeof window === "undefined") return DEFAULT_DIVISIONS.map(normalizeDivision);
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DIVISI_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_DIVISI_KEY, JSON.stringify(DEFAULT_DIVISIONS.map(normalizeDivision)));
      return DEFAULT_DIVISIONS.map(normalizeDivision);
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed.map(normalizeDivision) : DEFAULT_DIVISIONS.map(normalizeDivision);
  } catch (e) {
    return DEFAULT_DIVISIONS.map(normalizeDivision);
  }
}

function saveLocalDivisions(data: Divisi[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_DIVISI_KEY, JSON.stringify(data));
  } catch (e) {}
}

export const pengurusService = {
  /**
   * Get all divisions with members
   */
  async getAllDivisions(): Promise<Divisi[]> {
    let apiData: Divisi[] = [];
    try {
      const res = await apiClient.get<ApiResponse<Divisi[]>>("/pengurus", { timeout: 4000 });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        apiData = res.data.data.map(normalizeDivision);
      }
    } catch (err) {}

    const localList = getLocalDivisions();
    if (apiData.length === 0) return localList;

    // Merge API data with local overrides
    saveLocalDivisions(apiData);
    return apiData;
  },

  /**
   * Get division by ID
   */
  async getDivisionById(id: string): Promise<Divisi | null> {
    const all = await this.getAllDivisions();
    return all.find(d => d.id === id) || null;
  },

  /**
   * Create new division (Admin)
   */
  async createDivision(payload: DivisiInput): Promise<Divisi> {
    const newDivId = payload.id || `div_${Date.now()}`;
    const newDiv: Divisi = {
      id: newDivId,
      name: payload.name,
      komisi: payload.komisi || "Komisi",
      icon_name: payload.icon_name || "sparkles",
      description: payload.description || "",
      group_photo_url: payload.group_photo_url || "/images/persekutuan.webp",
      order_priority: payload.order_priority || 99,
      members: []
    };

    const current = getLocalDivisions();
    const updated = [...current, newDiv];
    saveLocalDivisions(updated);

    try {
      await apiClient.post<ApiResponse<Divisi>>("/pengurus/divisi", payload, { timeout: 6000 });
    } catch (err) {}

    return newDiv;
  },

  /**
   * Update division details (Admin)
   */
  async updateDivision(divisiId: string, payload: Partial<DivisiInput>): Promise<Divisi> {
    const current = getLocalDivisions();
    const idx = current.findIndex(d => d.id === divisiId);
    let updatedDiv: Divisi;

    if (idx > -1) {
      updatedDiv = {
        ...current[idx],
        ...payload,
      };
      current[idx] = updatedDiv;
      saveLocalDivisions(current);
    }

    try {
      await apiClient.put<ApiResponse<Divisi>>(`/pengurus/divisi/${divisiId}`, payload, { timeout: 6000 });
    } catch (err) {}

    return updatedDiv! || (payload as Divisi);
  },

  /**
   * Delete division (Admin)
   */
  async deleteDivision(divisiId: string): Promise<void> {
    const current = getLocalDivisions();
    saveLocalDivisions(current.filter(d => d.id !== divisiId));

    try {
      await apiClient.delete<ApiResponse<null>>(`/pengurus/divisi/${divisiId}`, { timeout: 5000 });
    } catch (err) {}
  },

  /**
   * Add member to division (Admin)
   */
  async addMember(payload: PengurusMemberInput): Promise<PengurusMember> {
    const newMemberId = `png_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newMember: PengurusMember = {
      id: newMemberId,
      divisi_id: payload.divisi_id,
      name: payload.name,
      role: payload.role,
      photo_url: payload.photo_url || "/images/persekutuan.webp",
      period: payload.period || "2025/2026",
      order_priority: payload.order_priority || 1,
    };

    const current = getLocalDivisions();
    const divIdx = current.findIndex(d => d.id === payload.divisi_id);
    if (divIdx > -1) {
      current[divIdx].members = [...(current[divIdx].members || []), newMember];
      saveLocalDivisions(current);
    }

    try {
      await apiClient.post<ApiResponse<PengurusMember>>("/pengurus/member", payload, { timeout: 6000 });
    } catch (err) {}

    return newMember;
  },

  /**
   * Update member (Admin)
   */
  async updateMember(memberId: string, payload: Partial<PengurusMemberInput>): Promise<void> {
    const current = getLocalDivisions();
    for (const div of current) {
      const mIdx = div.members.findIndex(m => m.id === memberId);
      if (mIdx > -1) {
        div.members[mIdx] = { ...div.members[mIdx], ...payload };
        break;
      }
    }
    saveLocalDivisions(current);

    try {
      await apiClient.put<ApiResponse<PengurusMember>>(`/pengurus/member/${memberId}`, payload, { timeout: 6000 });
    } catch (err) {}
  },

  /**
   * Delete member (Admin)
   */
  async deleteMember(memberId: string): Promise<void> {
    const current = getLocalDivisions();
    for (const div of current) {
      div.members = div.members.filter(m => m.id !== memberId);
    }
    saveLocalDivisions(current);

    try {
      await apiClient.delete<ApiResponse<null>>(`/pengurus/member/${memberId}`, { timeout: 5000 });
    } catch (err) {}
  },

  /**
   * Upload division photo or portrait to Cloudflare R2
   */
  async uploadPhoto(file: File): Promise<string> {
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Ukuran gambar melebihi batas 5MB");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      throw new Error("Format gambar tidak diizinkan. Hanya menerima JPG, PNG, atau WEBP.");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post<ApiResponse<{ url: string }>>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000,
      });

      if (res.data?.success && res.data?.data?.url) {
        return res.data.data.url;
      }
    } catch (err) {}

    return URL.createObjectURL(file);
  }
};
