import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer';

/* ── Minimalist Outline Icons ── */
const Icon = {
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  sunburst: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
      <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
      <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
    </svg>
  ),
  bar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V5"/><circle cx="12" cy="4" r="1.5"/>
      <line x1="8" y1="15" x2="8" y2="15.01"/><line x1="12" y1="15" x2="12" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
};

const navConfig = {
  karyawan: [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/complaints/new', icon: 'plus', label: 'Ajukan Tiket' },
    { path: '/complaints', icon: 'ticket', label: 'Pengaduan Saya', badge: true },
    { path: '/assistant', icon: 'bot', label: 'Asisten AI' },
  ],
  admin: [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/complaints', icon: 'ticket', label: 'Kelola Pengaduan', badge: true },
    { path: '/users', icon: 'users', label: 'Manajemen Akun' },
    { path: '/categories', icon: 'sliders', label: 'Data Master' },
    { path: '/reports', icon: 'bar', label: 'Laporan & Statistik' },
    { path: '/assistant', icon: 'bot', label: 'Asisten AI' },
  ],
  owner: [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/complaints', icon: 'ticket', label: 'Pengaduan Masuk', badge: true },
    { path: '/reports', icon: 'bar', label: 'Laporan' },
    { path: '/assistant', icon: 'bot', label: 'Asisten AI' },
  ],
};

const pageTitles = {
  '/dashboard': ['Helpdesk & Pengaduan', 'Pantau tiket, progres penanganan dan ringkasan aktivitas'],
  '/complaints': ['Daftar Pengaduan', 'Kelola dan lacak semua tiket kendala di perusahaan'],
  '/complaints/new': ['Ajukan Pengaduan', 'Laporkan kendala teknis atau fasilitas dengan mudah'],
  '/users': ['Manajemen Akun', 'Kelola kredensial pengguna dan hak akses sistem'],
  '/categories': ['Data Master', 'Konfigurasi kategori dan tingkat prioritas pengaduan'],
  '/reports': ['Laporan & Statistik', 'Analisis performa SLA, respon dan kepuasan pengguna'],
  '/profile': ['Profil & Akun', 'Pengaturan profil pribadi dan keamanan kata sandi'],
  '/assistant': ['Asisten Virtual AI', 'Tanya jawab seputar sistem pengaduan helpdesk'],
};

export default function Layout({ children }) {
  const { user, logout, switchUser, USERS } = useAuth();
  const { complaints, toasts } = useApp();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchVal, setSearchVal] = useState('');

  const nav = navConfig[user?.role] || [];
  const pendingCount = complaints.filter(c =>
    c.status === 'Baru' && (user?.role !== 'karyawan' || c.submittedBy === user?.id)
  ).length;

  const pathKey = Object.keys(pageTitles).find(k => location.pathname.startsWith(k) && k !== '/') || location.pathname;
  const [title, subtitle] = pageTitles[pathKey] || ['Helpdesk & Pengaduan', ''];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate('/complaints?q=' + encodeURIComponent(searchVal.trim()));
    }
  };

  return (
    <div className="app-shell">
      {/* ── SIDEBAR CONTAINER (FLOATING CAPSULE) ── */}
      <div className="sidebar-wrapper">
        {/* Sunburst Logo */}
        <div className="sidebar-brand-btn" title="Helpdesk Enterprise" onClick={() => navigate('/dashboard')}>
          {Icon.sunburst}
        </div>

        {/* White Capsule */}
        <aside className="sidebar">
          {/* Main Nav Items */}
          <nav className="sidebar-nav">
            {nav.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  className={`nav-item${isActive ? ' active' : ''}`}
                  data-label={item.label}
                  onClick={() => navigate(item.path)}
                >
                  {Icon[item.icon]}
                  {item.badge && pendingCount > 0 && (
                    <span className="nav-badge">{pendingCount > 9 ? '9+' : pendingCount}</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Settings & User */}
          <div className="sidebar-bottom">
            <div className="sidebar-divider" />
            <div className="nav-item" data-label="Pengaturan" onClick={() => navigate('/profile')}>
              {Icon.settings}
            </div>
            <div className="nav-item" data-label="Keluar" onClick={logout}>
              {Icon.logout}
            </div>
            {/* Avatar Pill */}
            <div
              className="sidebar-user"
              title={`${user?.name} (${user?.role})`}
              onClick={() => navigate('/profile')}
            >
              {user?.avatar}
            </div>
          </div>
        </aside>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="main-area">
        {/* Seamless Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="topbar-right">
            {/* Search Pill */}
            <form onSubmit={handleSearchSubmit} className="search-pill">
              <input
                placeholder="Search or ask tags..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              <button type="submit" className="search-btn-circle" title="Cari">
                {Icon.search}
              </button>
            </form>

            {/* Quick Demo Role Switcher */}
            {USERS && (
              <div className="role-pill-btn" title="Ganti akun untuk melihat tampilan Karyawan, Admin, atau Owner">
                <span
                  className="role-badge-icon"
                  style={{
                    background: user?.role === 'admin' ? '#2563eb' : user?.role === 'owner' ? '#7c3aed' : '#16a34a'
                  }}
                >
                  {user?.role === 'admin' ? '⚙️' : user?.role === 'owner' ? '👑' : '👤'}
                </span>
                <select
                  value={user?.id}
                  onChange={e => switchUser(e.target.value)}
                  className="role-pill-select"
                >
                  {USERS.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dark / Light Mode Switcher */}
            <div
              className="circle-btn theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? 'Ganti ke Mode Terang (White Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
            >
              {isDark ? Icon.sun : Icon.moon}
            </div>

            {/* Notification Bell Circle */}
            <div className="circle-btn" onClick={() => navigate('/complaints')} title="Pengaduan Baru">
              {Icon.bell}
              {pendingCount > 0 && <span className="circle-btn-dot" />}
            </div>

            {/* Assistant AI Circle */}
            <div className="circle-btn" onClick={() => navigate('/assistant')} title="Buka Asisten AI">
              {Icon.bot}
            </div>
          </div>
        </header>

        {/* Dynamic Page */}
        <main className="page">
          {children}
          <Footer />
        </main>
      </div>

      {/* ── FLOATING TOASTS ── */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {t.type === 'success' ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
            </svg>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
