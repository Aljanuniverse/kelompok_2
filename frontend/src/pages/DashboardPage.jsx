import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const SB = {
  'Baru': 'b-blue',
  'Sedang Diproses': 'b-orange',
  'Menunggu Owner': 'b-purple',
  'Selesai': 'b-green',
  'Ditutup': 'b-gray'
};

const sparklineData = [
  { val: 12 }, { val: 14 }, { val: 13 }, { val: 18 }, { val: 15 },
  { val: 19 }, { val: 17 }, { val: 22 }, { val: 20 }, { val: 24 },
  { val: 23 }, { val: 28 }, { val: 25 }, { val: 30 }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { complaints, categories, priorities, users } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategoryCard, setSelectedCategoryCard] = useState(1);

  // Filter based on role
  const mine = user?.role === 'karyawan'
    ? complaints.filter(c => c.submittedBy === user.id)
    : user?.role === 'owner'
    ? complaints.filter(c => c.forwardedTo === user.id)
    : complaints;

  const stats = {
    total: mine.length,
    baru: mine.filter(c => c.status === 'Baru').length,
    proses: mine.filter(c => c.status === 'Sedang Diproses').length,
    selesai: mine.filter(c => c.status === 'Selesai').length,
    menunggu: mine.filter(c => c.status === 'Menunggu Owner').length,
  };

  // Filter list by pill tabs
  let listItems = [...mine].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (activeTab === 'baru') listItems = listItems.filter(c => c.status === 'Baru');
  else if (activeTab === 'proses') listItems = listItems.filter(c => c.status === 'Sedang Diproses');
  else if (activeTab === 'selesai') listItems = listItems.filter(c => c.status === 'Selesai');

  const getCat = (id) => categories.find(c => c.id === id);
  const getPri = (id) => priorities.find(p => p.id === id);
  const getUser = (id) => users.find(u => u.id === id);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return `Today, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const priorityData = [
    { name: 'Kritis', count: mine.filter(c => c.priorityId === 4).length, value: mine.filter(c => c.priorityId === 4).length || 1, color: '#dc2626' },
    { name: 'Tinggi', count: mine.filter(c => c.priorityId === 3).length, value: mine.filter(c => c.priorityId === 3).length || 2, color: '#ea580c' },
    { name: 'Sedang', count: mine.filter(c => c.priorityId === 2).length, value: mine.filter(c => c.priorityId === 2).length || 2, color: '#ca8a04' },
    { name: 'Rendah', count: mine.filter(c => c.priorityId === 1).length, value: mine.filter(c => c.priorityId === 1).length || 1, color: '#16a34a' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1280, margin: '0 auto' }}>

      {/* ── TOP SECTION: 2 EQUAL CARDS (Matches Reference) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) minmax(420px, 1.35fr)', gap: 20 }}>

        {/* ── CARD 1: OVERVIEW & ACTION (Matches "Available balance") ── */}
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>
                {user?.role === 'karyawan' ? 'Pengaduan Saya' : 'Total Pengaduan Aktif'}
              </span>
            </div>

            {/* Big Bold Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', color: 'var(--text)' }}>
                {stats.total} Tiket
              </span>
              <span style={{
                background: '#e9f8ee',
                color: '#15803d',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3
              }}>
                +8.6% dlm 30 hari
              </span>
            </div>

            {/* Sparkline Trend Chart (Clean Minimalist Line) */}
            <div style={{ width: '100%', height: 68, marginTop: 14, marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--text)" stopOpacity={0.16}/>
                      <stop offset="100%" stopColor="var(--text)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={() => null} />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="var(--text)"
                    strokeWidth={2}
                    fill="url(#curveGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Two Side-by-Side Sub-Cards (Matches "Money in" / "Money out") */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              {/* Selesai */}
              <div className="sub-card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#dcfce7', color: '#16a34a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, flexShrink: 0
                }}>
                  ↗
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>Tiket Selesai</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
                    {stats.selesai} Tiket
                  </div>
                </div>
              </div>

              {/* Perlu Tindakan */}
              <div className="sub-card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#fee2e2', color: '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, flexShrink: 0
                }}>
                  ↘
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>Perlu Tindakan</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
                    {stats.baru + stats.proses + stats.menunggu} Tiket
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Dark Pill Button (Matches "+ New transfer") */}
          <button
            className="btn btn-dark"
            onClick={() => navigate(user?.role === 'karyawan' ? '/complaints/new' : '/complaints')}
            style={{ width: '100%', padding: '13px', borderRadius: 9999, fontSize: 13, fontWeight: 700 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {user?.role === 'karyawan' ? 'Ajukan Pengaduan' : 'Kelola Pengaduan'}
          </button>
        </div>

        {/* ── CARD 2: CARDS IN WALLET STYLE (Ticket / Category Showcase) ── */}
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Header + Action */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Pengaduan Prioritas & SLA</h3>
                <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                  2 pengaduan kritis · respon maksimal 1x24 jam kerja
                </p>
              </div>
              <button
                className="btn btn-pill-green btn-sm"
                onClick={() => navigate('/complaints')}
                style={{ borderRadius: 9999, padding: '6px 14px', fontSize: 11.5 }}
              >
                + Lihat Semua
              </button>
            </div>

            {/* Donut Chart (Grafik Bulat Prioritas & SLA) */}
            <div style={{
              background: 'var(--bg-card-sub)',
              borderRadius: 18,
              border: '1px solid var(--border-2)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 155,
              marginBottom: 16,
              position: 'relative',
              gap: 20
            }}>
              {/* Circular Donut with Center Count */}
              <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={44}
                      outerRadius={64}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, props) => [`${props.payload.count} Tiket`, name]}
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 11, padding: '5px 9px' }}
                      itemStyle={{ color: 'var(--text)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Label inside Donut */}
                <div style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                    {mine.length}
                  </span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>
                    Tiket
                  </span>
                </div>
              </div>

              {/* Legend & Details beside Donut */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
                {priorityData.map(item => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: 11.5 }}>
                      {item.count} tiket
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Selectable Mini Cards (Matches reference 3 mini cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { id: 1, name: 'Infrastruktur', code: 'IT-01', count: '4 Tiket', color: '#2563eb', bg: '#fbfaf8' },
              { id: 2, name: 'Software Bug', code: 'SW-02', count: '8 Tiket', color: '#16a34a', bg: '#fbfaf8' },
              { id: 3, name: 'Hardware', code: 'HW-03', count: '5 Tiket', color: '#ea580c', bg: '#fbfaf8' },
            ].map(card => {
              const isSelected = selectedCategoryCard === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCategoryCard(card.id)}
                  style={{
                    background: isSelected ? 'var(--bg-card)' : 'var(--bg-card-sub)',
                    border: `1.5px solid ${isSelected ? 'var(--dark-btn)' : 'var(--border-2)'}`,
                    borderRadius: 12,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', fontFamily: 'monospace' }}>
                      {card.code}
                    </span>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: card.color }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>
                    {card.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>
                    {card.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── BOTTOM SECTION: FULL-WIDTH CARD (Matches "All transfers") ── */}
      <div className="card card-pad">
        {/* Header with Title and Pill Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Semua Pengaduan</h3>
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
              Daftar tiket kendala dan riwayat status penanganan tim helpdesk
            </p>
          </div>

          {/* Pill Tabs: [ All 32 | In | Out ] style */}
          <div className="pill-tabs">
            <button
              className={`pill-tab${activeTab === 'all' ? ' active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Semua {mine.length}
            </button>
            <button
              className={`pill-tab${activeTab === 'baru' ? ' active' : ''}`}
              onClick={() => setActiveTab('baru')}
            >
              Baru {stats.baru}
            </button>
            <button
              className={`pill-tab${activeTab === 'proses' ? ' active' : ''}`}
              onClick={() => setActiveTab('proses')}
            >
              Diproses {stats.proses}
            </button>
            <button
              className={`pill-tab${activeTab === 'selesai' ? ' active' : ''}`}
              onClick={() => setActiveTab('selesai')}
            >
              Selesai {stats.selesai}
            </button>
          </div>
        </div>

        {/* Complaints List (Exact Transfer Row Style) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {listItems.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              Tidak ada pengaduan dalam kategori ini
            </div>
          ) : (
            listItems.map((c, idx) => {
              const cat = getCat(c.categoryId);
              const pri = getPri(c.priorityId);
              const subUser = getUser(c.submittedBy);

              // Circular icon styling matching reference
              const isResolved = c.status === 'Selesai';
              const isNew = c.status === 'Baru';

              return (
                <div
                  key={c.id}
                  className="transfer-row"
                  onClick={() => navigate(`/complaints/${c.id}`)}
                >
                  {/* Circular Avatar / Symbol */}
                  <div
                    className="transfer-avatar"
                    style={{
                      background: isResolved ? '#dcfce7' : isNew ? '#fee2e2' : '#ffedd5',
                      color: isResolved ? '#16a34a' : isNew ? '#dc2626' : '#ea580c'
                    }}
                  >
                    {isResolved ? '✓' : isNew ? '!' : '⚙'}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="transfer-info">
                    <div className="transfer-title">{c.title}</div>
                    <div className="transfer-sub">
                      {subUser?.name} · {cat?.name} · <span style={{ fontFamily: 'monospace' }}>#{c.id}</span>
                    </div>
                  </div>

                  {/* Timestamp & Status Badge Pill */}
                  <div className="transfer-right">
                    <span className="transfer-time">{formatTime(c.createdAt)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`badge ${pri?.badge}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                        {pri?.name}
                      </span>
                      <span className={`badge ${SB[c.status]}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
