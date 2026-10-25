import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="footer-top">
        {/* Brand & Status */}
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">🛡️</span>
            <div>
              <div className="footer-logo-title">Helpdesk Support System</div>
              <div className="footer-logo-sub">Enterprise Internal Ticket Portal</div>
            </div>
          </div>
          <div className="footer-status-pill">
            <span className="status-dot-pulse" />
            <span>Semua Layanan Normal · SLA 99.8%</span>
          </div>
          <p className="footer-desc">
            Platform terpadu pelaporan kendala IT, fasilitas, dan manajemen tiket perusahaan secara terstruktur dan transparan.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <div className="footer-heading">Navigasi Cepat</div>
          <ul className="footer-links">
            <li>
              <button onClick={() => navigate('/dashboard')} className="footer-link">
                Dashboard Utama
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/complaints')} className="footer-link">
                Pengaduan
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/assistant')} className="footer-link">
                🤖 Tanya Asisten Virtual AI
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/profile')} className="footer-link">
                Pengaturan Akun & Profil
              </button>
            </li>
          </ul>
        </div>

        {/* Help & Support */}
        <div className="footer-col">
          <div className="footer-heading">Bantuan & Kontak IT</div>
          <div className="footer-contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <div className="contact-label">Hotline IT Support:</div>
              <div className="contact-val">081318656214 (08:00 - 17:00)</div>
            </div>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon">✉️</span>
            <div>
              <div className="contact-label">Email Dukungan:</div>
              <div className="contact-val">antasenaouttdoorofficial98@gmail.com</div>
            </div>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon">🏢</span>
            <div>
              <div className="contact-label">Lokasi Tim Teknisi:</div>
              <div className="contact-val">Jalan Industri</div>
            </div>
          </div>
        </div>

        {/* Theme & Preferences */}
        <div className="footer-col footer-prefs">
          <div className="footer-heading">Tampilan & Tema</div>
          <p className="footer-subtext">
            Sesuaikan kenyamanan mata dengan beralih ke Mode Gelap atau Mode Terang.
          </p>
          <div className="footer-theme-toggle">
            <button
              className={`footer-theme-btn ${!isDark ? 'active' : ''}`}
              onClick={() => theme === 'dark' && toggleTheme()}
              title="Aktifkan Mode Terang (White Mode)"
            >
              ☀️ Mode Terang
            </button>
            <button
              className={`footer-theme-btn ${isDark ? 'active' : ''}`}
              onClick={() => theme === 'light' && toggleTheme()}
              title="Aktifkan Mode Gelap (Dark Mode)"
            >
              🌙 Mode Gelap
            </button>
          </div>
          <div className="footer-version-badge">
            <span>Versi Sistem</span>
            <strong>v1.0.0</strong>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copy">
          © {new Date().getFullYear()} <strong>Helpdesk & Support System</strong>. Hak Cipta Dilindungi Undang-Undang.
        </div>
        <div className="footer-bottom-links">
          <span>Standar Operasional Prosedur (SOP)</span>
          <span>·</span>
          <span>Kebijakan Privasi</span>
          <span>·</span>
          <span>Keamanan Data</span>
        </div>
      </div>
    </footer>
  );
}
