import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OnboardingTourModal.css';

export default function OnboardingTourModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain && user?.id) {
      try {
        localStorage.setItem(`helpdesk_tour_dismissed_${user.id}`, 'true');
      } catch {}
    }
    onClose();
  };

  const handleActionClick = (path) => {
    handleClose();
    if (path) {
      navigate(path);
    }
  };

  const steps = [
    {
      badge: 'Langkah 1 dari 5 · Pengenalan',
      icon: '👋',
      title: `Selamat Datang di Portal Helpdesk, ${user?.name || 'Karyawan'}!`,
      description:
        'Sistem ini dirancang khusus untuk mempermudah Anda melaporkan kendala kerja (komputer, jaringan, printer, fasilitas), memantau progres perbaikan secara transparan, dan berkoordinasi dengan tim teknisi.',
      userPill: true,
      highlights: [
        {
          icon: '🛡️',
          title: 'Akuntabel & Terintegrasi',
          desc: `Terhubung dengan Departemen ${user?.dept || 'Anda'} untuk histori pengaduan resmi.`,
        },
        {
          icon: '⏱️',
          title: 'SLA Waktu Respon Cepat',
          desc: 'Setiap pengaduan diproses dengan standar respon mulai 15 menit.',
        },
        {
          icon: '📱',
          title: 'Pantau Real-Time',
          desc: 'Lacak tahapan perbaikan langsung dari layar Dashboard Anda.',
        },
        {
          icon: '🤖',
          title: 'Asisten AI 24/7',
          desc: 'Dukungan tanya jawab teknis otomatis kapan pun dibutuhkan.',
        },
      ],
    },
    {
      badge: 'Langkah 2 dari 5 · Fitur Pengaduan',
      icon: '✍️',
      title: 'Fitur: Ajukan Tiket Pengaduan Kendala',
      description:
        'Mengalami kendala komputer mati, aplikasi error, atau internet lambat? Ajukan tiket pengaduan resmi agar segera ditugaskan ke teknisi.',
      cta: {
        label: 'Coba Buka Form Pengaduan →',
        path: '/complaints/new',
      },
      highlights: [
        {
          icon: '🏷️',
          title: 'Pilih Kategori yang Sesuai',
          desc: 'Hardware, Software, Jaringan & Internet, atau Fasilitas Kantor.',
        },
        {
          icon: '⚡',
          title: 'Tentukan Tingkat Prioritas',
          desc: 'Rendah, Sedang, Tinggi, atau Kritis (untuk insiden mendesak).',
        },
        {
          icon: '📝',
          title: 'Tuliskan Rincian Masalah',
          desc: 'Sertakan nomor meja, pesan error, atau kronologi kendala.',
        },
        {
          icon: '📌',
          title: 'Akses Cepat',
          desc: 'Tersedia di menu "Ajukan Tiket" pada navigasi sebelah kiri.',
        },
      ],
    },
    {
      badge: 'Langkah 3 dari 5 · Pelacakan & Kolaborasi',
      icon: '📋',
      title: 'Fitur: Lacak Tiket & Chat dengan Teknisi',
      description:
        'Ketahui status pengerjaan pengaduan Anda secara real-time tanpa perlu mendatangi atau menelepon ruang IT.',
      cta: {
        label: 'Buka Halaman Pengaduan →',
        path: '/complaints',
      },
      highlights: [
        {
          icon: '🔄',
          title: 'Status Siklus Tiket',
          desc: 'Pantau tahapan: Baru ➔ Sedang Diproses ➔ Selesai ➔ Ditutup.',
        },
        {
          icon: '👨‍💻',
          title: 'Lihat Teknisi PIC',
          desc: 'Ketahui nama teknisi IT yang ditugaskan menangani tiket Anda.',
        },
        {
          icon: '💬',
          title: 'Kolom Diskusi Komentar',
          desc: 'Tanyakan estimasi selesai atau kirim info tambahan lewat chat tiket.',
        },
        {
          icon: '🔔',
          title: 'Notifikasi Tiket',
          desc: 'Indikator titik merah di ikon lonceng akan memberi tahu update baru.',
        },
      ],
    },
    {
      badge: 'Langkah 4 dari 5 · Bantuan Cerdas',
      icon: '🤖',
      title: 'Fitur: Konsultasi Cepat Asisten AI',
      description:
        'Butuh pertolongan pertama sebelum membuat tiket? Tanyakan kepada Asisten Virtual AI kami yang siap melayani 24 jam nonstop.',
      cta: {
        label: 'Coba Tanya Asisten AI →',
        path: '/assistant',
      },
      highlights: [
        {
          icon: '💡',
          title: 'Solusi Mandiri Instan',
          desc: 'Panduan cepat printer offline, Wi-Fi terputus, dan reset sambungan.',
        },
        {
          icon: '⚡',
          title: 'Tanpa Antrean',
          desc: 'Dapatkan instruksi langkah-demi-langkah dalam hitungan detik.',
        },
        {
          icon: '🎯',
          title: 'Rekomendasi Tiket',
          desc: 'AI akan menyarankan kapan saatnya Anda perlu membuat tiket resmi.',
        },
        {
          icon: '🌐',
          title: 'Siap Kapan Saja',
          desc: 'Tetap aktif dan bisa digunakan bahkan saat jam libur kantor.',
        },
      ],
    },
    {
      badge: 'Langkah 5 dari 5 · Selesai & Evaluasi',
      icon: '⭐',
      title: 'Fitur: Rating Kepuasan & Buku Panduan SOP',
      description:
        'Setelah teknisi menyelesaikan kendala, Anda dapat memastikan perbaikan berfungsi dengan baik lalu memberikan evaluasi kualitas layanan.',
      cta: {
        label: 'Buka Buku Panduan Lengkap →',
        path: '/guide',
      },
      highlights: [
        {
          icon: '⭐',
          title: 'Beri Rating Bintang 1-5',
          desc: 'Bantu perusahaan meningkatkan SLA teknisi lewat penilaian Anda.',
        },
        {
          icon: '🔁',
          title: 'Buka Kembali (Reopen)',
          desc: 'Jika kendala yang sama kambuh, tiket dapat dibuka ulang.',
        },
        {
          icon: '📘',
          title: 'Buku Panduan & SOP',
          desc: 'Pelajari aturan SLA dan FAQ lengkap di menu "Panduan".',
        },
        {
          icon: '📞',
          title: 'Kontak Darurat IT',
          desc: 'Hotline: 081318656214 jika membutuhkan bantuan langsung.',
        },
      ],
    },
  ];

  const current = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="tour-backdrop" onClick={handleClose}>
      <div className="tour-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Bar */}
        <div className="tour-top-bar">
          <div className="tour-step-badge">
            <span>🎯</span> {current.badge}
          </div>
          <button
            type="button"
            className="tour-skip-btn"
            onClick={handleClose}
            title="Lewati panduan fitur"
          >
            ✕ Lewati Tur
          </button>
        </div>

        {/* Progress Line */}
        <div className="tour-progress-track">
          <div className="tour-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Content Body */}
        <div className="tour-body">
          <div className="tour-hero-icon-wrap">{current.icon}</div>

          {current.userPill && (
            <div className="tour-user-pill">
              <span className="tour-user-avatar">{user?.avatar || 'US'}</span>
              <span className="tour-user-info">
                Role: <strong>{user?.role?.toUpperCase() || 'KARYAWAN'}</strong> · Dept:{' '}
                <strong>{user?.dept || 'Umum'}</strong>
              </span>
            </div>
          )}

          <h3 className="tour-title">{current.title}</h3>
          <p className="tour-description">{current.description}</p>

          {/* Highlights 2x2 Grid */}
          <div className="tour-highlights-grid">
            {current.highlights.map((h, i) => (
              <div key={i} className="tour-highlight-box">
                <span className="tour-hl-icon">{h.icon}</span>
                <div className="tour-hl-text">
                  <strong>{h.title}</strong>
                  <p>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct CTA button */}
          {current.cta && (
            <button
              type="button"
              className="tour-cta-btn-link"
              onClick={() => handleActionClick(current.cta.path)}
            >
              <span>🚀</span> {current.cta.label}
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="tour-footer">
          {/* Checkbox Don't show again */}
          <label className="tour-dont-show">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Jangan tampilkan panduan ini secara otomatis lagi</span>
          </label>

          {/* Dots Indicator */}
          <div className="tour-dots">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`tour-dot ${i === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(i)}
                title={`Langkah ${i + 1}`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="tour-nav-btns">
            <button
              type="button"
              className="tour-btn-prev"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            >
              ← Kembali
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="tour-btn-next"
                onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                type="button"
                className="tour-btn-next tour-btn-finish"
                onClick={handleClose}
              >
                Mulai Gunakan Dashboard 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
