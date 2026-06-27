// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JadwalProvider } from './context/JadwalContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InputJadwalPage from './pages/InputJadwalPage';
import LaporanPage from './pages/LaporanPage';
import ManajemenPenggunaPage from './pages/ManajemenPenggunaPage';
import AppLayout from './components/AppLayout';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <JadwalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="jadwal" element={<InputJadwalPage />} />
              <Route path="laporan" element={<LaporanPage />} />
              <Route path="pengguna" element={<ManajemenPenggunaPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </JadwalProvider>
    </AuthProvider>
  );
}
