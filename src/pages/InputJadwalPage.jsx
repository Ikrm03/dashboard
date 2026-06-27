// src/pages/InputJadwalPage.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJadwal } from '../context/JadwalContext';
import { GURU_DATA, USERS, HARI_LIST, MAPEL_LIST, hitungTotalJam, getStatus } from '../data/mockData';
import { Plus, Pencil, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

const EMPTY_FORM = {
  mata_pelajaran: '',
  kelas: '',
  hari: 'Senin',
  jam_mulai: '07:00',
  jam_selesai: '09:00',
  periode_bulan: 6,
  periode_tahun: 2026,
};

function hitungDurasiJam(mulai, selesai) {
  if (!mulai || !selesai) return 0;
  const [h1, m1] = mulai.split(':').map(Number);
  const [h2, m2] = selesai.split(':').map(Number);
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  return Math.max(0, parseFloat((diff / 60).toFixed(2)));
}

export default function InputJadwalPage() {
  const { user } = useAuth();
  const { jadwalList, tambahJadwal, editJadwal, hapusJadwal } = useJadwal();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Cari guru dari user yang login
  const guruData = GURU_DATA.find(g => g.user_id === user?.id);

  // Jadwal milik guru ini
  const jadwalGuru = useMemo(() => {
    if (!guruData) return [];
    return jadwalList.filter(j => j.guru_id === guruData.id);
  }, [jadwalList, guruData]);

  const totalJamMingguIni = hitungTotalJam(jadwalGuru);
  const status = getStatus(totalJamMingguIni);

  // Persen untuk progress bar (maks 50)
  const persen = Math.min((totalJamMingguIni / 50) * 100, 100);
  const progressColor = status === 'overload' ? 'bg-red-500' : status === 'underload' ? 'bg-yellow-400' : 'bg-green-500';

  function validate() {
    const e = {};
    const durasi = hitungDurasiJam(form.jam_mulai, form.jam_selesai);
    if (!form.mata_pelajaran) e.mata_pelajaran = 'Wajib diisi';
    if (!form.kelas) e.kelas = 'Wajib diisi';
    if (durasi <= 0) e.jam = 'Jam selesai harus setelah jam mulai';
    if (durasi > 12) e.jam = 'Durasi mengajar maksimal 12 jam/hari';
    // Cek duplikat
    const duplikat = jadwalGuru.find(j =>
      j.hari === form.hari && j.kelas === form.kelas &&
      j.mata_pelajaran === form.mata_pelajaran && j.id !== editId
    );
    if (duplikat) e.duplikat = 'Jadwal untuk kelas & mapel di hari ini sudah ada';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    setErrors({});

    const total_jam = hitungDurasiJam(form.jam_mulai, form.jam_selesai);
    const payload = { ...form, total_jam, guru_id: guruData.id, sekolah_id: guruData.sekolah_id, created_by: user.id };

    if (editId) {
      editJadwal(editId, payload);
      setSuccess('Jadwal berhasil diperbarui!');
    } else {
      tambahJadwal(payload);
      setSuccess('Jadwal berhasil ditambahkan!');
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setTimeout(() => setSuccess(''), 3000);
  }

  function handleEdit(j) {
    setForm({
      mata_pelajaran: j.mata_pelajaran,
      kelas: j.kelas,
      hari: j.hari,
      jam_mulai: j.jam_mulai,
      jam_selesai: j.jam_selesai,
      periode_bulan: j.periode_bulan,
      periode_tahun: j.periode_tahun,
    });
    setEditId(j.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleHapus(id) {
    if (confirm('Hapus jadwal ini?')) hapusJadwal(id);
  }

  // Jika bukan guru/operator
  if (!guruData && user?.role !== 'operator') {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>Halaman ini hanya untuk Guru dan Operator.</p>
      </div>
    );
  }

  const durasiPreview = hitungDurasiJam(form.jam_mulai, form.jam_selesai);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-display font-bold text-gray-900">Input Jadwal Mengajar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tambah atau perbarui jadwal mengajar Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {editId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
          </h3>

          {success && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-100">
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <select className="input-field" value={form.mata_pelajaran} onChange={e => setForm(f => ({ ...f, mata_pelajaran: e.target.value }))}>
                  <option value="">-- Pilih --</option>
                  {MAPEL_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.mata_pelajaran && <p className="text-red-500 text-xs mt-1">{errors.mata_pelajaran}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <input className="input-field" placeholder="Contoh: X IPA 1" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} />
                {errors.kelas && <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
              <div className="flex gap-2 flex-wrap">
                {HARI_LIST.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, hari: h }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.hari === h
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-200 text-gray-600 hover:border-primary-400'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                <input type="time" className="input-field" value={form.jam_mulai} onChange={e => setForm(f => ({ ...f, jam_mulai: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                <input type="time" className="input-field" value={form.jam_selesai} onChange={e => setForm(f => ({ ...f, jam_selesai: e.target.value }))} />
              </div>
            </div>
            {errors.jam && <p className="text-red-500 text-xs -mt-2">{errors.jam}</p>}
            {durasiPreview > 0 && (
              <p className="text-xs text-gray-500">Durasi: <strong>{durasiPreview} jam</strong></p>
            )}

            {errors.duplikat && (
              <div className="flex items-center gap-2 text-orange-700 text-xs bg-orange-50 px-3 py-2 rounded-lg">
                <AlertTriangle size={14} /> {errors.duplikat}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                <Plus size={16} /> {editId ? 'Simpan Perubahan' : 'Tambah Jadwal'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); }}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Beban minggu ini */}
        <div className="card p-6 h-fit">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Beban Minggu Ini</h3>
          <div className="text-center mb-4">
            <p className="text-4xl font-display font-bold text-gray-900">{totalJamMingguIni}</p>
            <p className="text-sm text-gray-400">jam / minggu</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <div className={`h-3 rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${persen}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>0</span><span>24</span><span>40</span><span>50+</span>
          </div>
          <div className="text-center">
            <span className={`badge-${status} text-sm px-3 py-1`}>
              {status === 'normal' ? '✓ Normal' : status === 'overload' ? '⚠ Overload' : '⬇ Underload'}
            </span>
            <p className="text-xs text-gray-400 mt-2">Standar Permendikbud: 24–40 jam/minggu</p>
          </div>
        </div>
      </div>

      {/* Daftar jadwal */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Daftar Jadwal Tersimpan</h3>
        </div>
        {jadwalGuru.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-300 text-sm">Belum ada jadwal.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Hari', 'Mata Pelajaran', 'Kelas', 'Jam', 'Durasi', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jadwalGuru.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-700 font-medium">{j.hari}</td>
                    <td className="px-5 py-3 text-gray-600">{j.mata_pelajaran}</td>
                    <td className="px-5 py-3 text-gray-600">{j.kelas}</td>
                    <td className="px-5 py-3 text-gray-600">{j.jam_mulai} – {j.jam_selesai}</td>
                    <td className="px-5 py-3 text-gray-600">{j.total_jam} jam</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(j)} className="text-primary-600 hover:text-primary-800 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleHapus(j.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
