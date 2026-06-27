// src/data/mockData.js
// Data dummy untuk development / demo

export const SCHOOLS = [
  { id: 1, nama_sekolah: 'SMAN 1 Palembang', npsn: '10604133', alamat: 'Jl. Srijaya Negara, Bukit Besar' },
  { id: 2, nama_sekolah: 'SMAN 5 Palembang', npsn: '10604137', alamat: 'Jl. Kapten Anwar Sastro' },
  { id: 3, nama_sekolah: 'SMPN 3 Palembang', npsn: '10604201', alamat: 'Jl. AKBP Cek Agus, Bukit Lama' },
];

export const USERS = [
  { id: 1, nama: 'Ahmad Fauzi', email: 'admin@disdik.palembang.go.id', role: 'admin', sekolah_id: null, password: 'admin123', is_active: 1 },
  { id: 2, nama: 'Dra. Hj. Siti Rahayu', email: 'kepsek.sman1@palembang.go.id', role: 'kepala_sekolah', sekolah_id: 1, password: 'kepsek123', is_active: 1 },
  { id: 3, nama: 'Budi Santoso, S.Pd', email: 'budi.santoso@guru.palembang.go.id', role: 'guru', sekolah_id: 1, password: 'guru123', is_active: 1 },
  { id: 4, nama: 'Dewi Lestari, S.Pd', email: 'dewi.lestari@guru.palembang.go.id', role: 'guru', sekolah_id: 1, password: 'guru123', is_active: 1 },
  { id: 5, nama: 'Rudi Hartono, M.Pd', email: 'rudi.hartono@guru.palembang.go.id', role: 'guru', sekolah_id: 1, password: 'guru123', is_active: 1 },
  { id: 6, nama: 'Sari Indah, S.Pd', email: 'sari.indah@guru.palembang.go.id', role: 'guru', sekolah_id: 2, password: 'guru123', is_active: 1 },
  { id: 7, nama: 'Operator SMAN1', email: 'operator.sman1@palembang.go.id', role: 'operator', sekolah_id: 1, password: 'op123', is_active: 1 },
];

export const GURU_DATA = [
  { id: 1, user_id: 3, nik: '1671010101800001', nip: '198001012010011001', mata_pelajaran: 'Matematika', sekolah_id: 1 },
  { id: 2, user_id: 4, nik: '1671010101850002', nip: '198501012010012002', mata_pelajaran: 'Bahasa Indonesia', sekolah_id: 1 },
  { id: 3, user_id: 5, nik: '1671010101820003', nip: '198201012010011003', mata_pelajaran: 'Fisika', sekolah_id: 1 },
  { id: 4, user_id: 6, nik: '1671010101900004', nip: null, mata_pelajaran: 'Kimia', sekolah_id: 2 },
];

export const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
export const MAPEL_LIST = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi', 'Sejarah', 'Geografi', 'Sosiologi', 'Ekonomi', 'PPKN', 'Seni Budaya', 'PJOK', 'Informatika'];

export const JADWAL_AWAL = [
  { id: 1, guru_id: 1, sekolah_id: 1, mata_pelajaran: 'Matematika', kelas: 'X IPA 1', hari: 'Senin', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 3 },
  { id: 2, guru_id: 1, sekolah_id: 1, mata_pelajaran: 'Matematika', kelas: 'X IPA 2', hari: 'Senin', jam_mulai: '10:00', jam_selesai: '12:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 3 },
  { id: 3, guru_id: 1, sekolah_id: 1, mata_pelajaran: 'Matematika', kelas: 'XI IPA 1', hari: 'Selasa', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 3 },
  { id: 4, guru_id: 1, sekolah_id: 1, mata_pelajaran: 'Matematika', kelas: 'XI IPA 2', hari: 'Rabu', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 3 },
  { id: 5, guru_id: 1, sekolah_id: 1, mata_pelajaran: 'Matematika', kelas: 'XII IPA 1', hari: 'Kamis', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 3 },
  { id: 6, guru_id: 1, sekolah_id: 1, mata_pelajaran: 'Matematika', kelas: 'XII IPA 2', hari: 'Jumat', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 3 },
  // Guru 2 - Underload
  { id: 7, guru_id: 2, sekolah_id: 1, mata_pelajaran: 'Bahasa Indonesia', kelas: 'X IPS 1', hari: 'Senin', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 4 },
  { id: 8, guru_id: 2, sekolah_id: 1, mata_pelajaran: 'Bahasa Indonesia', kelas: 'X IPS 2', hari: 'Rabu', jam_mulai: '07:00', jam_selesai: '09:00', total_jam: 2, periode_bulan: 6, periode_tahun: 2026, created_by: 4 },
  // Guru 3 - Overload
  { id: 9, guru_id: 3, sekolah_id: 1, mata_pelajaran: 'Fisika', kelas: 'X IPA 1', hari: 'Senin', jam_mulai: '07:00', jam_selesai: '10:00', total_jam: 3, periode_bulan: 6, periode_tahun: 2026, created_by: 5 },
  { id: 10, guru_id: 3, sekolah_id: 1, mata_pelajaran: 'Fisika', kelas: 'X IPA 2', hari: 'Selasa', jam_mulai: '07:00', jam_selesai: '10:00', total_jam: 3, periode_bulan: 6, periode_tahun: 2026, created_by: 5 },
  { id: 11, guru_id: 3, sekolah_id: 1, mata_pelajaran: 'Fisika', kelas: 'XI IPA 1', hari: 'Rabu', jam_mulai: '07:00', jam_selesai: '10:00', total_jam: 3, periode_bulan: 6, periode_tahun: 2026, created_by: 5 },
  { id: 12, guru_id: 3, sekolah_id: 1, mata_pelajaran: 'Fisika', kelas: 'XI IPA 2', hari: 'Kamis', jam_mulai: '07:00', jam_selesai: '10:00', total_jam: 3, periode_bulan: 6, periode_tahun: 2026, created_by: 5 },
  { id: 13, guru_id: 3, sekolah_id: 1, mata_pelajaran: 'Fisika', kelas: 'XII IPA 1', hari: 'Jumat', jam_mulai: '07:00', jam_selesai: '10:00', total_jam: 3, periode_bulan: 6, periode_tahun: 2026, created_by: 5 },
];

// Helper: hitung total jam mengajar per minggu dari jadwal
export function hitungTotalJam(jadwalList) {
  return jadwalList.reduce((sum, j) => sum + (j.total_jam || 0), 0);
}

// Helper: tentukan status beban mengajar
export function getStatus(totalJamPerMinggu) {
  if (totalJamPerMinggu < 24) return 'underload';
  if (totalJamPerMinggu > 40) return 'overload';
  return 'normal';
}

export function getStatusLabel(status) {
  if (status === 'overload') return 'Overload';
  if (status === 'underload') return 'Underload';
  return 'Normal';
}
