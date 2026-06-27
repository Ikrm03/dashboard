// src/context/JadwalContext.jsx
import { createContext, useContext, useState } from 'react';
import { JADWAL_AWAL } from '../data/mockData';

const JadwalContext = createContext(null);

export function JadwalProvider({ children }) {
  const [jadwalList, setJadwalList] = useState(JADWAL_AWAL);
  const [nextId, setNextId] = useState(JADWAL_AWAL.length + 1);

  function tambahJadwal(data) {
    const newJadwal = { ...data, id: nextId };
    setJadwalList(prev => [...prev, newJadwal]);
    setNextId(n => n + 1);
    return newJadwal;
  }

  function editJadwal(id, data) {
    setJadwalList(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
  }

  function hapusJadwal(id) {
    setJadwalList(prev => prev.filter(j => j.id !== id));
  }

  return (
    <JadwalContext.Provider value={{ jadwalList, tambahJadwal, editJadwal, hapusJadwal }}>
      {children}
    </JadwalContext.Provider>
  );
}

export function useJadwal() {
  return useContext(JadwalContext);
}
