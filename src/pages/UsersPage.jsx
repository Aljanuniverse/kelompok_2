import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USERS } from '../context/AuthContext';

export default function UsersPage() {
  const { users, addUser, updateUser, toggleUser, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'karyawan', dept: '' });

  const depts = ['IT', 'Finance', 'HR', 'Marketing', 'Operations', 'Management'];
  const roles = ['karyawan', 'admin', 'owner'];
  const roleLabel = { karyawan: 'Karyawan', admin: 'Administrator', owner: 'Owner / Atasan' };
  const roleBadge = { karyawan: 'b-gray', admin: 'b-blue', owner: 'b-purple' };

  let visible = users;
  if (search) visible = visible.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  if (filterRole) visible = visible.filter(u => u.role === filterRole);

  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'karyawan', dept: '' }); setShowModal(true); };
  const openEdit = (u) => { setEditing(u); setForm({ name: u.name, email: u.email, password: u.password, role: u.role, dept: u.dept }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { showToast('Nama dan email harus diisi.', 'error'); return; }
    if (editing) { updateUser(editing.id, form); }
    else { addUser(form); }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Manajemen Akun Pengguna</div>
          <div className="page-subtitle">{users.length} pengguna terdaftar · {users.filter(u=>u.active).length} aktif</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Pengguna
        </button>
      </div>

      {/* Filter */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="form-input" style={{ paddingLeft: 34 }} placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ width: 160 }}>
            <option value="">Semua Peran</option>
            {roles.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '8px 16px', overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Nama</th><th>Email</th><th>Departemen</th><th>Peran</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {visible.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{u.avatar}</div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{u.email}</td>
                  <td style={{ color: 'var(--text-2)' }}>{u.dept}</td>
                  <td><span className={`badge ${roleBadge[u.role]}`}>{roleLabel[u.role]}</span></td>
                  <td>
                    <span className={`badge ${u.active ? 'b-green' : 'b-red'}`}>{u.active ? 'Aktif' : 'Nonaktif'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>Edit</button>
                      <button className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`} onClick={() => { toggleUser(u.id); showToast(u.active ? 'Pengguna dinonaktifkan.' : 'Pengguna diaktifkan.'); }}>
                        {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Nama lengkap" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="email@perusahaan.co.id" />
              </div>
              <div className="form-group">
                <label className="form-label">Kata Sandi</label>
                <input className="form-input" type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="••••••••" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Departemen</label>
                  <select className="form-select" value={form.dept} onChange={e => setForm(p => ({...p, dept: e.target.value}))}>
                    <option value="">Pilih Departemen</option>
                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Peran</label>
                  <select className="form-select" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}>
                    {roles.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
