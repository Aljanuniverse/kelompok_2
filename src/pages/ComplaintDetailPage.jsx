import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const statusBadge = { 'Baru': 'b-blue', 'Sedang Diproses': 'b-orange', 'Menunggu Owner': 'b-purple', 'Selesai': 'b-green', 'Ditutup': 'b-gray' };

function Star({ filled, onClick }) {
  return (
    <svg onClick={onClick} width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', transition: 'all 0.15s' }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { complaints, users, categories, priorities, updateComplaintStatus, forwardComplaint, assignComplaint, closeComplaint, reopenComplaint, addComment, rateComplaint, showToast } = useApp();
  const navigate = useNavigate();

  const complaint = complaints.find(c => c.id === id);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(complaint?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showForward, setShowForward] = useState(false);
  const [forwardTarget, setForwardTarget] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [assignTarget, setAssignTarget] = useState('');

  if (!complaint) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <h2>Pengaduan tidak ditemukan</h2>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/complaints')}>Kembali</button>
    </div>
  );

  const cat = categories.find(c => c.id === complaint.categoryId);
  const pri = priorities.find(p => p.id === complaint.priorityId);
  const submitter = users.find(u => u.id === complaint.submittedBy);
  const assigned = users.find(u => u.id === complaint.assignedTo);
  const forwardedTo = users.find(u => u.id === complaint.forwardedTo);
  const owners = users.filter(u => u.role === 'owner');
  const admins = users.filter(u => u.role === 'admin');
  const getUserName = uid => users.find(u => u.id === uid)?.name || '—';
  const fmt = d => new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtShort = d => new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const handleComment = () => {
    if (!comment.trim()) return;
    addComment(id, comment.trim(), user.id);
    setComment('');
    showToast('Komentar ditambahkan!');
  };

  const handleForward = () => {
    if (!forwardTarget) return;
    forwardComplaint(id, Number(forwardTarget), user.id);
    setShowForward(false);
  };

  const handleAssign = () => {
    if (!assignTarget) return;
    assignComplaint(id, Number(assignTarget), user.id);
    setShowAssign(false);
  };

  const handleRate = (r) => {
    setRating(r);
    rateComplaint(id, r, user.id);
  };

  const canClose = user.role === 'karyawan' && complaint.submittedBy === user.id && complaint.status === 'Selesai';
  const canReopen = user.role === 'karyawan' && complaint.submittedBy === user.id && complaint.status === 'Ditutup';
  const canForward = user.role === 'admin' && ['Baru', 'Sedang Diproses'].includes(complaint.status) && !complaint.forwardedTo;
  const canAssign = user.role === 'admin' && complaint.status === 'Baru';
  const canProcess = user.role === 'admin' && complaint.status === 'Baru';
  const canComplete = user.role === 'admin' && complaint.status === 'Sedang Diproses';
  const canOwnerResolve = user.role === 'owner' && complaint.forwardedTo === user.id && complaint.status === 'Menunggu Owner';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/complaints')} style={{ marginBottom: 8 }}>← Kembali</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{complaint.id}</span>
            <span className={`badge ${statusBadge[complaint.status]}`}>{complaint.status}</span>
            <span className={`badge ${pri?.badge}`}>{pri?.name}</span>
            {complaint.reopened && <span className="badge b-orange">↩ Dibuka Kembali</span>}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{complaint.title}</h1>
        </div>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {canProcess && <button className="btn btn-secondary btn-sm" onClick={() => { updateComplaintStatus(id, 'Sedang Diproses', user.id); showToast('Status diperbarui!'); }}>▶ Proses</button>}
          {canAssign && <button className="btn btn-secondary btn-sm" onClick={() => setShowAssign(true)}>👤 Tugaskan</button>}
          {canForward && <button className="btn btn-secondary btn-sm" onClick={() => setShowForward(true)}>→ Teruskan ke Owner</button>}
          {canComplete && <button className="btn btn-success btn-sm" onClick={() => { updateComplaintStatus(id, 'Selesai', user.id); showToast('Pengaduan selesai!'); }}>✓ Selesai</button>}
          {canOwnerResolve && <button className="btn btn-success btn-sm" onClick={() => { updateComplaintStatus(id, 'Selesai', user.id); showToast('Pengaduan diselesaikan!'); }}>✓ Selesaikan</button>}
          {canClose && <button className="btn btn-dark btn-sm" onClick={() => closeComplaint(id, user.id)}>🔒 Tutup</button>}
          {canReopen && <button className="btn btn-secondary btn-sm" onClick={() => reopenComplaint(id, user.id)}>↩ Buka Kembali</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        {/* Left: Description + Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Description */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Deskripsi Pengaduan</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>{complaint.description}</p>
          </div>

          {/* Rating (for karyawan after selesai) */}
          {user.role === 'karyawan' && complaint.submittedBy === user.id && complaint.status === 'Selesai' && (
            <div className="card card-pad">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Nilai Penanganan</h3>
              <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10 }}>Seberapa puas Anda dengan penanganan pengaduan ini?</p>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} filled={s <= (hoverRating || rating)} onClick={() => handleRate(s)}
                    onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} />
                ))}
                {rating > 0 && <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--text-2)', alignSelf: 'center' }}>{rating}/5 — {['','Buruk','Kurang','Cukup','Baik','Sangat Baik'][rating]}</span>}
              </div>
            </div>
          )}
          {complaint.rating && !(user.role === 'karyawan' && complaint.status === 'Selesai') && (
            <div className="card card-pad" style={{ background: 'var(--yellow-light)' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--yellow)' }}>Rating Pengguna:</span>
                {[1,2,3,4,5].map(s => <Star key={s} filled={s <= complaint.rating} />)}
                <span style={{ fontSize: 12, color: 'var(--yellow)', marginLeft: 4 }}>{complaint.rating}/5</span>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Komentar ({complaint.comments.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {complaint.comments.length === 0 && <p style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: 16 }}>Belum ada komentar</p>}
              {complaint.comments.map(cm => {
                const cu = users.find(u => u.id === cm.userId);
                const isMe = cm.userId === user.id;
                return (
                  <div key={cm.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isMe ? 'var(--primary)' : 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{cu?.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{cu?.name}</span>
                        <span className={`badge ${cu?.role === 'admin' ? 'b-blue' : cu?.role === 'owner' ? 'b-purple' : 'b-gray'}`} style={{ fontSize: 10, padding: '1px 6px' }}>{cu?.role}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>{fmtShort(cm.createdAt)}</span>
                      </div>
                      <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '8px 12px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{cm.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {complaint.status !== 'Ditutup' && (
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <textarea className="form-textarea" placeholder="Tulis komentar..." value={comment} onChange={e => setComment(e.target.value)} style={{ minHeight: 70, flex: 1 }} rows={2} />
                <button className="btn btn-primary" style={{ alignSelf: 'flex-end', flexShrink: 0 }} onClick={handleComment} disabled={!comment.trim()}>Kirim</button>
              </div>
            )}
          </div>

          {/* Log */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Riwayat & Log Perubahan</h3>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
              {[...complaint.logs].reverse().map((log, i) => (
                <div key={log.id} style={{ position: 'relative', marginBottom: 16 }}>
                  <div style={{ position: 'absolute', left: -17, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--blue)' : 'var(--gray-300)', border: '2px solid var(--bg-card)' }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? 'var(--primary)' : 'var(--text)' }}>{log.action}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                    oleh <span style={{ color: 'var(--text-2)' }}>{getUserName(log.by)}</span> · {fmt(log.at)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card card-pad">
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informasi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Status', value: <span className={`badge ${statusBadge[complaint.status]}`}>{complaint.status}</span> },
                { label: 'Prioritas', value: <span className={`badge ${pri?.badge}`}>{pri?.name}</span> },
                { label: 'Kategori', value: <span style={{ fontSize: 12, color: cat?.color, fontWeight: 600 }}>● {cat?.name}</span> },
                { label: 'Pengaju', value: submitter?.name },
                { label: 'Ditugaskan ke', value: assigned?.name || '—' },
                { label: 'Diteruskan ke', value: forwardedTo?.name || '—' },
                { label: 'Dibuat', value: fmt(complaint.createdAt) },
                { label: 'Diperbarui', value: fmt(complaint.updatedAt) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad" style={{ background: 'var(--gray-50)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
              💡 <strong>Informasi:</strong> Pengaduan akan ditangani sesuai prioritas. Kritis (1x24 jam), Tinggi (2x24 jam), Sedang (3 hari kerja), Rendah (5 hari kerja).
            </p>
          </div>
        </div>
      </div>

      {/* Forward Modal */}
      {showForward && (
        <div className="modal-overlay" onClick={() => setShowForward(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Teruskan ke Owner</span>
              <button className="modal-close" onClick={() => setShowForward(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Pilih Owner atau Atasan yang akan menangani pengaduan ini:</p>
              <select className="form-select" value={forwardTarget} onChange={e => setForwardTarget(e.target.value)}>
                <option value="">-- Pilih Owner --</option>
                {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.dept})</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowForward(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleForward} disabled={!forwardTarget}>Teruskan</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div className="modal-overlay" onClick={() => setShowAssign(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Tugaskan ke Admin</span>
              <button className="modal-close" onClick={() => setShowAssign(false)}>✕</button>
            </div>
            <div className="modal-body">
              <select className="form-select" value={assignTarget} onChange={e => setAssignTarget(e.target.value)}>
                <option value="">-- Pilih Admin --</option>
                {admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAssign(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleAssign} disabled={!assignTarget}>Tugaskan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
