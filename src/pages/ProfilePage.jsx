import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useApp();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', dept: user?.dept || '' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { showToast('Nama tidak boleh kosong.', 'error'); return; }
    const initials = profileForm.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    updateProfile({ name: profileForm.name, dept: profileForm.dept, avatar: initials });
    showToast('Profil berhasil diperbarui!');
  };

  const handlePwSave = (e) => {
    e.preventDefault();
    const errors = {};
    if (pwForm.current !== user.password) errors.current = 'Kata sandi saat ini salah.';
    if (pwForm.newPw.length < 6) errors.newPw = 'Kata sandi baru minimal 6 karakter.';
    if (pwForm.newPw !== pwForm.confirm) errors.confirm = 'Konfirmasi kata sandi tidak cocok.';
    if (Object.keys(errors).length) { setPwErrors(errors); return; }
    updateProfile({ password: pwForm.newPw });
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwErrors({});
    showToast('Kata sandi berhasil diubah!');
  };

  const roleLabel = { karyawan: 'Karyawan', admin: 'Administrator', owner: 'Owner / Atasan' };
  const roleBadge = { karyawan: 'b-gray', admin: 'b-blue', owner: 'b-purple' };

  const depts = ['IT', 'Finance', 'HR', 'Marketing', 'Operations', 'Management'];

  const InputWrapper = ({ label, id, type, value, onChange, error, show, onToggle, placeholder }) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input id={id} className="form-input" type={show !== undefined ? (show ? 'text' : 'password') : type || 'text'}
          value={value} onChange={onChange} placeholder={placeholder} style={{ paddingRight: onToggle ? 36 : undefined }} />
        {onToggle && (
          <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
            </svg>
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Profil & Pengaturan Akun</div>
          <div className="page-subtitle">Kelola informasi akun dan keamanan Anda</div>
        </div>
      </div>

      {/* Profile card */}
      <div className="card card-pad" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{user?.avatar}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <span className={`badge ${roleBadge[user?.role]}`}>{roleLabel[user?.role]}</span>
            <span className="badge b-gray">{user?.dept}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: 'var(--gray-100)', borderRadius: 'var(--r-sm)', padding: 4 }}>
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px', borderRadius: 'var(--r-sm)', fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            background: tab === t ? 'var(--bg-card)' : 'transparent', color: tab === t ? 'var(--text)' : 'var(--text-2)',
            boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', border: 'none', cursor: 'pointer',
          }}>
            {t === 'profile' ? '👤 Edit Profil' : '🔒 Ubah Kata Sandi'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card card-pad">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Informasi Profil</h3>
          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input id="profile-name" className="form-input" value={profileForm.name} onChange={e => setProfileForm(p => ({...p, name: e.target.value}))} placeholder="Nama lengkap Anda" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Email tidak dapat diubah. Hubungi Admin untuk perubahan email.</span>
            </div>
            <div className="form-group">
              <label className="form-label">Departemen</label>
              <select className="form-select" value={profileForm.dept} onChange={e => setProfileForm(p => ({...p, dept: e.target.value}))}>
                {depts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Peran</label>
              <input className="form-input" value={roleLabel[user?.role]} disabled style={{ opacity: 0.6 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card card-pad">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Ubah Kata Sandi</h3>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 18 }}>Pastikan kata sandi baru Anda kuat dan mudah diingat.</p>
          <form onSubmit={handlePwSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputWrapper label="Kata Sandi Saat Ini" id="pw-current" value={pwForm.current}
              onChange={e => setPwForm(p => ({...p, current: e.target.value}))}
              show={showPw.current} onToggle={() => setShowPw(p => ({...p, current: !p.current}))}
              error={pwErrors.current} placeholder="••••••••" />
            <InputWrapper label="Kata Sandi Baru" id="pw-new" value={pwForm.newPw}
              onChange={e => setPwForm(p => ({...p, newPw: e.target.value}))}
              show={showPw.new} onToggle={() => setShowPw(p => ({...p, new: !p.new}))}
              error={pwErrors.newPw} placeholder="Minimal 6 karakter" />
            <InputWrapper label="Konfirmasi Kata Sandi Baru" id="pw-confirm" value={pwForm.confirm}
              onChange={e => setPwForm(p => ({...p, confirm: e.target.value}))}
              show={showPw.confirm} onToggle={() => setShowPw(p => ({...p, confirm: !p.confirm}))}
              error={pwErrors.confirm} placeholder="Ulangi kata sandi baru" />

            {/* Strength indicator */}
            {pwForm.newPw && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => {
                    const strength = pwForm.newPw.length >= 12 ? 4 : pwForm.newPw.length >= 8 ? 3 : pwForm.newPw.length >= 6 ? 2 : 1;
                    const colors = ['', '#dc2626', '#ea580c', '#ca8a04', '#16a34a'];
                    return <div key={i} style={{ flex: 1, height: 4, borderRadius: 9999, background: i <= strength ? colors[strength] : 'var(--gray-200)', transition: 'background 0.3s' }}/>;
                  })}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {pwForm.newPw.length < 6 ? 'Lemah' : pwForm.newPw.length < 8 ? 'Cukup' : pwForm.newPw.length < 12 ? 'Kuat' : 'Sangat Kuat'}
                </span>
              </div>
            )}

            <div style={{ background: 'var(--yellow-light)', borderRadius: 'var(--r-sm)', padding: '10px 12px', fontSize: 12, color: 'var(--yellow)', display: 'flex', gap: 8 }}>
              <span>⚠️</span>
              <span>Setelah mengubah kata sandi, Anda akan tetap masuk. Pastikan Anda menyimpan kata sandi baru di tempat yang aman.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Ubah Kata Sandi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
