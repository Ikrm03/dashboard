// src/components/AppLayout.jsx
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CalendarDays, FileBarChart2,
  Users, LogOut, Menu, X, BookOpen, ChevronRight
} from 'lucide-react';

const ROLE_LABEL = {
  admin: 'Admin Dinas',
  kepala_sekolah: 'Kepala Sekolah',
  guru: 'Guru',
  operator: 'Operator Sekolah',
};

const ROLE_COLOR = {
  admin: 'bg-primary-100 text-primary-700',
  kepala_sekolah: 'bg-purple-100 text-purple-700',
  guru: 'bg-green-100 text-green-700',
  operator: 'bg-orange-100 text-orange-700',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'kepala_sekolah', 'guru', 'operator'] },
    { to: '/jadwal', label: 'Input Jadwal', icon: CalendarDays, roles: ['guru', 'operator'] },
    { to: '/laporan', label: 'Laporan', icon: FileBarChart2, roles: ['admin', 'kepala_sekolah'] },
    { to: '/pengguna', label: 'Manajemen Pengguna', icon: Users, roles: ['admin'] },
  ];

  const visibleNav = navItems.filter(n => n.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-200 flex flex-col bg-white border-r border-gray-100 shadow-sm z-10`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-primary-700 leading-tight">Dinas Pendidikan</p>
              <p className="text-xs text-gray-400 leading-tight">Kota Palembang</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {visibleNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.nama}</p>
            <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLOR[user?.role]}`}>
              {ROLE_LABEL[user?.role]}
            </span>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {sidebarOpen && <span>Keluar</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Dashboard Beban Kerja Guru</span>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
