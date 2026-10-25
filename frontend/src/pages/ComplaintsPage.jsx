import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const SB = { 'Baru':'b-blue','Sedang Diproses':'b-orange','Menunggu Owner':'b-purple','Selesai':'b-green','Ditutup':'b-gray' };
const SC = { 'Baru':'#2563eb','Sedang Diproses':'#ea580c','Menunggu Owner':'#7c3aed','Selesai':'#16a34a','Ditutup':'#9ca3af' };
const avatarColors = ['#4d7c5f','#6b5ea8','#c0562a','#2980b9','#8e44ad','#16a085','#c0392b','#2471a3'];

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { complaints, categories, priorities, users } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const [search, setSearch] = useState(qParam);

  useEffect(() => {
    if (qParam) setSearch(qParam);
  }, [qParam]);

  const [fStatus, setFStatus] = useState('');
  const [fCat, setFCat] = useState('');
  const [fPri, setFPri] = useState('');

  let items = user.role === 'karyawan' ? complaints.filter(c => c.submittedBy === user.id)
    : user.role === 'owner' ? complaints.filter(c => c.forwardedTo === user.id)
    : complaints;

  if (search)  items = items.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search.toUpperCase()));
  if (fStatus) items = items.filter(c => c.status === fStatus);
  if (fCat)    items = items.filter(c => c.categoryId === Number(fCat));
  if (fPri)    items = items.filter(c => c.priorityId === Number(fPri));
  items = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getCat = id => categories.find(c => c.id === id);
  const getPri = id => priorities.find(p => p.id === id);
  const getUser = id => users.find(u => u.id === id);
  const fmt = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' });
  const allStatuses = ['Baru','Sedang Diproses','Menunggu Owner','Selesai','Ditutup'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div className="page-hd">
        <div className="page-hd-left">
          <h2>{user.role === 'karyawan' ? 'Pengaduan Saya' : user.role === 'owner' ? 'Pengaduan Masuk' : 'Kelola Semua Pengaduan'}</h2>
          <p>Menampilkan {items.length} dari {complaints.length} pengaduan</p>
        </div>
        {user.role === 'karyawan' && (
          <button className="btn btn-dark" onClick={() => navigate('/complaints/new')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajukan Pengaduan
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card card-pad-sm">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="form-input" style={{ paddingLeft: 34, borderRadius: 9999, background: '#f5f4ef' }} placeholder="Cari ID tiket atau kata kunci..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" value={fStatus} onChange={e => setFStatus(e.target.value)} style={{ width: 150, borderRadius: 9999, background: '#f5f4ef' }}>
            <option value="">Semua Status</option>
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-select" value={fCat} onChange={e => setFCat(e.target.value)} style={{ width: 160, borderRadius: 9999, background: '#f5f4ef' }}>
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="form-select" value={fPri} onChange={e => setFPri(e.target.value)} style={{ width: 140, borderRadius: 9999, background: '#f5f4ef' }}>
            <option value="">Semua Prioritas</option>
            {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {(search||fStatus||fCat||fPri) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setFStatus(''); setFCat(''); setFPri(''); }} style={{ borderRadius: 9999 }}>✕ Reset</button>
          )}
        </div>
      </div>

      {/* Status tabs (matches reference pill tabs) */}
      <div className="pill-tabs" style={{ alignSelf: 'flex-start' }}>
        {['Semua',...allStatuses].map(s => {
          const cnt = s === 'Semua' ? complaints.filter(c => user.role === 'karyawan' ? c.submittedBy === user.id : user.role === 'owner' ? c.forwardedTo === user.id : true).length
            : complaints.filter(c => (user.role === 'karyawan' ? c.submittedBy === user.id : user.role === 'owner' ? c.forwardedTo === user.id : true) && c.status === s).length;
          const active = fStatus === (s === 'Semua' ? '' : s);
          return (
            <button
              key={s}
              onClick={() => setFStatus(s === 'Semua' ? '' : s)}
              className={`pill-tab${active ? ' active' : ''}`}
            >
              {s} {cnt}
            </button>
          );
        })}
      </div>

      {/* Main list card — reference-style list items */}
      <div className="card card-pad">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Tidak ada pengaduan ditemukan</div>
              {user.role === 'karyawan' && <button className="btn btn-dark btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/complaints/new')}>Ajukan Pengaduan Pertama</button>}
            </div>
          )}

          {items.map(c => {
            const cat = getCat(c.categoryId);
            const pri = getPri(c.priorityId);
            const sub = getUser(c.submittedBy);
            const isResolved = c.status === 'Selesai';
            const isNew = c.status === 'Baru';

            return (
              <div
                key={c.id}
                className="transfer-row"
                onClick={() => navigate(`/complaints/${c.id}`)}
              >
                {/* Circular Symbol Avatar */}
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
                    {sub?.name} · {cat?.name} · <span style={{ fontFamily: 'monospace' }}>#{c.id}</span>
                    {c.reopened && <span style={{ color: 'var(--orange)', marginLeft: 8, fontWeight: 700 }}>↩ Dibuka Kembali</span>}
                  </div>
                </div>

                {/* Right: Date, Priority, Status */}
                <div className="transfer-right">
                  <span className="transfer-time">{fmt(c.createdAt)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`badge ${pri?.badge || 'b-gray'}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                      {pri?.name}
                    </span>
                    <span className={`badge ${SB[c.status]}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
