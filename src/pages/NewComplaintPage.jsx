import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function NewComplaintPage() {
  const { user } = useAuth();
  const { addComplaint, categories, priorities } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', categoryId: '', priorityId: '', description: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Judul pengaduan harus diisi.';
    if (!form.categoryId) e.categoryId = 'Pilih kategori pengaduan.';
    if (!form.priorityId) e.priorityId = 'Pilih prioritas pengaduan.';
    if (!form.description.trim() || form.description.length < 20) e.description = 'Deskripsi minimal 20 karakter.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    const id = addComplaint({ ...form, categoryId: Number(form.categoryId), priorityId: Number(form.priorityId) }, user.id);
    navigate(`/complaints/${id}`);
  };

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: '' })); };

  const priorityColors = { 1: '#16a34a', 2: '#ca8a04', 3: '#ea580c', 4: '#dc2626' };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Ajukan Pengaduan Baru</div>
          <div className="page-subtitle">Isi formulir berikut dengan lengkap dan jelas</div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/complaints')}>← Kembali</button>
      </div>

      <div className="card card-pad">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Judul Pengaduan <span style={{ color: 'var(--red)' }}>*</span></label>
            <input className="form-input" placeholder="Contoh: Komputer tidak dapat menyala..." value={form.title} onChange={e => set('title', e.target.value)} maxLength={120} />
            {errors.title && <span style={{ color: 'var(--red)', fontSize: 12 }}>{errors.title}</span>}
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{form.title.length}/120 karakter</span>
          </div>

          {/* Category & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Kategori <span style={{ color: 'var(--red)' }}>*</span></label>
              <select className="form-select" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <span style={{ color: 'var(--red)', fontSize: 12 }}>{errors.categoryId}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Prioritas <span style={{ color: 'var(--red)' }}>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                {priorities.map(p => (
                  <button type="button" key={p.id} onClick={() => set('priorityId', String(p.id))}
                    style={{
                      padding: '8px', borderRadius: 'var(--r-sm)', border: `1.5px solid ${form.priorityId === String(p.id) ? priorityColors[p.id] : 'var(--border)'}`,
                      background: form.priorityId === String(p.id) ? priorityColors[p.id] + '18' : 'var(--gray-50)',
                      color: form.priorityId === String(p.id) ? priorityColors[p.id] : 'var(--gray-600)',
                      fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    {p.name}
                  </button>
                ))}
              </div>
              {errors.priorityId && <span style={{ color: 'var(--red)', fontSize: 12 }}>{errors.priorityId}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Deskripsi Pengaduan <span style={{ color: 'var(--red)' }}>*</span></label>
            <textarea className="form-textarea" rows={6} placeholder="Jelaskan masalah Anda secara detail. Sertakan informasi seperti kapan terjadi, dampaknya, dan langkah apa yang sudah Anda coba..." value={form.description} onChange={e => set('description', e.target.value)} style={{ minHeight: 130 }} />
            {errors.description && <span style={{ color: 'var(--red)', fontSize: 12 }}>{errors.description}</span>}
            <span style={{ fontSize: 11, color: form.description.length < 20 ? 'var(--orange)' : 'var(--text-3)' }}>{form.description.length} karakter (minimal 20)</span>
          </div>

          {/* Info box */}
          <div style={{ background: 'var(--primary-light)', border: '1px solid #bfdbfe', borderRadius: 'var(--r-sm)', padding: '12px 14px', fontSize: 12, color: 'var(--primary)', display: 'flex', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Pengaduan Anda akan ditangani oleh Admin dan akan mendapat respons sesuai tingkat prioritas. Pengaduan dengan prioritas Kritis akan ditangani dalam waktu 1x24 jam.</span>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/complaints')}>Batal</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Mengirim...' : '✓ Kirim Pengaduan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
