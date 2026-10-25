import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const statusBadge = { 'Baru': 'b-blue', 'Sedang Diproses': 'b-orange', 'Menunggu Owner': 'b-purple', 'Selesai': 'b-green', 'Ditutup': 'b-gray' };

export default function ReportsPage() {
  const { complaints, categories, priorities, users } = useApp();
  const [period, setPeriod] = useState('all');

  const now = new Date();
  const filtered = complaints.filter(c => {
    if (period === 'all') return true;
    const created = new Date(c.createdAt);
    const diff = (now - created) / (1000 * 60 * 60 * 24);
    if (period === '7') return diff <= 7;
    if (period === '30') return diff <= 30;
    if (period === '90') return diff <= 90;
    return true;
  });

  // By Status
  const byStatus = ['Baru','Sedang Diproses','Menunggu Owner','Selesai','Ditutup'].map(s => ({
    name: s, value: filtered.filter(c => c.status === s).length,
  })).filter(d => d.value > 0);
  const statusColors = { 'Baru': '#2563eb', 'Sedang Diproses': '#ea580c', 'Menunggu Owner': '#7c3aed', 'Selesai': '#16a34a', 'Ditutup': '#6b7280' };

  // By Category
  const byCat = categories.map(cat => ({
    name: cat.name.split('/')[0].trim(),
    total: filtered.filter(c => c.categoryId === cat.id).length,
    color: cat.color,
  })).filter(d => d.total > 0).sort((a, b) => b.total - a.total);

  // By Priority
  const byPri = priorities.map(p => ({
    name: p.name,
    value: filtered.filter(c => c.priorityId === p.id).length,
    color: p.color,
  }));

  // By Month (last 6)
  const monthData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const label = d.toLocaleDateString('id-ID', { month: 'short' });
    return {
      name: label,
      Masuk: complaints.filter(c => { const cd = new Date(c.createdAt); return cd >= d && cd <= end; }).length,
      Selesai: complaints.filter(c => { const cd = new Date(c.createdAt); return cd >= d && cd <= end && c.status === 'Selesai'; }).length,
    };
  });

  // Response time stats
  const resolved = filtered.filter(c => c.status === 'Selesai' || c.status === 'Ditutup');
  const avgDays = resolved.length > 0
    ? (resolved.reduce((acc, c) => acc + (new Date(c.updatedAt) - new Date(c.createdAt)) / (1000*60*60*24), 0) / resolved.length).toFixed(1)
    : 0;
  const satisfiedCount = filtered.filter(c => c.rating >= 4).length;
  const ratedCount = filtered.filter(c => c.rating).length;
  const satisfactionRate = ratedCount > 0 ? Math.round((satisfiedCount / ratedCount) * 100) : 0;

  const fmt = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleExport = () => {
    const rows = [
      ['ID', 'Judul', 'Kategori', 'Prioritas', 'Status', 'Pengaju', 'Dibuat', 'Diperbarui', 'Rating'],
      ...filtered.map(c => [
        c.id, c.title,
        categories.find(cat => cat.id === c.categoryId)?.name || '',
        priorities.find(p => p.id === c.priorityId)?.name || '',
        c.status,
        users.find(u => u.id === c.submittedBy)?.name || '',
        fmt(c.createdAt), fmt(c.updatedAt), c.rating || '',
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'laporan_helpdesk.csv'; a.click();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Laporan & Statistik</div>
          <div className="page-subtitle">Total {filtered.length} pengaduan dalam periode yang dipilih</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)} style={{ width: 160 }}>
            <option value="all">Semua Waktu</option>
            <option value="7">7 Hari Terakhir</option>
            <option value="30">30 Hari Terakhir</option>
            <option value="90">90 Hari Terakhir</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Pengaduan', value: filtered.length, color: '#2563eb', icon: '📋' },
          { label: 'Terselesaikan', value: resolved.length, color: '#16a34a', icon: '✅' },
          { label: 'Rata-rata Waktu', value: `${avgDays} hari`, color: '#ea580c', icon: '⏱️' },
          { label: 'Kepuasan Pengguna', value: `${satisfactionRate}%`, color: '#7c3aed', icon: '⭐' },
        ].map(s => (
          <div key={s.label} className="card card-pad">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Monthly Trend */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Tren Bulanan (6 Bulan)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Bar dataKey="Masuk" fill="#2563eb" radius={[4,4,0,0]}/>
              <Bar dataKey="Selesai" fill="#16a34a" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Status Pie */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Distribusi Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byStatus} cx="45%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value" label={({ name, value }) => `${value}`} labelLine={false}>
                {byStatus.map((e, i) => <Cell key={i} fill={statusColors[e.name]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* By Category */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Pengaduan per Kategori</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {byCat.map(c => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }}/>
                    {c.name}
                  </span>
                  <span style={{ fontWeight: 700, color: c.color }}>{c.total}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 9999 }}>
                  <div style={{ width: `${(c.total / Math.max(...byCat.map(x=>x.total), 1)) * 100}%`, height: '100%', background: c.color, borderRadius: 9999, transition: 'width 0.5s ease' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Pengaduan per Prioritas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {byPri.map(p => (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }}/>
                    {p.name}
                  </span>
                  <span style={{ fontWeight: 700, color: p.color }}>{p.value}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 9999 }}>
                  <div style={{ width: `${(p.value / Math.max(...byPri.map(x=>x.value), 1)) * 100}%`, height: '100%', background: p.color, borderRadius: 9999, transition: 'width 0.5s ease' }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Rating summary */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-2)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Ringkasan Rating</h4>
            {[5,4,3,2,1].map(r => {
              const cnt = filtered.filter(c => c.rating === r).length;
              return (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: '#f59e0b', width: 30 }}>{'★'.repeat(r)}</span>
                  <div style={{ flex: 1, height: 5, background: 'var(--gray-100)', borderRadius: 9999 }}>
                    <div style={{ width: `${ratedCount > 0 ? (cnt / ratedCount) * 100 : 0}%`, height: '100%', background: '#f59e0b', borderRadius: 9999 }}/>
                  </div>
                  <span style={{ color: 'var(--text-3)', width: 20, textAlign: 'right' }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="card">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Daftar Pengaduan Lengkap</h3>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{filtered.length} data</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Judul</th><th>Kategori</th><th>Prioritas</th><th>Status</th><th>Pengaju</th><th>Dibuat</th><th>Rating</th></tr></thead>
            <tbody>
              {filtered.slice(0,20).map(c => (
                <tr key={c.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</span></td>
                  <td style={{ maxWidth: 200 }}><span className="truncate" style={{ display: 'block', fontSize: 12 }}>{c.title}</span></td>
                  <td style={{ fontSize: 11 }}>{categories.find(x => x.id === c.categoryId)?.name?.split('/')[0]}</td>
                  <td><span className={`badge ${priorities.find(p=>p.id===c.priorityId)?.badge}`} style={{ fontSize: 10 }}>{priorities.find(p=>p.id===c.priorityId)?.name}</span></td>
                  <td><span className={`badge ${statusBadge[c.status]}`} style={{ fontSize: 10 }}>{c.status}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{users.find(u=>u.id===c.submittedBy)?.name}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{fmt(c.createdAt)}</td>
                  <td>{c.rating ? <span style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(c.rating)}</span> : <span style={{ color: 'var(--text-3)', fontSize: 11 }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
