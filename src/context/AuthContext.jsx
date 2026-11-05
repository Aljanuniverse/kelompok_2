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

const getStoredCustomUsers = () => {
  try {
    const raw = localStorage.getItem('helpdesk_custom_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function AuthProvider({ children }) {
  const [customUsers, setCustomUsers] = useState(getStoredCustomUsers);
  const allUsers = [...USERS, ...customUsers];

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('helpdesk_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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
          return { success: true, user: userData };
        }
      } catch (err) {
        return { success: false, message: err.message || err.error || 'Gagal login ke server Laravel.' };
      }
    }

    // Mock fallback mode (checks both default and custom registered users)
    const found = allUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && u.active
    );

    if (found) {
      setUser(found);
      try { localStorage.setItem('helpdesk_auth_user', JSON.stringify(found)); } catch {}
      return { success: true, user: found };
    }
    return { success: false, message: 'Email atau kata sandi salah.' };
  };

  const register = async ({ name, email, password, dept, role }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const exists = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk dengan akun yang sudah ada.' };
    }

    // Backend registration if not mock
    if (import.meta.env.VITE_USE_MOCK === 'false') {
      try {
        const res = await authService.register({
          name: name.trim(),
          email: normalizedEmail,
          password,
          password_confirmation: password,
          dept: dept || 'Umum',
          role: role || 'karyawan',
        });
        const token = res.token || res.data?.token || res.access_token;
        const userData = res.user || res.data?.user || res.data;
        if (token) localStorage.setItem('helpdesk_token', token);
        if (userData) {
          setUser(userData);
          localStorage.setItem('helpdesk_auth_user', JSON.stringify(userData));
          return { success: true, user: userData };
        }
      } catch (err) {
        return { success: false, message: err.message || err.error || 'Pendaftaran ke server backend gagal.' };
      }
    }

    // Mock registration
    const newId = Math.max(...allUsers.map(u => u.id), 10) + 1;
    const initials = name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'US';

    const newUser = {
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'karyawan',
      dept: dept || 'Umum',
      avatar: initials,
      active: true,
      registeredAt: new Date().toISOString(),
    };

    const nextCustom = [...customUsers, newUser];
    setCustomUsers(nextCustom);
    try {
      localStorage.setItem('helpdesk_custom_users', JSON.stringify(nextCustom));
    } catch {}

    // Auto login new registered user
    setUser(newUser);
    try {
      localStorage.setItem('helpdesk_auth_user', JSON.stringify(newUser));
    } catch {}

    return { success: true, user: newUser };
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
    const found = allUsers.find(u => u.id === Number(userId));
    if (found) {
      setUser(found);
      try { localStorage.setItem('helpdesk_auth_user', JSON.stringify(found)); } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      switchUser,
      USERS: allUsers,
      allUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
