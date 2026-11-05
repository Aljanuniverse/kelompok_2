import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './GuidePage.css';

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'akun',
    q: 'Mengapa saya harus masuk / login atau mendaftar terlebih dahulu?',
    a: 'Sistem Helpdesk mengelola aset, data teknis, dan kendala operasional perusahaan. Login wajib dilakukan agar setiap pengaduan dapat dipertanggungjawabkan, terhubung ke departemen pemohon, dan memiliki histori riwayat penanganan yang transparan bagi teknisi dan manajemen.'
  },
  {
    id: 'faq-2',
    category: 'karyawan',
    q: 'Bagaimana cara mengajukan tiket kendala baru?',
    a: 'Klik menu "Ajukan Tiket" di navigasi sebelah kiri (atau klik tombol "Ajukan Tiket Sekarang"). Pilih kategori yang sesuai (misal Hardware, Jaringan, atau Software), tentukan tingkat urgensi/prioritas, lalu jelaskan kronologi kendala secara rinci. Setelah disimpan, tiket Anda akan segera masuk ke antrean teknisi IT.'
  },
  {
    id: 'faq-3',
    category: 'sla',
    q: 'Berapa lama estimasi waktu respon penanganan tiket (SLA)?',
    a: 'Target SLA disesuaikan dengan tingkat prioritas: Kritis (< 15 menit respon, selesai dlm 1-2 jam), Tinggi (< 30 menit respon, selesai dlm 4 jam), Sedang (< 1 jam respon, selesai dlm 12 jam), dan Rendah (< 2 jam respon, selesai dlm 24 jam).'
  },
  {
    id: 'faq-4',
    category: 'karyawan',
    q: 'Kapan saya boleh melakukan "Buka Kembali" (Reopen) tiket?',
    a: 'Jika tiket Anda sudah ditandai "Selesai" oleh teknisi namun kendala yang sama masih muncul kembali dalam waktu 1x24 jam, Anda dapat membuka halaman detail tiket tersebut dan mengklik tombol "Buka Kembali Tiket" disertai catatan tambahan.'
  },
  {
    id: 'faq-5',
    category: 'admin',
    q: 'Apa fungsi status "Menunggu Owner"?',
    a: 'Status ini digunakan oleh Admin ketika penyelesaian kendala memerlukan persetujuan biaya, pergantian unit hardware baru, atau otorisasi kebijakan dari Pimpinan/Owner sebelum teknisi dapat melanjutkan perbaikan.'
  },
  {
    id: 'faq-6',
    category: 'ai',
    q: 'Kapan sebaiknya saya berkonsultasi dengan Asisten Virtual AI?',
    a: 'Gunakan Asisten AI untuk pertolongan pertama pada kendala umum seperti: cara reset sambungan Wi-Fi, troubleshooting printer offline, shortcut keyboard, atau panduan ekspor dokumen sebelum memutuskan membuat tiket pengaduan resmi.'
  },
  {
    id: 'faq-7',
    category: 'kontak',
    q: 'Ke mana harus melapor jika sistem Helpdesk ini sedang down atau error?',
    a: 'Jika portal helpdesk tidak bisa diakses, hubungi langsung Tim Teknisi IT Support melalui Hotline: 081318656214 atau kirim email darurat ke antasenaouttdoorofficial98@gmail.com.'
  }
];

export default function GuidePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(['faq-1', 'faq-2']);

  const toggleFaq = (id) => {
    setOpenFaq(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter FAQ based on search
  const filteredFaq = FAQ_ITEMS.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });

  return (
    <div className="guide-page">
      {/* ── HERO BANNER ── */}
      <div className="guide-hero">
        <div className="guide-hero-badge">
          <span>📘</span> Buku Panduan Resmi & SOP Operasional
        </div>
        <h2>Pusat Panduan & Standar Operasional Helpdesk</h2>
        <p>
          Pelajari tata cara alur masuk sistem, pengajuan kendala teknis, siklus penanganan tiket, 
          waktu respon SLA, serta koordinasi antar departemen secara efisien dan transparan.
        </p>

        <div className="guide-hero-actions">
          {/* Real-time search filter */}
          <div className="guide-search-wrap">
            <span className="guide-search-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="guide-search-input"
              placeholder="Cari topik panduan (misal: tiket, SLA, login, rating)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Actions */}
          <div className="guide-hero-btns">
            <button type="button" className="guide-btn-outline" onClick={handlePrint} title="Cetak atau simpan sebagai dokumen PDF">
              🖨️ Cetak Dokumen SOP
            </button>
            <button type="button" className="guide-btn-primary" onClick={() => navigate('/assistant')} title="Konsultasi kendala mandiri">
              🤖 Tanya Asisten AI
            </button>
          </div>
        </div>
      </div>

      {/* ── 4-STEP VISUAL WORKFLOW ── */}
      <div className="guide-flow-card">
        <div className="guide-flow-header">
          <h3>Alur Kerja Pelaporan & Penanganan Kendala (4 Tahap)</h3>
          <span>SOP Standar Perusahaan</span>
        </div>
        <div className="guide-flow-grid">
          <div className="guide-flow-step">
            <div className="flow-step-num">1</div>
            <strong>Akses & Masuk Akun</strong>
            <p>Pengguna wajib login atau mendaftarkan akun sesuai peran (Karyawan, Admin, atau Owner).</p>
          </div>
          <div className="guide-flow-step">
            <div className="flow-step-num">2</div>
            <strong>Ajukan Pengaduan</strong>
            <p>Karyawan mengisi formulir keluhan lengkap dengan kategori masalah dan tingkat prioritas.</p>
          </div>
          <div className="guide-flow-step">
            <div className="flow-step-num">3</div>
            <strong>Penanganan Teknisi</strong>
            <p>Admin/Teknisi memverifikasi tiket, menugaskan PIC, dan melakukan perbaikan kendala.</p>
          </div>
          <div className="guide-flow-step">
            <div className="flow-step-num">4</div>
            <strong>Selesai & Evaluasi</strong>
            <p>Karyawan memastikan solusi berfungsi dengan baik, menutup tiket, dan memberikan rating bintang.</p>
          </div>
        </div>
      </div>

      {/* ── TAB PILLS ── */}
      <div className="guide-tabs">
        {[
          { id: 'all', label: '📋 Semua Panduan' },
          { id: 'karyawan', label: '👤 Panduan Karyawan' },
          { id: 'admin', label: '⚙️ Panduan Admin' },
          { id: 'owner', label: '👑 Panduan Owner' },
          { id: 'ai', label: '🤖 Tips Asisten AI' },
          { id: 'sla', label: '⏱️ SLA & Prioritas' },
          { id: 'faq', label: '❓ Tanya Jawab (FAQ)' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`guide-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="guide-content-area">
        {/* Main Column */}
        <div className="guide-main-col">

          {/* SECTION: ALUR MASUK & AKUN */}
          {(activeTab === 'all' || activeTab === 'karyawan' || activeTab === 'admin') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">🔐</span>
                <div>
                  <h3>1. Panduan Masuk Sistem & Manajemen Akun</h3>
                  <p>Ketentuan login, registrasi akun baru, dan keamanan profil pengguna</p>
                </div>
              </div>

              <div className="guide-instruction-list">
                <div className="instruction-item">
                  <div className="instruction-num">01</div>
                  <div className="instruction-body">
                    <h4>Wajib Masuk / Login Terlebih Dahulu</h4>
                    <p>
                      Halaman Dashboard dan fitur pengaduan dilindungi oleh sistem keamanan hak akses (Protected Routes). 
                      Setiap pengguna yang mengakses situs akan otomatis diarahkan ke halaman <strong>Login / Daftar</strong> terlebih dahulu.
                    </p>
                    <div className="instruction-tips">
                      💡 <strong>Tips:</strong> Untuk sesi demonstrasi, Anda dapat langsung mengklik tombol role cepat (👤 Karyawan, ⚙️ Admin, 👑 Owner) pada halaman login.
                    </div>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">02</div>
                  <div className="instruction-body">
                    <h4>Pendaftaran Akun Baru (Register)</h4>
                    <p>
                      Jika Anda adalah karyawan baru atau belum memiliki kredensial, pilih tab <strong>"Daftar Akun Baru"</strong> pada halaman masuk. 
                      Isikan Nama Lengkap, Email Kantor resmi, Departemen tempat Anda bertugas, serta kata sandi minimal 6 karakter.
                    </p>
                    <div className="instruction-tips">
                      🛡️ Akun yang didaftarkan akan langsung tersinkronisasi dan dapat digunakan untuk login kembali kapan saja.
                    </div>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">03</div>
                  <div className="instruction-body">
                    <h4>Pengaturan Profil & Keamanan Sandi</h4>
                    <p>
                      Setelah berhasil masuk, Anda dapat memperbarui informasi pribadi dan mengubah kata sandi berkala 
                      melalui menu <strong>Profil & Akun</strong> di sidebar sebelah kiri bawah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PANDUAN KARYAWAN */}
          {(activeTab === 'all' || activeTab === 'karyawan') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">👤</span>
                <div>
                  <h3>2. Panduan Karyawan (Pelapor Kendala)</h3>
                  <p>Tata cara pengajuan tiket, memantau pengerjaan, dan verifikasi penyelesaian</p>
                </div>
              </div>

              <div className="guide-instruction-list">
                <div className="instruction-item">
                  <div className="instruction-num">A</div>
                  <div className="instruction-body">
                    <h4>Membuat Tiket Pengaduan Baru</h4>
                    <p>
                      Buka menu <strong>"Ajukan Tiket"</strong>. Masukkan judul kendala yang ringkas namun informatif (contoh: <em>"Layar monitor bergaris dan berkedip di meja Keuangan-02"</em> alih-alih hanya <em>"Komputer rusak"</em>).
                    </p>
                    <div className="instruction-tips">
                      📌 Sertakan lokasi spesifik, pesan error yang muncul, serta riwayat percobaan penanganan pertama pada kolom deskripsi.
                    </div>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">B</div>
                  <div className="instruction-body">
                    <h4>Memilih Kategori & Tingkat Urgensi</h4>
                    <p>
                      Pilih kategori yang sesuai (Hardware, Software, Internet, Fasilitas, dll.). Tentukan prioritas secara objektif sesuai tingkat dampak operasional:
                    </p>
                    <div className="instruction-tips">
                      • <strong>Kritis</strong>: Menghentikan operasional satu divisi/seluruh kantor.<br/>
                      • <strong>Tinggi</strong>: Mengganggu pekerjaan penting dengan tenggat waktu hari ini.<br/>
                      • <strong>Sedang/Rendah</strong>: Kendala parsial yang memiliki alternatif penanganan sementara.
                    </div>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">C</div>
                  <div className="instruction-body">
                    <h4>Diskusi & Riwayat Komentar</h4>
                    <p>
                      Pada halaman <strong>Detail Pengaduan</strong>, Anda dapat berkomunikasi langsung dengan teknisi yang menangani 
                      melalui kolom diskusi komentar, menanyakan perkiraan waktu selesai, atau memberikan informasi tambahan.
                    </p>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">D</div>
                  <div className="instruction-body">
                    <h4>Penyelesaian Tiket & Pemberian Rating</h4>
                    <p>
                      Ketika teknisi menyelesaikan kendala (Status: Selesai), pelapor diminta memeriksa hasil perbaikan. 
                      Klik tombol <strong>"Tutup Pengaduan"</strong> dan berikan rating kepuasan bintang 1 hingga 5 sebagai bahan evaluasi SLA teknisi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: STATUS SIKLUS TIKET */}
          {(activeTab === 'all' || activeTab === 'karyawan' || activeTab === 'admin') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">🔄</span>
                <div>
                  <h3>3. Definisi & Siklus Status Pengaduan</h3>
                  <p>Arti setiap warna label dan aksi yang dibutuhkan pada setiap fase</p>
                </div>
              </div>

              <div className="guide-status-grid">
                <div className="status-desc-card">
                  <div className="status-desc-card-top">
                    <span className="badge b-blue">Baru</span>
                    <small>Fase Awal</small>
                  </div>
                  <p>Tiket baru saja dikirim oleh karyawan dan berada di antrean utama. Menunggu admin atau teknisi mengambil tiket.</p>
                </div>

                <div className="status-desc-card">
                  <div className="status-desc-card-top">
                    <span className="badge b-orange">Sedang Diproses</span>
                    <small>Fase Tindak Lanjut</small>
                  </div>
                  <p>Teknisi telah ditugaskan dan sedang melakukan investigasi teknis, perbaikan perangkat, atau konfigurasi ulang sistem.</p>
                </div>

                <div className="status-desc-card">
                  <div className="status-desc-card-top">
                    <span className="badge b-purple">Menunggu Owner</span>
                    <small>Fase Eskalasi</small>
                  </div>
                  <p>Perbaikan memerlukan persetujuan pembelian suku cadang baru atau otorisasi kebijakan anggaran dari Pimpinan/Owner.</p>
                </div>

                <div className="status-desc-card">
                  <div className="status-desc-card-top">
                    <span className="badge b-green">Selesai</span>
                    <small>Fase Konfirmasi</small>
                  </div>
                  <p>Pekerjaan perbaikan fisik atau software telah rampung oleh teknisi. Menunggu verifikasi akhir dari pemohon.</p>
                </div>

                <div className="status-desc-card" style={{ gridColumn: 'span 2' }}>
                  <div className="status-desc-card-top">
                    <span className="badge b-gray">Ditutup</span>
                    <small>Fase Final & Arsip</small>
                  </div>
                  <p>Tiket telah diverifikasi tuntas oleh karyawan, rating kepuasan telah diberikan, dan kasus disimpan ke log riwayat.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PANDUAN ADMIN */}
          {(activeTab === 'all' || activeTab === 'admin') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">⚙️</span>
                <div>
                  <h3>4. Panduan Khusus Admin & Tim Teknisi IT</h3>
                  <p>Manajemen antrean pengaduan, penugasan teknisi, eskalasi, dan data master</p>
                </div>
              </div>

              <div className="guide-instruction-list">
                <div className="instruction-item">
                  <div className="instruction-num">01</div>
                  <div className="instruction-body">
                    <h4>Menerima & Memvalidasi Tiket Masuk</h4>
                    <p>
                      Buka menu <strong>"Kelola Pengaduan"</strong>. Filter tiket berdasarkan status "Baru". 
                      Periksa apakah deskripsi kendala valid dan kategori yang dipilih sudah sesuai.
                    </p>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">02</div>
                  <div className="instruction-body">
                    <h4>Menugaskan Teknisi (Assignee)</h4>
                    <p>
                      Pada detail tiket, klik dropdown <strong>"Tugaskan Teknisi"</strong> dan pilih teknisi yang kompeten 
                      (misal teknisi jaringan untuk kendala VPN, atau teknisi hardware untuk PC rusak).
                    </p>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">03</div>
                  <div className="instruction-body">
                    <h4>Eskalasi ke Owner (Forward)</h4>
                    <p>
                      Jika kendala memerlukan biaya penggantian sparepart di atas batas wewenang teknisi, klik tombol <strong>"Teruskan ke Owner"</strong>. 
                      Status tiket akan berubah otomatis menjadi <em>"Menunggu Owner"</em> hingga pimpinan memberikan persetujuan.
                    </p>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">04</div>
                  <div className="instruction-body">
                    <h4>Manajemen Master Data & Akun</h4>
                    <p>
                      Admin berhak mengelola data kategori kendala pada menu <strong>Data Master</strong>, 
                      serta mengaktifkan, menonaktifkan, atau menambah akun karyawan pada menu <strong>Manajemen Akun</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PANDUAN OWNER */}
          {(activeTab === 'all' || activeTab === 'owner') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">👑</span>
                <div>
                  <h3>5. Panduan Khusus Owner / Pimpinan Manajemen</h3>
                  <p>Monitoring metrik kepuasan, persetujuan eskalasi, dan analisis laporan statistik</p>
                </div>
              </div>

              <div className="guide-instruction-list">
                <div className="instruction-item">
                  <div className="instruction-num">01</div>
                  <div className="instruction-body">
                    <h4>Monitoring Dashboard Eksekutif</h4>
                    <p>
                      Pantau indikator kinerja utama (KPI) secara real-time di <strong>Dashboard</strong>: 
                      jumlah tiket terbuka, rasio kepuasan karyawan, tren keluhan mingguan, dan beban kerja tim IT.
                    </p>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">02</div>
                  <div className="instruction-body">
                    <h4>Menindaklanjuti Tiket Eskalasi</h4>
                    <p>
                      Periksa tiket yang diforward oleh Admin dengan status <em>"Menunggu Owner"</em>. 
                      Pimpinan dapat memberikan instruksi atau menyetujui disposisi pengadaan fasilitas/perangkat langsung dari halaman pengaduan.
                    </p>
                  </div>
                </div>

                <div className="instruction-item">
                  <div className="instruction-num">03</div>
                  <div className="instruction-body">
                    <h4>Analisis Laporan & Statistik</h4>
                    <p>
                      Buka menu <strong>"Laporan & Statistik"</strong> untuk melihat perbandingan kendala antar departemen, 
                      evaluasi kepatuhan SLA bulanan, serta mengekspor data laporan ke format cetak.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ASISTEN AI */}
          {(activeTab === 'all' || activeTab === 'ai') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">🤖</span>
                <div>
                  <h3>6. Panduan Asisten Virtual AI</h3>
                  <p>Solusi mandiri cepat sebelum membuat tiket pengaduan resmi</p>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
                Sistem Helpdesk dilengkapi dengan Asisten AI internal untuk membantu karyawan menyelesaikan masalah-masalah teknis umum secara instan tanpa perlu menunggu antrean teknisi IT.
              </p>

              <div className="guide-instruction-list">
                <div className="instruction-item">
                  <div className="instruction-num">💡</div>
                  <div className="instruction-body">
                    <h4>Contoh Pertanyaan yang Dapat Dijawab AI:</h4>
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="instruction-tips">"Bagaimana cara menghubungkan ulang printer jaringan yang statusnya offline?"</div>
                      <div className="instruction-tips">"Internet Wi-Fi di laptop tiba-tiba limited access atau tidak ada koneksi?"</div>
                      <div className="instruction-tips">"Cara membersihkan cache browser saat web absensi loading terus?"</div>
                      <div className="instruction-tips">"Langkah aman jika menerima email mencurigakan (indikasi phishing)?"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SLA & PRIORITAS */}
          {(activeTab === 'all' || activeTab === 'sla') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">⏱️</span>
                <div>
                  <h3>7. Standar Waktu Layanan (Service Level Agreement - SLA)</h3>
                  <p>Target waktu respon pertama dan penyelesaian kendala berdasarkan tingkat urgensi</p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th>Tingkat Prioritas</th>
                      <th>Target Respon</th>
                      <th>Target Solusi</th>
                      <th>Kriteria Dampak</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge b-red">Kritis</span></td>
                      <td><strong>&lt; 15 Menit</strong></td>
                      <td>1 - 2 Jam</td>
                      <td>Server down, jaringan pusat mati, insiden keamanan data.</td>
                    </tr>
                    <tr>
                      <td><span className="badge b-orange">Tinggi</span></td>
                      <td><strong>&lt; 30 Menit</strong></td>
                      <td>4 Jam</td>
                      <td>Komputer departemen utama rusak, aplikasi payroll error saat closing.</td>
                    </tr>
                    <tr>
                      <td><span className="badge b-yellow">Sedang</span></td>
                      <td><strong>&lt; 1 Jam</strong></td>
                      <td>12 Jam</td>
                      <td>Printer sharing lambat, instalasi software kerja tambahan, kendala scanner.</td>
                    </tr>
                    <tr>
                      <td><span className="badge b-green">Rendah</span></td>
                      <td><strong>&lt; 2 Jam</strong></td>
                      <td>24 Jam</td>
                      <td>Permintaan penggantian mouse/keyboard cadangan, perapian kabel meja.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: FAQ INTERAKTIF */}
          {(activeTab === 'all' || activeTab === 'faq') && (
            <div className="guide-card">
              <div className="guide-card-header">
                <span className="guide-card-icon">❓</span>
                <div>
                  <h3>8. Tanya Jawab Populer (FAQ)</h3>
                  <p>Klik pertanyaan di bawah untuk membaca jawaban dan solusinya</p>
                </div>
              </div>

              <div className="faq-accordion">
                {filteredFaq.length > 0 ? (
                  filteredFaq.map(item => {
                    const isOpen = openFaq.includes(item.id);
                    return (
                      <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <div className="faq-header" onClick={() => toggleFaq(item.id)}>
                          <span>{item.q}</span>
                          <span className="faq-toggle-icon">▼</span>
                        </div>
                        {isOpen && (
                          <div className="faq-content">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-3)' }}>
                    Tidak ditemukan topik panduan yang sesuai dengan kata kunci "<strong>{searchQuery}</strong>".
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── SIDE COLUMN (WIDGETS) ── */}
        <div className="guide-side-col">
          {/* Quick Contact Card */}
          <div className="guide-widget">
            <div className="guide-widget-title">
              <span>📞</span> Kontak IT Support
            </div>
            <div className="widget-contact-list">
              <div className="widget-contact-item">
                <span className="widget-contact-icon">📱</span>
                <div>
                  <strong>Hotline IT Helpdesk</strong>
                  <span>081318656214 (08:00 - 17:00)</span>
                </div>
              </div>

              <div className="widget-contact-item">
                <span className="widget-contact-icon">✉️</span>
                <div>
                  <strong>Email Resmi IT</strong>
                  <span style={{ wordBreak: 'break-all' }}>antasenaouttdoorofficial98@gmail.com</span>
                </div>
              </div>

              <div className="widget-contact-item">
                <span className="widget-contact-icon">🏢</span>
                <div>
                  <strong>Ruang Teknisi</strong>
                  <span>Gedung Utama, Lantai 2 (Jalan Industri)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="guide-widget">
            <div className="guide-widget-title">
              <span>⚡</span> Akses Cepat Menu
            </div>
            <div className="widget-quick-links">
              {user?.role === 'karyawan' && (
                <button
                  type="button"
                  className="widget-link-btn"
                  onClick={() => navigate('/complaints/new')}
                >
                  <span>✍️ Ajukan Tiket Baru</span>
                  <span>→</span>
                </button>
              )}

              <button
                type="button"
                className="widget-link-btn"
                onClick={() => navigate('/complaints')}
              >
                <span>📋 {user?.role === 'karyawan' ? 'Tiket Saya' : 'Daftar Pengaduan'}</span>
                <span>→</span>
              </button>

              <button
                type="button"
                className="widget-link-btn"
                onClick={() => navigate('/assistant')}
              >
                <span>🤖 Tanya Asisten Virtual AI</span>
                <span>→</span>
              </button>

              <button
                type="button"
                className="widget-link-btn"
                onClick={() => navigate('/dashboard')}
              >
                <span>📊 Kembali ke Dashboard</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* SOP Compliance Badge */}
          <div className="guide-widget" style={{ background: 'var(--bg-card-sub)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>🛡️</span>
              <strong style={{ fontSize: 13, color: 'var(--text)' }}>SOP ISO-20000</strong>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.5 }}>
              Seluruh proses penanganan tiket mematuhi standar tata kelola layanan IT Enterprise, 
              dengan jaminan privasi data dan audit jejak digital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}