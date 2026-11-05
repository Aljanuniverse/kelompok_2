import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './LoginPage.css';

const HINTS = {
  karyawan: { email: 'ahmad@perusahaan.co.id', password: '123456', label: '👤 Karyawan', desc: 'Pelapor kendala IT & fasilitas' },
  admin:    { email: 'admin@perusahaan.co.id', password: 'admin123', label: '⚙️ Admin', desc: 'Teknisi penangan tiket & master data' },
  owner:    { email: 'owner@perusahaan.co.id', password: 'owner123', label: '👑 Owner', desc: 'Pimpinan & monitoring laporan' },
};

const DEPARTMENTS = [
  'IT & Sistem Informasi',
  'Keuangan & Accounting',
  'SDM & Human Resource',
  'Operasional & Lapangan',
  'Pemasaran & Sales',
  'Fasilitas & General Affairs (GA)',
  'Direksi & Manajemen',
];

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    {open
      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    }
  </svg>
);

export default function LoginPage() {
  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Mode: 'login' or 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [role, setRole] = useState('karyawan');
  const [email, setEmail] = useState(HINTS.karyawan.email);
  const [password, setPassword] = useState(HINTS.karyawan.password);
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState(DEPARTMENTS[0]);
  const [regRole, setRegRole] = useState('karyawan');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regAgree, setRegAgree] = useState(true);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Guide modal state
  const [showGuideModal, setShowGuideModal] = useState(false);

  const selectRole = (r) => {
    setRole(r);
    setEmail(HINTS[r].email);
    setPassword(HINTS[r].password);
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setLoginError(res.message || 'Email atau kata sandi tidak cocok.');
        setLoginLoading(false);
      }
    } catch {
      setLoginError('Terjadi kesalahan saat masuk. Silakan coba kembali.');
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    // Form validations
    if (!regName.trim() || regName.trim().length < 3) {
      setRegError('Nama lengkap minimal harus 3 karakter.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Masukkan alamat email yang valid.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setRegError('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
      return;
    }
    if (!regAgree) {
      setRegError('Anda harus menyetujui ketentuan Helpdesk sebelum mendaftar.');
      return;
    }

    setRegLoading(true);
    await new Promise(r => setTimeout(r, 600));

    try {
      const res = await register({
        name: regName,
        email: regEmail,
        dept: regDept,
        role: regRole,
        password: regPassword,
      });

      if (res.success) {
        setRegSuccess('Pendaftaran berhasil! Mengalihkan ke Dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setRegError(res.message || 'Gagal melakukan pendaftaran.');
        setRegLoading(false);
      }
    } catch {
      setRegError('Terjadi kesalahan saat pendaftaran.');
      setRegLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Top Floating Controls */}
      <div className="login-top-bar">
        <button
          type="button"
          className="login-guide-pill-btn"
          onClick={() => setShowGuideModal(true)}
          title="Baca panduan alur dan cara penggunaan sistem helpdesk"
        >
          <span>📘</span>
          <strong>Panduan Sistem & SOP</strong>
        </button>

        <button
          type="button"
          className="login-theme-btn"
          onClick={toggleTheme}
          title={isDark ? 'Ganti ke Mode Terang (White Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
        >
          {isDark ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
        </button>
      </div>

      <div className="login-wrap">
        {/* ── LEFT: Branding & Flow Summary ── */}
        <div className="login-brand">
          <div>
            <div className="login-brand-header">
              <div className="login-brand-logo">HD</div>
              <div className="login-brand-badge">Helpdesk v2.0</div>
            </div>

            <h2>Sistem Helpdesk &<br />Pelaporan Kendala</h2>
            <p>
              Portal terpadu untuk pengajuan tiket, penanganan kendala IT & fasilitas kantor, 
              serta pemantauan status penyelesaian secara real-time.
            </p>

            {/* Quick 4 Steps Overview */}
            <div className="login-steps-box">
              <div className="login-steps-title">Alur Masuk & Penggunaan:</div>
              <div className="login-step-item">
                <span className="login-step-num">1</span>
                <div>
                  <strong>Masuk atau Daftar Akun</strong>
                  <p>Akses akun dengan role Karyawan, Admin, atau Owner.</p>
                </div>
              </div>
              <div className="login-step-item">
                <span className="login-step-num">2</span>
                <div>
                  <strong>Ajukan Pengaduan Baru</strong>
                  <p>Tuliskan detail kendala, pilih kategori & urgensi.</p>
                </div>
              </div>
              <div className="login-step-item">
                <span className="login-step-num">3</span>
                <div>
                  <strong>Pantau Pengerjaan Teknisi</strong>
                  <p>Lacak status tiket & berdiskusi via kolom pesan.</p>
                </div>
              </div>
              <div className="login-step-item">
                <span className="login-step-num">4</span>
                <div>
                  <strong>Selesai & Beri Penilaian</strong>
                  <p>Tutup pengaduan dan beri rating kepuasan layanan.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="login-brand-guide-btn"
              onClick={() => setShowGuideModal(true)}
            >
              📖 Buka Buku Panduan Lengkap
            </button>
          </div>

          <div className="login-brand-footer">
            <span>© {new Date().getFullYear()} Helpdesk Support Enterprise</span>
            <span>· SLA 99.8%</span>
          </div>
        </div>

        {/* ── RIGHT: Auth Forms (Login / Register Tabs) ── */}
        <div className="login-form-side">
          {/* Tab Selector */}
          <div className="login-tab-container">
            <button
              type="button"
              className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Masuk (Login)
            </button>
            <button
              type="button"
              className={`login-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setRegError(''); }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Daftar Akun Baru
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: LOGIN FORM */}
          {/* ========================================================= */}
          {activeTab === 'login' && (
            <div className="login-tab-content">
              <div className="login-form-header">
                <h3 className="login-form-title">Selamat Datang Kembali</h3>
                <p className="login-form-sub">Pilih akun demo cepat atau masukkan email & kata sandi Anda</p>
              </div>

              {/* Demo Role Pills */}
              <div className="login-roles-section">
                <span className="login-roles-label">Pilih Akun Cepat (Demo):</span>
                <div className="login-roles">
                  {Object.entries(HINTS).map(([r, h]) => (
                    <button
                      key={r}
                      type="button"
                      className={`role-pill${role === r ? ' active' : ''}`}
                      onClick={() => selectRole(r)}
                      title={h.desc}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hint Box */}
              <div className="login-hint-box">
                <div className="login-hint-title">
                  <span>💡 Kredensial Role {role.toUpperCase()}:</span>
                </div>
                <div className="login-hint-details">
                  <code>{HINTS[role].email}</code> · Kata sandi: <code>{HINTS[role].password}</code>
                </div>
              </div>

              <form className="login-form" onSubmit={handleLoginSubmit}>
                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Alamat Email</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      id="email"
                      className="form-input login-padded"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.co.id"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="password">Kata Sandi</label>
                    <span
                      className="login-forgot-link"
                      onClick={() => alert('Untuk akun demo, silakan gunakan kata sandi yang tertera di kotak petunjuk di atas.')}
                    >
                      Lupa sandi?
                    </span>
                  </div>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      id="password"
                      className="form-input login-padded"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: 36 }}
                    />
                    <button
                      type="button"
                      className="login-input-pw-toggle"
                      onClick={() => setShowPw(v => !v)}
                      aria-label="Toggle password visibility"
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                {loginError && <div className="login-error">{loginError}</div>}

                <button
                  id="login-btn"
                  type="submit"
                  className="btn btn-dark btn-lg login-submit-btn"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Memverifikasi Akun...
                    </>
                  ) : (
                    'Masuk ke Dashboard →'
                  )}
                </button>
              </form>

              <div className="login-switch-footer">
                Belum memiliki akun terdaftar?{' '}
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => { setActiveTab('register'); setRegError(''); }}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: REGISTER FORM */}
          {/* ========================================================= */}
          {activeTab === 'register' && (
            <div className="login-tab-content">
              <div className="login-form-header">
                <h3 className="login-form-title">Daftar Akun Baru</h3>
                <p className="login-form-sub">Lengkapi data diri Anda untuk mengakses sistem helpdesk</p>
              </div>

              <form className="login-form" onSubmit={handleRegisterSubmit}>
                {/* Nama Lengkap */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Nama Lengkap</label>
                  <input
                    id="reg-name"
                    className="form-input"
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    required
                  />
                </div>

                {/* Email Perusahaan & Departemen */}
                <div className="login-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">Email Kantor</label>
                    <input
                      id="reg-email"
                      className="form-input"
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="nama@perusahaan.co.id"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-dept">Departemen</label>
                    <select
                      id="reg-dept"
                      className="form-input"
                      value={regDept}
                      onChange={e => setRegDept(e.target.value)}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Peran / Hak Akses */}
                <div className="form-group">
                  <label className="form-label">Pilih Peran Akun:</label>
                  <div className="register-role-grid">
                    <label className={`register-role-card ${regRole === 'karyawan' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="regRole"
                        value="karyawan"
                        checked={regRole === 'karyawan'}
                        onChange={() => setRegRole('karyawan')}
                      />
                      <div className="role-card-badge">👤 Karyawan</div>
                      <div className="role-card-desc">Pelapor kendala</div>
                    </label>

                    <label className={`register-role-card ${regRole === 'admin' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="regRole"
                        value="admin"
                        checked={regRole === 'admin'}
                        onChange={() => setRegRole('admin')}
                      />
                      <div className="role-card-badge">⚙️ Admin</div>
                      <div className="role-card-desc">Teknisi & Kelola</div>
                    </label>

                    <label className={`register-role-card ${regRole === 'owner' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="regRole"
                        value="owner"
                        checked={regRole === 'owner'}
                        onChange={() => setRegRole('owner')}
                      />
                      <div className="role-card-badge">👑 Owner</div>
                      <div className="role-card-desc">Pimpinan / Laporan</div>
                    </label>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="login-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-pw">Kata Sandi</label>
                    <div className="login-input-wrap">
                      <input
                        id="reg-pw"
                        className="form-input"
                        type={showRegPw ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Min. 6 karakter"
                        required
                        style={{ paddingRight: 34 }}
                      />
                      <button
                        type="button"
                        className="login-input-pw-toggle"
                        onClick={() => setShowRegPw(v => !v)}
                        aria-label="Toggle password visibility"
                      >
                        <EyeIcon open={showRegPw} />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-pwc">Ulangi Sandi</label>
                    <input
                      id="reg-pwc"
                      className="form-input"
                      type={showRegPw ? 'text' : 'password'}
                      value={regPasswordConfirm}
                      onChange={e => setRegPasswordConfirm(e.target.value)}
                      placeholder="Konfirmasi kata sandi"
                      required
                    />
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <label className="login-agreement-check">
                  <input
                    type="checkbox"
                    checked={regAgree}
                    onChange={e => setRegAgree(e.target.checked)}
                  />
                  <span>
                    Saya menyetujui kebijakan operasional dan SOP pelaporan Helpdesk internal.
                  </span>
                </label>

                {regError && <div className="login-error">{regError}</div>}
                {regSuccess && <div className="login-success">{regSuccess}</div>}

                <button
                  type="submit"
                  className="btn btn-dark btn-lg login-submit-btn"
                  disabled={regLoading}
                >
                  {regLoading ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Mendaftarkan Akun...
                    </>
                  ) : (
                    'Daftar & Masuk ke Dashboard →'
                  )}
                </button>
              </form>

              <div className="login-switch-footer">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => { setActiveTab('login'); setLoginError(''); }}
                >
                  Masuk di sini
                </button>
              </div>
            </div>
          )}

          {/* Quick Help Guide link on footer */}
          <div className="login-footer-help">
            <span>Bingung cara menggunakan sistem? </span>
            <button
              type="button"
              className="login-guide-link"
              onClick={() => setShowGuideModal(true)}
            >
              📖 Baca Buku Panduan Sistem
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: PANDUAN PENGGUNAAN SISTEM (QUICK GUIDE MODAL) */}
      {/* ========================================================= */}
      {showGuideModal && (
        <div className="guide-modal-backdrop" onClick={() => setShowGuideModal(false)}>
          <div className="guide-modal-card" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="guide-modal-header">
              <div className="guide-modal-title-wrap">
                <span className="guide-modal-icon">📘</span>
                <div>
                  <h4>Buku Panduan & SOP Helpdesk</h4>
                  <p>Petunjuk alur masuk sistem, peran pengguna, dan pembuatan pengaduan</p>
                </div>
              </div>
              <button
                type="button"
                className="guide-modal-close-btn"
                onClick={() => setShowGuideModal(false)}
                title="Tutup Panduan"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="guide-modal-body">
              {/* Section 1: Alur Masuk */}
              <div className="guide-section-block">
                <h5>1. Alur Masuk & Pendaftaran Akun (Wajib Login)</h5>
                <p>
                  Untuk menjamin keamanan data internal dan akuntabilitas penanganan masalah,
                  setiap pengguna <strong>harus login atau mendaftar terlebih dahulu</strong> sebelum
                  dapat mengakses halaman dashboard maupun membuat tiket.
                </p>
                <div className="guide-steps-grid">
                  <div className="guide-step-card">
                    <div className="guide-step-badge">Langkah A</div>
                    <strong>Pilih Tab Masuk / Daftar</strong>
                    <p>Gunakan tab <em>Masuk</em> jika sudah punya akun, atau tab <em>Daftar Akun Baru</em> jika baru pertama kali.</p>
                  </div>
                  <div className="guide-step-card">
                    <div className="guide-step-badge">Langkah B</div>
                    <strong>Tentukan Peran (Role)</strong>
                    <p>Pilih peran yang sesuai dengan tugas Anda (Karyawan, Admin/Teknisi, atau Owner/Manajemen).</p>
                  </div>
                  <div className="guide-step-card">
                    <div className="guide-step-badge">Langkah C</div>
                    <strong>Masuk ke Dashboard</strong>
                    <p>Setelah terverifikasi, Anda akan otomatis dialihkan ke Dashboard kerja masing-masing peran.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Penjelasan 3 Role */}
              <div className="guide-section-block">
                <h5>2. Hak Akses & Peran Pengguna (Role System)</h5>
                <div className="guide-roles-table">
                  <div className="guide-role-row">
                    <div className="guide-role-tag karyawan">👤 Karyawan (Pelapor)</div>
                    <div className="guide-role-desc">
                      Dapat mengajukan tiket pengaduan baru, memantau histori pengaduan milik sendiri,
                      berdiskusi dengan teknisi di kolom komentar, serta memberikan rating kepuasan (bintang 1-5).
                    </div>
                  </div>
                  <div className="guide-role-row">
                    <div className="guide-role-tag admin">⚙️ Admin (Tim IT / Teknisi)</div>
                    <div className="guide-role-desc">
                      Menerima semua pengaduan yang masuk dari seluruh departemen, memperbarui status tiket,
                      menugaskan teknisi pelaksana, meneruskan tiket ke pimpinan jika perlu eskalasi, serta mengelola data master kategori.
                    </div>
                  </div>
                  <div className="guide-role-row">
                    <div className="guide-role-tag owner">👑 Owner (Pimpinan / Direksi)</div>
                    <div className="guide-role-desc">
                      Memantau ringkasan performa SLA, menyetujui pengaduan yang butuh kebijakan manajemen (Status: Menunggu Owner),
                      serta menganalisis laporan statistik kendala perusahaan.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Status Siklus Tiket */}
              <div className="guide-section-block">
                <h5>3. Siklus Status Pengaduan (Ticket Lifecycle)</h5>
                <div className="guide-status-flow">
                  <div className="status-flow-node">
                    <span className="status-pill-badge b-blue">Baru</span>
                    <p>Tiket baru diajukan oleh karyawan, menunggu ditinjau teknisi.</p>
                  </div>
                  <span className="status-flow-arrow">➔</span>
                  <div className="status-flow-node">
                    <span className="status-pill-badge b-orange">Sedang Diproses</span>
                    <p>Teknisi sedang melakukan investigasi dan perbaikan kendala.</p>
                  </div>
                  <span className="status-flow-arrow">➔</span>
                  <div className="status-flow-node">
                    <span className="status-pill-badge b-green">Selesai</span>
                    <p>Kendala sudah diperbaiki oleh teknisi IT/Fasilitas.</p>
                  </div>
                  <span className="status-flow-arrow">➔</span>
                  <div className="status-flow-node">
                    <span className="status-pill-badge b-gray">Ditutup</span>
                    <p>Pelapor mengonfirmasi perbaikan berhasil dan memberi rating.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Kontak Darurat */}
              <div className="guide-section-block contact-block">
                <h5>4. Butuh Bantuan Darurat?</h5>
                <p>Jika Anda mengalami kendala saat login atau terjadi insiden kritis:</p>
                <div className="guide-contact-pills">
                  <div className="contact-pill">📞 Hotline IT: <strong>081318656214</strong></div>
                  <div className="contact-pill">✉️ Email: <strong>antasenaouttdoorofficial98@gmail.com</strong></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="guide-modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setShowGuideModal(false)}
              >
                Saya Mengerti, Lanjut Masuk / Daftar →
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}