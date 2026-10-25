import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const SUGGESTIONS = [
  'Bagaimana cara mengajukan pengaduan?',
  'Apa saja kategori pengaduan yang tersedia?',
  'Berapa lama pengaduan saya diproses?',
  'Bagaimana cara melihat status pengaduan?',
  'Siapa yang menangani pengaduan saya?',
];

const AI_RESPONSES = {
  pengaduan: `Untuk mengajukan pengaduan baru, ikuti langkah berikut:\n1. Klik menu **"Ajukan Pengaduan"** di sidebar kiri\n2. Isi judul pengaduan dengan jelas dan ringkas\n3. Pilih kategori yang sesuai dengan masalah Anda\n4. Tentukan tingkat prioritas (Rendah/Sedang/Tinggi/Kritis)\n5. Jelaskan masalah secara detail pada kolom deskripsi\n6. Klik tombol **"Kirim Pengaduan"**\n\nSetelah terkirim, Anda akan mendapat ID pengaduan unik (contoh: HDK-007) untuk memantau prosesnya.`,
  kategori: `Sistem helpdesk mendukung beberapa kategori pengaduan:\n• 🖥️ **Infrastruktur IT** — Server, data center\n• 💻 **Software / Aplikasi** — Bug, error sistem\n• 🌐 **Jaringan & Internet** — VPN, konektivitas\n• 🖨️ **Hardware / Perangkat** — Komputer, printer\n• 👥 **SDM / Kepegawaian** — Akses, absensi\n• 💰 **Keuangan** — Laporan, sistem keuangan\n• 🏢 **Fasilitas Kantor** — AC, proyektor, dll\n\nJika kategori tidak tersedia, hubungi Admin untuk penambahan kategori.`,
  lama: `Waktu penanganan pengaduan bergantung pada tingkat prioritas:\n• 🔴 **Kritis** — Maks. 1×24 jam\n• 🟠 **Tinggi** — Maks. 2×24 jam\n• 🟡 **Sedang** — Maks. 3 hari kerja\n• 🟢 **Rendah** — Maks. 5 hari kerja\n\nWaktu dihitung sejak pengaduan diterima dan ditugaskan ke tim terkait. Anda akan mendapat notifikasi setiap ada perubahan status.`,
  status: `Untuk memantau status pengaduan:\n1. Klik menu **"Pengaduan Saya"** di sidebar\n2. Lihat kolom status pada tabel pengaduan\n3. Klik ID atau tombol **"Detail"** untuk melihat riwayat lengkap\n\nStatus pengaduan:\n• 🔵 **Baru** — Menunggu penugasan\n• 🟠 **Sedang Diproses** — Sedang ditangani tim\n• 🟣 **Menunggu Owner** — Diteruskan ke atasan\n• 🟢 **Selesai** — Pengaduan telah diselesaikan\n• ⚫ **Ditutup** — Pengaduan ditutup pengguna`,
  siapa: `Alur penanganan pengaduan:\n1. **Karyawan** mengajukan pengaduan\n2. **Admin** menerima, memverifikasi, dan menugaskan\n3. Jika kompleks, Admin **meneruskan ke Owner/Atasan**\n4. **Owner** memberikan keputusan dan menyelesaikan\n5. Karyawan **menutup** pengaduan setelah puas\n\nAnda dapat melihat siapa yang ditugaskan pada halaman detail pengaduan di bagian "Informasi".`,
  default: `Saya adalah **Asisten Virtual Helpdesk** yang siap membantu Anda!\n\nSaya dapat membantu dengan:\n• 📋 Cara mengajukan pengaduan\n• 📊 Memantau status pengaduan\n• ⚡ Informasi prioritas dan SLA\n• 👥 Alur penanganan pengaduan\n• 🏷️ Kategori pengaduan tersedia\n\nSilakan ketik pertanyaan Anda atau pilih salah satu pertanyaan umum di atas!`,
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('ajuk') || m.includes('buat') || m.includes('submit') || m.includes('kirim')) return AI_RESPONSES.pengaduan;
  if (m.includes('kategori') || m.includes('jenis')) return AI_RESPONSES.kategori;
  if (m.includes('lama') || m.includes('berapa') || m.includes('waktu') || m.includes('sla') || m.includes('respon')) return AI_RESPONSES.lama;
  if (m.includes('status') || m.includes('pantau') || m.includes('cek') || m.includes('lihat')) return AI_RESPONSES.status;
  if (m.includes('siapa') || m.includes('tangani') || m.includes('alur') || m.includes('proses')) return AI_RESPONSES.siapa;
  return AI_RESPONSES.default;
}

function MessageBubble({ msg }) {
  const isAI = msg.role === 'ai';
  // Format bold text (**text**) to HTML
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: isAI ? 'flex-start' : 'flex-end', animation: 'slideIn 0.2s ease' }}>
      {isAI && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
      )}
      <div style={{
        maxWidth: '72%', padding: '10px 14px', borderRadius: isAI ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
        background: isAI ? 'var(--bg-card)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
        color: isAI ? 'var(--text)' : '#fff',
        fontSize: 13, lineHeight: 1.7,
        boxShadow: 'var(--shadow-sm)',
        border: isAI ? '1px solid var(--border)' : 'none',
      }}>
        {msg.typing ? (
          <span style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 4px' }}>
            {[0.1, 0.2, 0.3].map((d, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gray-400)', animation: `bounce 1.2s ${d}s infinite` }}/>
            ))}
          </span>
        ) : formatText(msg.content)}
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const { user } = useAuth();
  const { complaints, categories } = useApp();
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: `Halo **${user?.name?.split(' ')[0]}**! 👋\n\nSaya adalah Asisten Virtual Helpdesk berbasis AI. Saya siap membantu Anda dengan pertanyaan seputar sistem pengaduan.\n\nAda yang bisa saya bantu hari ini?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content };
    const typingMsg = { id: Date.now() + 1, role: 'ai', typing: true, content: '' };
    setMessages(prev => [...prev, userMsg, typingMsg]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const response = getAIResponse(content);
    setMessages(prev => prev.map(m => m.typing ? { ...m, typing: false, content: response } : m));
    setLoading(false);
  };

  const myComplaints = complaints.filter(c => c.submittedBy === user?.id);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, height: 'calc(100vh - 120px)', minHeight: 0 }}>
      {/* Chat Area */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Asisten Virtual Helpdesk</div>
            <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', animation: 'pulse 2s infinite' }}/>
              Online · AI Berbasis Aturan
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-2)', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
          {SUGGESTIONS.slice(0,3).map(s => (
            <button key={s} onClick={() => sendMessage(s)} disabled={loading}
              style={{ fontSize: 11, padding: '5px 10px', borderRadius: 9999, border: '1px solid var(--border)', background: 'var(--gray-50)', color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-2)'; }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-2)', display: 'flex', gap: 8, flexShrink: 0 }}>
          <input className="form-input" style={{ flex: 1 }} placeholder="Ketik pertanyaan Anda..." value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} />
          <button className="btn btn-primary" onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ padding: '0 16px', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {/* Quick topics */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pertanyaan Umum</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} disabled={loading}
                style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--gray-50)', fontSize: 12, color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.15s', lineHeight: 1.4 }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; e.target.style.background = 'var(--primary-light)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-2)'; e.target.style.background = 'var(--gray-50)'; }}>
                💬 {s}
              </button>
            ))}
          </div>
        </div>

        {/* My complaint summary */}
        {user?.role === 'karyawan' && (
          <div className="card card-pad">
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pengaduan Saya</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Baru','Sedang Diproses','Selesai','Ditutup'].map(s => {
                const count = myComplaints.filter(c => c.status === s).length;
                const colors = { 'Baru': '#2563eb', 'Sedang Diproses': '#ea580c', 'Selesai': '#16a34a', 'Ditutup': '#6b7280' };
                return (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border-2)' }}>
                    <span style={{ color: 'var(--text-2)' }}>{s}</span>
                    <span style={{ fontWeight: 700, color: colors[s] }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Disclaimer */}
        <div className="card card-pad" style={{ background: 'var(--primary-light)', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: 11, color: 'var(--primary)', lineHeight: 1.6 }}>
            🤖 <strong>Info AI:</strong> Asisten ini menggunakan sistem berbasis aturan untuk memberikan panduan penggunaan helpdesk. Untuk masalah teknis, silakan ajukan pengaduan langsung.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
