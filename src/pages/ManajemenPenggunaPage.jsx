// src/pages/ManajemenPenggunaPage.jsx
import { useState } from 'react';
import { USERS, SCHOOLS } from '../data/mockData';
import { Plus, Pencil, Trash2, Search, UserCheck, UserX } from 'lucide-react';

const ROLE_LABEL = {
  admin: 'Admin Dinas',
  kepala_sekolah: 'Kepala Sekolah',
  guru: 'Guru',
  operator: 'Operator',
};
const ROLE_COLOR = {
  admin: 'bg-primary-100 text-primary-700',
  kepala_sekolah: 'bg-purple-100 text-purple-700',
  guru: 'bg-green-100 text-green-700',
  operator: 'bg-orange-100 text-orange-700',
};

export default function ManajemenPenggunaPage() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nama: '', email: '', role: 'guru', sekolah_id: '', is_active: 1 });

  const filtered = users.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  function openAdd() {
    setEditUser(null);
    setForm({ nama: '', email: '', role: 'guru', sekolah_id: '', is_active: 1 });
    setShowModal(true);
  }

  function openEdit(u) {
    setEditUser(u);
    setForm({ nama: u.nama, email: u.email, role: u.role, sekolah_id: u.sekolah_id || '', is_active: u.is_active });
    setShowModal(true);
  }

  function handleSave() {
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      const newUser = { ...form, id: Date.now(), password: 'user123', sekolah_id: form.sekolah_id || null };
      setUsers(prev => [...prev, newUser]);
    }
    setShowModal(false);
  }

  function toggleActive(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: u.is_active === 1 ? 0 : 1 } : u));
  }

  function handleDelete(id) {
    if (confirm('Hapus pengguna ini?')) setUsers(prev => prev.filter(u => u.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola akun dan hak akses pengguna sistem</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      {/* Filter */}
      <div className="card p-4 flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-44" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="all">Semua Peran</option>
          {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} pengguna</span>
      </div>

      {/* Tabel */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Nama', 'Email', 'Peran', 'Sekolah', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const sekolah = SCHOOLS.find(s => s.id === u.sekolah_id);
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{u.nama}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLOR[u.role]}`}>{ROLE_LABEL[u.role]}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{sekolah?.nama_sekolah || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="text-primary-600 hover:text-primary-800"><Pencil size={15} /></button>
                        <button onClick={() => toggleActive(u.id)} className={u.is_active ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'}>
                          {u.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-5">{editUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input className="input-field" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                <select className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sekolah</label>
                <select className="input-field" value={form.sekolah_id} onChange={e => setForm(f => ({ ...f, sekolah_id: e.target.value ? parseInt(e.target.value) : '' }))}>
                  <option value="">— (Dinas Pendidikan) —</option>
                  {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.nama_sekolah}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">Simpan</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
