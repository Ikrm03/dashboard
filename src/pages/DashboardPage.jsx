// src/pages/DashboardPage.jsx
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJadwal } from '../context/JadwalContext';
import { GURU_DATA, USERS, SCHOOLS, hitungTotalJam, getStatus } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, TrendingDown, Filter } from 'lucide-react';

const BAR_COLORS = { normal: '#10b981', overload: '#ef4444', underload: '#f59e0b' };
const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { jadwalList } = useJadwal();
  const [filterSekolah, setFilterSekolah] = useState('all');
  const [filterPeriode, setFilterPeriode] = useState('6'); // bulan Juni

  const filteredJadwal = useMemo(() => {
    return jadwalList.filter(j => {
      const sekolahOk = filterSekolah === 'all' || j.sekolah_id === parseInt(filterSekolah);
      const periodeOk = filterPeriode === 'all' || j.periode_bulan === parseInt(filterPeriode);
      return sekolahOk && periodeOk;
    });
  }, [jadwalList, filterSekolah, filterPeriode]);

  // Hitung beban per guru
  const guruStats = useMemo(() => {
    return GURU_DATA.map(g => {
      const jadwalGuru = filteredJadwal.filter(j => j.guru_id === g.id);
      const totalJam = hitungTotalJam(jadwalGuru);
      const status = getStatus(totalJam);
      const userData = USERS.find(u => u.id === g.user_id);
      const sekolah = SCHOOLS.find(s => s.id === g.sekolah_id);
      return { ...g, totalJam, status, nama: userData?.nama || '-', sekolah: sekolah?.nama_sekolah || '-' };
    });
  }, [filteredJadwal]);

  const stats = useMemo(() => ({
    total: guruStats.length,
    normal: guruStats.filter(g => g.status === 'normal').length,
    overload: guruStats.filter(g => g.status === 'overload').length,
    underload: guruStats.filter(g => g.status === 'underload').length,
  }), [guruStats]);

  // Bar chart data
  const barData = guruStats.map(g => ({
    name: g.nama.split(',')[0].split(' ').slice(0, 2).join(' '),
    'Total Jam': g.totalJam,
    fill: BAR_COLORS[g.status],
  }));

  // Pie chart - distribusi per mapel
  const mapelMap = {};
  filteredJadwal.forEach(j => {
    mapelMap[j.mata_pelajaran] = (mapelMap[j.mata_pelajaran] || 0) + j.total_jam;
  });
  const pieData = Object.entries(mapelMap).map(([name, value]) => ({ name, value }));

  // Line chart - tren bulanan (dummy)
  const lineData = BULAN.slice(0, 6).map((m, i) => ({
    bulan: m,
    'Rata-rata Jam': Math.round(20 + Math.random() * 15),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-gray-900">Dashboard Beban Kerja</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitoring distribusi jam mengajar tenaga pendidik</p>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select className="input-field w-auto text-sm" value={filterSekolah} onChange={e => setFilterSekolah(e.target.value)}>
            <option value="all">Semua Sekolah</option>
            {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.nama_sekolah}</option>)}
          </select>
          <select className="input-field w-auto text-sm" value={filterPeriode} onChange={e => setFilterPeriode(e.target.value)}>
            <option value="all">Semua Periode</option>
            {BULAN.map((b, i) => <option key={i+1} value={i+1}>{b} 2026</option>)}
          </select>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Guru" value={stats.total} icon={Users} color="bg-primary-50 text-primary-600" />
        <StatCard label="Beban Normal" value={stats.normal} icon={TrendingUp} color="bg-green-50 text-green-600" sub="24–40 jam/minggu" />
        <StatCard label="Overload" value={stats.overload} icon={AlertTriangle} color="bg-red-50 text-red-600" sub="> 40 jam/minggu" />
        <StatCard label="Underload" value={stats.underload} icon={TrendingDown} color="bg-yellow-50 text-yellow-600" sub="< 24 jam/minggu" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Perbandingan Beban Mengajar per Guru</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} jam`, 'Total Jam']} />
              <Bar dataKey="Total Jam" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span>Normal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block"></span>Overload</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block"></span>Underload</span>
          </div>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribusi per Mata Pelajaran</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">Tidak ada data</div>
          )}
        </div>
      </div>

      {/* Line chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Tren Rata-rata Jam Mengajar (Semester 1 — 2026)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={lineData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 50]} />
            <Tooltip />
            <Line type="monotone" dataKey="Rata-rata Jam" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel rekap */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Rekap Beban Mengajar Guru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Guru</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mata Pelajaran</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sekolah</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Jam/Minggu</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {guruStats.map(g => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{g.nama}</td>
                  <td className="px-5 py-3 text-gray-500">{g.mata_pelajaran}</td>
                  <td className="px-5 py-3 text-gray-500">{g.sekolah}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">{g.totalJam} jam</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`badge-${g.status}`}>
                      {g.status === 'normal' ? 'Normal' : g.status === 'overload' ? 'Overload' : 'Underload'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
