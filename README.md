# Dashboard Beban Kerja & Distribusi Jam Mengajar Tenaga Pendidik
**Dinas Pendidikan Kota Palembang** — v1.0 (Sprint 1)

## Teknologi
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router v6
- **Icons**: Lucide React

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev

# 3. Buka di browser
http://localhost:5173
```

## Akun Demo

| Peran          | Email                                     | Password   |
|----------------|-------------------------------------------|------------|
| Admin Dinas    | admin@disdik.palembang.go.id              | admin123   |
| Kepala Sekolah | kepsek.sman1@palembang.go.id              | kepsek123  |
| Guru           | budi.santoso@guru.palembang.go.id         | guru123    |
| Operator       | operator.sman1@palembang.go.id            | op123      |

## Fitur yang Diimplementasi (Sprint 1 & 2)
- ✅ FR-001 Login sistem dengan role-based redirect
- ✅ FR-002 Logout
- ✅ FR-003 Manajemen Pengguna (Admin)
- ✅ FR-005 Input Jadwal Mengajar
- ✅ FR-006 Edit Jadwal Mengajar
- ✅ FR-007 Hapus Jadwal Mengajar
- ✅ FR-008 Validasi Input Data (real-time)
- ✅ FR-009 Dashboard Ringkasan Beban Mengajar
- ✅ FR-010 Perhitungan Beban Otomatis (overload/underload)
- ✅ FR-012 Bar Chart perbandingan beban guru
- ✅ FR-013 Pie Chart distribusi per mata pelajaran
- ✅ FR-014 Line Chart tren jam mengajar
- ✅ FR-015 Filter data (sekolah, periode)
- ✅ FR-016 Ekspor CSV
- ✅ FR-017 Ekspor PDF (via browser print)
- ✅ FR-018 Rekap Jam Mengajar

## Struktur Folder
```
src/
├── components/       # Komponen reusable (AppLayout, dll)
├── context/          # AuthContext, JadwalContext (state global)
├── data/             # mockData.js (data dummy)
├── pages/            # Halaman utama
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── InputJadwalPage.jsx
│   ├── LaporanPage.jsx
│   └── ManajemenPenggunaPage.jsx
├── utils/            # Helper functions (opsional)
├── App.jsx           # Routing utama
├── main.jsx          # Entry point
└── index.css         # Tailwind + custom styles
```

## Catatan Pengembangan Selanjutnya
- Integrasi REST API (Laravel/Node.js) menggantikan mockData
- Autentikasi JWT dari backend
- Database MySQL/PostgreSQL
- Deployment ke VPS Linux + Nginx
