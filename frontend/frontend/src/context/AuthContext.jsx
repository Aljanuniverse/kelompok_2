import { createContext, useContext, useState } from 'react';
import { authService } from '../services/helpdeskService';

const AuthContext = createContext(null);

export const USERS = [
  { id: 1, name: 'Ahmad Fauzi', email: 'ahmad@perusahaan.co.id', password: '123456', role: 'karyawan', dept: 'IT', avatar: 'AF', active: true },
  { id: 2, name: 'Sari Dewi', email: 'sari@perusahaan.co.id', password: '123456', role: 'karyawan', dept: 'Finance', avatar: 'SD', active: true },
  { id: 3, name: 'Budi Santoso', email: 'budi@perusahaan.co.id', password: '123456', role: 'karyawan', dept: 'HR', avatar: 'BS', active: true },
  { id: 4, name: 'Admin Sistem', email: 'admin@perusahaan.co.id', password: 'admin123', role: 'admin', dept: 'IT', avatar: 'AS', active: true },
  { id: 5, name: 'Direktur Utama', email: 'owner@perusahaan.co.id', password: 'owner123', role: 'owner', dept: 'Management', avatar: 'DU', active: true },
  { id: 6, name: 'Manajer IT', email: 'manajer@perusahaan.co.id', password: '123456', role: 'owner', dept: 'IT', avatar: 'MI', active: true },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('helpdesk_auth_user');
      return saved ? JSON.parse(saved) : USERS[0];
    } catch {
      return USERS[0];
    }
  });

  const login = async (email, password) => {
    // If not mock mode, attempt authentication with Laravel backend API
    if (import.meta.env.VITE_USE_MOCK === 'false') {
      try {
        const res = await authService.login(email, password);
        const token = res.token || res.data?.token || res.access_token;
        const userData = res.user || res.data?.user || res.data;
        if (token) localStorage.setItem('helpdesk_token', token);
        if (userData) {
          setUser(userData);
          localStorage.setItem('helpdesk_auth_user', JSON.stringify(userData));
          return { success: true };
        }
      } catch (err) {
        return { success: false, message: err.message || err.error || 'Gagal login ke server Laravel.' };
      }
    }

    // Mock fallback mode
    const found = USERS.find(u => u.email === email && u.password === password && u.active);
    if (found) {
      setUser(found);
      try { localStorage.setItem('helpdesk_auth_user', JSON.stringify(found)); } catch {}
      return { success: true };
    }
    return { success: false, message: 'Email atau kata sandi salah.' };
  };

  const logout = async () => {
    if (import.meta.env.VITE_USE_MOCK === 'false') {
      try { await authService.logout(); } catch {}
    }
    setUser(null);
    try {
      localStorage.removeItem('helpdesk_auth_user');
      localStorage.removeItem('helpdesk_token');
    } catch {}
  };

  const updateProfile = (data) => setUser(prev => {
    const updated = { ...prev, ...data };
    try { localStorage.setItem('helpdesk_auth_user', JSON.stringify(updated)); } catch {}
    return updated;
  });

  const switchUser = (userId) => {
    const found = USERS.find(u => u.id === Number(userId));
    if (found) {
      setUser(found);
      try { localStorage.setItem('helpdesk_auth_user', JSON.stringify(found)); } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, switchUser, USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
