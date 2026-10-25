import { createContext, useContext, useState } from 'react';
import { USERS } from './AuthContext';

const AppContext = createContext(null);

const now = new Date();
const d = (daysAgo, h = 9, m = 0) => {
  const x = new Date(now); x.setDate(x.getDate() - daysAgo);
  x.setHours(h, m, 0, 0); return x.toISOString();
};

export const CATEGORIES = [
  { id: 1, name: 'Infrastruktur IT', color: '#2563eb' },
  { id: 2, name: 'Software / Aplikasi', color: '#7c3aed' },
  { id: 3, name: 'Jaringan & Internet', color: '#ea580c' },
  { id: 4, name: 'Hardware / Perangkat', color: '#16a34a' },
  { id: 5, name: 'SDM / Kepegawaian', color: '#dc2626' },
  { id: 6, name: 'Keuangan', color: '#ca8a04' },
  { id: 7, name: 'Fasilitas Kantor', color: '#0891b2' },
];

export const PRIORITIES = [
  { id: 1, name: 'Rendah', color: '#16a34a', badge: 'b-green' },
  { id: 2, name: 'Sedang', color: '#ca8a04', badge: 'b-yellow' },
  { id: 3, name: 'Tinggi', color: '#ea580c', badge: 'b-orange' },
  { id: 4, name: 'Kritis', color: '#dc2626', badge: 'b-red' },
];

const INIT_COMPLAINTS = [
  {
    id: 'HDK-001', title: 'Komputer tidak bisa menyala', categoryId: 4, priorityId: 4,
    status: 'Selesai', submittedBy: 1, assignedTo: 4, forwardedTo: 5,
    createdAt: d(10), updatedAt: d(1),
    description: 'Komputer di meja saya tidak mau menyala sejak pagi hari. Sudah dicoba beberapa kali namun tetap tidak bisa.',
    comments: [
      { id: 1, userId: 4, text: 'Sudah kami terima. Segera kami tindak lanjuti.', createdAt: d(10, 10) },
      { id: 2, userId: 5, text: 'Kami sudah cek, ada masalah pada power supply. Akan diganti.', createdAt: d(9, 11) },
      { id: 3, userId: 1, text: 'Terima kasih, komputer sudah bisa digunakan kembali.', createdAt: d(1, 15) },
    ],
    logs: [
      { id: 1, action: 'Pengaduan dibuat', by: 1, at: d(10) },
      { id: 2, action: 'Status → Sedang Diproses', by: 4, at: d(10, 10) },
      { id: 3, action: 'Diteruskan ke Owner', by: 4, at: d(9, 9) },
      { id: 4, action: 'Status → Selesai', by: 5, at: d(1, 14) },
    ],
    rating: 5, reopened: false,
  },
  {
    id: 'HDK-002', title: 'VPN tidak dapat terhubung', categoryId: 3, priorityId: 3,
    status: 'Sedang Diproses', submittedBy: 2, assignedTo: 4, forwardedTo: null,
    createdAt: d(3), updatedAt: d(1),
    description: 'Tidak bisa terhubung ke VPN perusahaan. Sudah coba restart router namun tetap tidak berhasil.',
    comments: [
      { id: 4, userId: 4, text: 'Sedang kami investigasi dari sisi server.', createdAt: d(3, 11) },
    ],
    logs: [
      { id: 5, action: 'Pengaduan dibuat', by: 2, at: d(3) },
      { id: 6, action: 'Status → Sedang Diproses', by: 4, at: d(3, 11) },
    ],
    rating: null, reopened: false,
  },
  {
    id: 'HDK-003', title: 'Permintaan kenaikan akses sistem HRD', categoryId: 5, priorityId: 2,
    status: 'Menunggu Owner', submittedBy: 3, assignedTo: 4, forwardedTo: 5,
    createdAt: d(5), updatedAt: d(2),
    description: 'Membutuhkan akses tambahan ke modul HRD untuk keperluan rekapitulasi absensi bulanan.',
    comments: [],
    logs: [
      { id: 7, action: 'Pengaduan dibuat', by: 3, at: d(5) },
      { id: 8, action: 'Status → Sedang Diproses', by: 4, at: d(5, 11) },
      { id: 9, action: 'Diteruskan ke Owner', by: 4, at: d(4) },
      { id: 10, action: 'Status → Menunggu Owner', by: 4, at: d(4) },
    ],
    rating: null, reopened: false,
  },
  {
    id: 'HDK-004', title: 'Aplikasi absensi error saat login', categoryId: 2, priorityId: 3,
    status: 'Baru', submittedBy: 1, assignedTo: null, forwardedTo: null,
    createdAt: d(0, 8), updatedAt: d(0, 8),
    description: 'Aplikasi absensi menampilkan error "Session Timeout" setiap kali mencoba login di pagi hari.',
    comments: [],
    logs: [
      { id: 11, action: 'Pengaduan dibuat', by: 1, at: d(0, 8) },
    ],
    rating: null, reopened: false,
  },
  {
    id: 'HDK-005', title: 'Proyektor ruang rapat tidak berfungsi', categoryId: 7, priorityId: 2,
    status: 'Baru', submittedBy: 2, assignedTo: null, forwardedTo: null,
    createdAt: d(1, 14), updatedAt: d(1, 14),
    description: 'Proyektor di ruang rapat lantai 3 tidak mengeluarkan gambar meski sudah dihidupkan.',
    comments: [],
    logs: [
      { id: 12, action: 'Pengaduan dibuat', by: 2, at: d(1, 14) },
    ],
    rating: null, reopened: false,
  },
  {
    id: 'HDK-006', title: 'Laporan keuangan tidak bisa diexport PDF', categoryId: 6, priorityId: 3,
    status: 'Ditutup', submittedBy: 2, assignedTo: 4, forwardedTo: null,
    createdAt: d(15), updatedAt: d(12),
    description: 'Fitur export PDF pada modul laporan keuangan menampilkan error 500.',
    comments: [
      { id: 13, userId: 4, text: 'Bug sudah diperbaiki, silakan coba kembali.', createdAt: d(13, 10) },
    ],
    logs: [
      { id: 13, action: 'Pengaduan dibuat', by: 2, at: d(15) },
      { id: 14, action: 'Status → Sedang Diproses', by: 4, at: d(15, 10) },
      { id: 15, action: 'Status → Selesai', by: 4, at: d(13, 10) },
      { id: 16, action: 'Pengaduan Ditutup', by: 2, at: d(12) },
    ],
    rating: 4, reopened: false,
  },
];

export function AppProvider({ children }) {
  const [complaints, setComplaints] = useState(INIT_COMPLAINTS);
  const [users, setUsers] = useState(USERS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [priorities, setPriorities] = useState(PRIORITIES);
  const [nextId, setNextId] = useState(7);
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  /* Complaints */
  const addComplaint = (data, userId) => {
    const id = `HDK-${String(nextId).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newC = {
      id, ...data, status: 'Baru', submittedBy: userId,
      assignedTo: null, forwardedTo: null,
      createdAt: now, updatedAt: now,
      comments: [], logs: [{ id: Date.now(), action: 'Pengaduan dibuat', by: userId, at: now }],
      rating: null, reopened: false,
    };
    setComplaints(p => [newC, ...p]);
    setNextId(n => n + 1);
    showToast(`Pengaduan ${id} berhasil dibuat!`);
    return id;
  };

  const updateComplaintStatus = (id, status, userId, extra = {}) => {
    const now = new Date().toISOString();
    setComplaints(p => p.map(c => c.id === id
      ? { ...c, status, updatedAt: now, ...extra, logs: [...c.logs, { id: Date.now(), action: `Status → ${status}`, by: userId, at: now }] }
      : c
    ));
  };

  const forwardComplaint = (id, toUserId, userId) => {
    const now = new Date().toISOString();
    setComplaints(p => p.map(c => c.id === id
      ? { ...c, forwardedTo: toUserId, status: 'Menunggu Owner', updatedAt: now, logs: [...c.logs, { id: Date.now(), action: 'Diteruskan ke Owner', by: userId, at: now }] }
      : c
    ));
    showToast('Pengaduan berhasil diteruskan ke Owner!');
  };

  const assignComplaint = (id, toUserId, userId) => {
    const now = new Date().toISOString();
    setComplaints(p => p.map(c => c.id === id
      ? { ...c, assignedTo: toUserId, status: 'Sedang Diproses', updatedAt: now, logs: [...c.logs, { id: Date.now(), action: `Ditugaskan ke ${users.find(u=>u.id===toUserId)?.name}`, by: userId, at: now }] }
      : c
    ));
    showToast('Pengaduan berhasil ditugaskan!');
  };

  const closeComplaint = (id, userId) => {
    const now = new Date().toISOString();
    setComplaints(p => p.map(c => c.id === id
      ? { ...c, status: 'Ditutup', updatedAt: now, logs: [...c.logs, { id: Date.now(), action: 'Pengaduan Ditutup', by: userId, at: now }] }
      : c
    ));
    showToast('Pengaduan berhasil ditutup.');
  };

  const reopenComplaint = (id, userId) => {
    const now = new Date().toISOString();
    setComplaints(p => p.map(c => c.id === id
      ? { ...c, status: 'Baru', reopened: true, updatedAt: now, logs: [...c.logs, { id: Date.now(), action: 'Pengaduan Dibuka Kembali', by: userId, at: now }] }
      : c
    ));
    showToast('Pengaduan berhasil dibuka kembali.');
  };

  const addComment = (id, text, userId) => {
    const now = new Date().toISOString();
    const comment = { id: Date.now(), userId, text, createdAt: now };
    setComplaints(p => p.map(c => c.id === id
      ? { ...c, comments: [...c.comments, comment], updatedAt: now }
      : c
    ));
  };

  const rateComplaint = (id, rating, userId) => {
    setComplaints(p => p.map(c => c.id === id ? { ...c, rating } : c));
    showToast('Terima kasih atas penilaian Anda!');
  };

  /* Users */
  const addUser = (data) => {
    const id = Math.max(...users.map(u => u.id)) + 1;
    const initials = data.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    setUsers(p => [...p, { id, ...data, avatar: initials, active: true }]);
    showToast('Pengguna berhasil ditambahkan!');
  };
  const updateUser = (id, data) => { setUsers(p => p.map(u => u.id === id ? { ...u, ...data } : u)); showToast('Data pengguna diperbarui.'); };
  const toggleUser = (id) => { setUsers(p => p.map(u => u.id === id ? { ...u, active: !u.active } : u)); };

  /* Categories */
  const addCategory = (data) => { setCategories(p => [...p, { id: Date.now(), ...data }]); showToast('Kategori ditambahkan!'); };
  const updateCategory = (id, data) => { setCategories(p => p.map(c => c.id === id ? { ...c, ...data } : c)); };
  const deleteCategory = (id) => { setCategories(p => p.filter(c => c.id !== id)); showToast('Kategori dihapus.'); };

  /* Priorities */
  const addPriority = (data) => { setPriorities(p => [...p, { id: Date.now(), ...data }]); showToast('Prioritas ditambahkan!'); };
  const deletePriority = (id) => { setPriorities(p => p.filter(pr => pr.id !== id)); };

  return (
    <AppContext.Provider value={{
      complaints, users, categories, priorities, toasts,
      addComplaint, updateComplaintStatus, forwardComplaint, assignComplaint,
      closeComplaint, reopenComplaint, addComment, rateComplaint,
      addUser, updateUser, toggleUser,
      addCategory, updateCategory, deleteCategory,
      addPriority, deletePriority, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
