import { useState } from 'react';
import { useApp } from '../context/AppContext';

const COLORS = ['#2563eb','#7c3aed','#16a34a','#ea580c','#dc2626','#ca8a04','#0891b2','#ec4899'];

export default function CategoriesPage() {
  const { categories, priorities, addCategory, updateCategory, deleteCategory, addPriority, deletePriority, showToast } = useApp();
  const [showCatModal, setShowCatModal] = useState(false);
  const [showPriModal, setShowPriModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', color: '#2563eb' });
  const [priForm, setPriForm] = useState({ name: '', color: '#ea580c', badge: 'b-orange' });

  const openAddCat = () => { setEditingCat(null); setCatForm({ name: '', color: '#2563eb' }); setShowCatModal(true); };
  const openEditCat = (c) => { setEditingCat(c); setCatForm({ name: c.name, color: c.color }); setShowCatModal(true); };

  const saveCat = () => {
    if (!catForm.name.trim()) { showToast('Nama kategori wajib diisi.', 'error'); return; }
    if (editingCat) updateCategory(editingCat.id, catForm);
    else addCategory(catForm);
    setShowCatModal(false);
  };

  const savePri = () => {
    if (!priForm.name.trim()) { showToast('Nama prioritas wajib diisi.', 'error'); return; }
    addPriority(priForm);
    setShowPriModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Manajemen Data Master</div>
          <div className="page-subtitle">Kelola kategori dan prioritas pengaduan</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Kategori */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Kategori Pengaduan</h2>
            <button className="btn btn-primary btn-sm" onClick={openAddCat}>+ Tambah</button>
          </div>
          <div className="card" style={{ padding: '8px 16px', overflow: 'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>#</th><th>Nama Kategori</th><th>Warna</th><th>Aksi</th></tr></thead>
                <tbody>
                  {categories.map((c, i) => (
                    <tr key={c.id}>
                      <td style={{ color: 'var(--text-3)', width: 40 }}>{i+1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }}/>
                          <span style={{ fontWeight: 500 }}>{c.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, background: c.color }}/>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-3)' }}>{c.color}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEditCat(c)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm('Hapus kategori ini?')) deleteCategory(c.id); }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Prioritas */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Tingkat Prioritas</h2>
            <button className="btn btn-primary btn-sm" onClick={() => { setPriForm({ name: '', color: '#ea580c', badge: 'b-orange' }); setShowPriModal(true); }}>+ Tambah</button>
          </div>
          <div className="card" style={{ padding: '8px 16px', overflow: 'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Urutan</th><th>Nama</th><th>Warna</th><th>Aksi</th></tr></thead>
                <tbody>
                  {priorities.map((p, i) => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-3)', width: 60, textAlign: 'center', fontWeight: 700 }}>{i+1}</td>
                      <td>
                        <span className={`badge ${p.badge}`}>{p.name}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, background: p.color }}/>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-3)' }}>{p.color}</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm('Hapus prioritas ini?')) deletePriority(p.id); }}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SLA Info */}
          <div className="card card-pad" style={{ marginTop: 12, background: 'var(--gray-50)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>SLA Response Time</h3>
            {[
              { label: 'Kritis', sla: '1×24 jam', color: '#dc2626' },
              { label: 'Tinggi', sla: '2×24 jam', color: '#ea580c' },
              { label: 'Sedang', sla: '3 hari kerja', color: '#ca8a04' },
              { label: 'Rendah', sla: '5 hari kerja', color: '#16a34a' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-2)', fontSize: 12 }}>
                <span style={{ color: s.color, fontWeight: 600 }}>● {s.label}</span>
                <span style={{ color: 'var(--text-2)' }}>{s.sla}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCatModal && (
        <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editingCat ? 'Edit Kategori' : 'Tambah Kategori'}</span>
              <button className="modal-close" onClick={() => setShowCatModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Kategori</label>
                <input className="form-input" value={catForm.name} onChange={e => setCatForm(p => ({...p, name: e.target.value}))} placeholder="Contoh: Infrastruktur IT" />
              </div>
              <div className="form-group">
                <label className="form-label">Warna</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => setCatForm(p => ({...p, color: c}))}
                      style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: 'pointer', border: catForm.color === c ? '3px solid var(--text)' : '3px solid transparent', transition: 'transform 0.1s' }} />
                  ))}
                  <input type="color" value={catForm.color} onChange={e => setCatForm(p => ({...p, color: e.target.value}))} style={{ width: 28, height: 28, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCatModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={saveCat}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Priority Modal */}
      {showPriModal && (
        <div className="modal-overlay" onClick={() => setShowPriModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Tambah Prioritas</span>
              <button className="modal-close" onClick={() => setShowPriModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Prioritas</label>
                <input className="form-input" value={priForm.name} onChange={e => setPriForm(p => ({...p, name: e.target.value}))} placeholder="Contoh: Sangat Kritis" />
              </div>
              <div className="form-group">
                <label className="form-label">Warna Badge</label>
                <select className="form-select" value={priForm.badge} onChange={e => setPriForm(p => ({...p, badge: e.target.value}))}>
                  <option value="b-green">Hijau</option>
                  <option value="b-yellow">Kuning</option>
                  <option value="b-orange">Oranye</option>
                  <option value="b-red">Merah</option>
                  <option value="b-blue">Biru</option>
                  <option value="b-purple">Ungu</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPriModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={savePri}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
