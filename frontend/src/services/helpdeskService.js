import api from './api';

const isMock = import.meta.env.VITE_USE_MOCK === 'true';

/* ======================================================
   1. AUTHENTICATION & PROFILE SERVICE (Laravel Sanctum)
====================================================== */
export const authService = {
  // POST /api/login -> Returns { token, user }
  login: async (email, password) => {
    return await api.post('/login', { email, password });
  },

  // POST /api/logout -> Revokes current Sanctum token
  logout: async () => {
    return await api.post('/logout');
  },

  // GET /api/user -> Current authenticated user info
  getProfile: async () => {
    return await api.get('/user');
  },

  // PUT /api/user/profile -> Update name, avatar, department
  updateProfile: async (data) => {
    return await api.put('/user/profile', data);
  },

  // PUT /api/user/password -> Change password
  changePassword: async ({ current, newPw, confirm }) => {
    return await api.put('/user/password', {
      current_password: current,
      password: newPw,
      password_confirmation: confirm,
    });
  },
};

/* ======================================================
   2. COMPLAINTS SERVICE (Tiket Pengaduan)
====================================================== */
export const complaintService = {
  // GET /api/complaints?status=...&category_id=...&search=...
  getAll: async (params = {}) => {
    return await api.get('/complaints', { params });
  },

  // GET /api/complaints/{id} -> Single complaint with comments & logs
  getById: async (id) => {
    return await api.get(`/complaints/${id}`);
  },

  // POST /api/complaints -> Create new complaint
  create: async (data) => {
    return await api.post('/complaints', {
      title: data.title,
      description: data.description,
      category_id: data.categoryId,
      priority_id: data.priorityId,
    });
  },

  // PATCH /api/complaints/{id}/status -> Update status ('Sedang Diproses' | 'Selesai')
  updateStatus: async (id, status) => {
    return await api.patch(`/complaints/${id}/status`, { status });
  },

  // PATCH /api/complaints/{id}/assign -> Assign to admin/technician
  assign: async (id, assignedToUserId) => {
    return await api.patch(`/complaints/${id}/assign`, { assigned_to: assignedToUserId });
  },

  // PATCH /api/complaints/{id}/forward -> Forward to owner/manager
  forward: async (id, forwardedToUserId) => {
    return await api.patch(`/complaints/${id}/forward`, { forwarded_to: forwardedToUserId });
  },

  // PATCH /api/complaints/{id}/close -> Close complaint by employee
  close: async (id) => {
    return await api.patch(`/complaints/${id}/close`);
  },

  // PATCH /api/complaints/{id}/reopen -> Reopen closed complaint
  reopen: async (id) => {
    return await api.patch(`/complaints/${id}/reopen`);
  },

  // POST /api/complaints/{id}/comments -> Add discussion comment
  addComment: async (id, text) => {
    return await api.post(`/complaints/${id}/comments`, { text });
  },

  // POST /api/complaints/{id}/rate -> Rate satisfaction (1-5 stars)
  rate: async (id, rating) => {
    return await api.post(`/complaints/${id}/rate`, { rating });
  },
};

/* ======================================================
   3. CATEGORIES & PRIORITIES SERVICE (Data Master)
====================================================== */
export const categoryService = {
  // GET /api/categories
  getAll: async () => {
    return await api.get('/categories');
  },

  // POST /api/categories
  create: async (data) => {
    return await api.post('/categories', data);
  },

  // PUT /api/categories/{id}
  update: async (id, data) => {
    return await api.put(`/categories/${id}`, data);
  },

  // DELETE /api/categories/{id}
  delete: async (id) => {
    return await api.delete(`/categories/${id}`);
  },
};

export const priorityService = {
  // GET /api/priorities
  getAll: async () => {
    return await api.get('/priorities');
  },

  // POST /api/priorities
  create: async (data) => {
    return await api.post('/priorities', data);
  },

  // DELETE /api/priorities/{id}
  delete: async (id) => {
    return await api.delete(`/priorities/${id}`);
  },
};

/* ======================================================
   4. USER MANAGEMENT SERVICE (Admin Role)
====================================================== */
export const userService = {
  // GET /api/users?role=...&search=...
  getAll: async (params = {}) => {
    return await api.get('/users', { params });
  },

  // POST /api/users -> Create user
  create: async (data) => {
    return await api.post('/users', data);
  },

  // PUT /api/users/{id} -> Update user
  update: async (id, data) => {
    return await api.put(`/users/${id}`, data);
  },

  // PATCH /api/users/{id}/toggle-active -> Deactivate or activate user
  toggleActive: async (id) => {
    return await api.patch(`/users/${id}/toggle-active`);
  },
};

/* ======================================================
   5. REPORTS & ANALYTICS SERVICE
====================================================== */
export const reportService = {
  // GET /api/reports/stats?period=7|30|90|all
  getStats: async (period = 'all') => {
    return await api.get('/reports/stats', { params: { period } });
  },

  // GET /api/reports/export -> Export CSV download
  exportCsvUrl: (period = 'all') => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('helpdesk_token');
    return `${base}/reports/export?period=${period}&token=${token || ''}`;
  },
};

/* ======================================================
   6. AI VIRTUAL ASSISTANT SERVICE
====================================================== */
export const assistantService = {
  // POST /api/assistant/ask -> AI response from backend
  ask: async (message) => {
    return await api.post('/assistant/ask', { message });
  },
};
