// src/pages/LaporanPage.jsx
import { useState, useMemo } from 'react';
import { useJadwal } from '../context/JadwalContext';
import { GURU_DATA, USERS, SCHOOLS, hitungTotalJam, getStatus, getStatusLabel } from '../data/mockData';
import { Download, FileText, Table2 } from 'lucide-react';

const BULAN_LABEL = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function LaporanPage() {
  const { jadwalList } = useJadwal();
  const [filterSekolah, setFilterSekolah] = useState('all');
  const [filterGuru, setFilterGuru] = useState('all');
  const [filterBulan, setFilterBulan] = useState('6');

  const rekap = useMemo(() => {
    return GURU_DATA
      .filter(g => filterGuru === 'all' || g.id === parseInt(filterGuru))
      .filter(g => filterSekolah === 'all' || g.sekolah_id === parseInt(filterSekolah))
      .map(g => {
        const jadwalGuru = jadwalList.filter(j => {
          const bulanOk = filterBulan === 'all' || j.periode_bulan === parseInt(filterBulan);
          return j.guru_id === g.id && bulanOk;
        });
        const totalJam = hitungTotalJam(jadwalGuru);
        const status = getStatus(totalJam);
        const userData = USERS.find(u => u.id === g.user_id);
        const sekolah = SCHOOLS.find(s => s.id === g.sekolah_id);
        return {
          nama: userData?.nama || '-',
          nik: g.nik,
          mata_pelajaran: g.mata_pelajaran,
          sekolah: sekolah?.nama_sekolah || '-',
          totalJam,
          status,
          statusLabel: getStatusLabel(status),
          periode: filterBulan === 'all' ? 'Semua' : BULAN_LABEL[parseInt(filterBulan)] + ' 2026',
        };
      });
  }, [jadwalList, filterSekolah, filterGuru, filterBulan]);

  function exportCSV() {
    const header = ['Nama Guru', 'NIK', 'Mata Pelajaran', 'Sekolah', 'Periode', 'Total Jam/Minggu', 'Status'];
    const rows = rekap.map(r => [r.nama, r.nik, r.mata_pelajaran, r.sekolah, r.periode, r.totalJam, r.statusLabel]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-beban-mengajar-${Date.now()}.csv`;
    a.click();
  }

  function exportPDF() {
    // Buka print dialog browser sebagai alternatif PDF
    window.print();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-gray-900">Laporan Distribusi Jam Mengajar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ekspor rekap jam mengajar per guru, sekolah, dan periode</p>
      </div>

      {/* Filter */}
      <div className="card p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sekolah</label>
          <select className="input-field w-48" value={filterSekolah} onChange={e => setFilterSekolah(e.target.value)}>
            <option value="all">Semua Sekolah</option>
            {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.nama_sekolah}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Guru</label>
          <select className="input-field w-48" value={filterGuru} onChange={e => setFilterGuru(e.target.value)}>
            <option value="all">Semua Guru</option>
            {GURU_DATA.map(g => {
              const u = USERS.find(u => u.id === g.user_id);
              return <option key={g.id} value={g.id}>{u?.nama}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Periode</label>
          <select className="input-field w-40" value={filterBulan} onChange={e => setFilterBulan(e.target.value)}>
            <option value="all">Semua Bulan</option>
            {BULAN_LABEL.slice(1).map((b, i) => <option key={i+1} value={i+1}>{b} 2026</option>)}
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={exportCSV} className="btn-secondary">
            <Table2 size={16} /> Ekspor CSV
          </button>
          <button onClick={exportPDF} className="btn-primary">
            <FileText size={16} /> Ekspor PDF
          </button>
        </div>
      </div>

      {/* Tabel rekap */}
      <div className="card overflow-hidden" id="print-area">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Rekap Jam Mengajar</h3>
          <span className="text-xs text-gray-400">{rekap.length} guru</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Nama Guru', 'NIK', 'Mata Pelajaran', 'Sekolah', 'Periode', 'Total Jam', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rekap.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{r.nama}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{r.nik}</td>
                  <td className="px-5 py-3 text-gray-600">{r.mata_pelajaran}</td>
                  <td className="px-5 py-3 text-gray-600">{r.sekolah}</td>
                  <td className="px-5 py-3 text-gray-500">{r.periode}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{r.totalJam} jam</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${r.status}`}>{r.statusLabel}</span>
                  </td>
                </tr>
              ))}
              {rekap.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-300">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
