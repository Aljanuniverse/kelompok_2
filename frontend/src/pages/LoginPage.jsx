import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './LoginPage.css';

const HINTS = {
  karyawan: { email: 'ahmad@perusahaan.co.id', password: '123456', label: '👤 Karyawan' },
  admin:    { email: 'admin@perusahaan.co.id', password: 'admin123', label: '⚙️ Admin' },
  owner:    { email: 'owner@perusahaan.co.id', password: 'owner123', label: '👑 Owner' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [role, setRole] = useState('karyawan');
  const [email, setEmail] = useState(HINTS.karyawan.email);
  const [password, setPassword] = useState(HINTS.karyawan.password);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectRole = (r) => {
    setRole(r);
    setEmail(HINTS[r].email);
    setPassword(HINTS[r].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = login(email, password);
    if (res.success) navigate('/dashboard');
    else { setError(res.message); setLoading(false); }
  };

  const EyeIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      {open
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

  return (
    <div className="login-page">
      {/* Floating Theme Switcher */}
      <button
        type="button"
        className="login-theme-btn"
        onClick={toggleTheme}
        title={isDark ? 'Ganti ke Mode Terang (White Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
      >
        {isDark ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
      </button>

      <div className="login-wrap">

        {/* ── LEFT: Branding ── */}
        <div className="login-brand">
          <div>
            <div className="login-brand-logo">HD</div>
            <h2>Sistem Helpdesk<br />Perusahaan</h2>
            <p>Platform terpadu untuk pengelolaan pengaduan dan dukungan teknis karyawan.</p>

            <div className="login-brand-features">
              {['Manajemen pengaduan multi-level','Role-based access control','Dashboard & laporan real-time','Asisten Virtual berbasis AI','Riwayat & log perubahan status'].map(f => (
                <div key={f} className="login-brand-feat">
                  <span className="login-brand-feat-dot"/>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="login-brand-footer">© 2025 Helpdesk System · v2.0</div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="login-form-side">
          <div className="login-form-title">Masuk ke Sistem</div>
          <div className="login-form-sub">Pilih peran dan masukkan kredensial Anda</div>

          {/* Role pills */}
          <div className="login-roles">
            {Object.entries(HINTS).map(([r, h]) => (
              <button key={r} type="button" className={`role-pill${role === r ? ' active' : ''}`} onClick={() => selectRole(r)}>
                {h.label}
              </button>
            ))}
          </div>

          {/* Hint */}
          <div className="login-hint-box">
            <strong>Demo: </strong>
            {HINTS[role].email} · {HINTS[role].password}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input id="email" className="form-input login-padded" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="nama@perusahaan.co.id" required autoComplete="email" />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Kata Sandi</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input id="password" className="form-input login-padded" type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password"
                  style={{ paddingRight: 36 }} />
                <button type="button" className="login-input-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button id="login-btn" type="submit" className="btn btn-dark btn-lg" style={{ width: '100%', marginTop: 4, justifyContent: 'center' }} disabled={loading}>
              {loading
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Memproses...</>
                : 'Masuk ke Sistem →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 20 }}>
            Butuh bantuan? Hubungi <span style={{ color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}>Administrator</span>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
