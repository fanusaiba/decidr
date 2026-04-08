import api from './axios'

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data)       => api.post('/api/auth/register', data),
  login:    (data)       => api.post('/api/auth/login', data),
  me:       ()           => api.get('/api/auth/me'),
  updateProfile: (data)  => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/password', data),
}

// ── Decisions ─────────────────────────────────────────────
export const decisionsAPI = {
  getAll:  ()          => api.get('/api/decisions'),
  getOne:  (id)        => api.get(`/api/decisions/${id}`),
  create:  (data)      => api.post('/api/decisions', data),
  update:  (id, data)  => api.put(`/api/decisions/${id}`, data),
  delete:  (id)        => api.delete(`/api/decisions/${id}`),
}

// ── Checkins ─────────────────────────────────────────────
export const checkinsAPI = {
  getAll: (decisionId)              => api.get(`/api/checkins/${decisionId}`),
  create: (decisionId, data)        => api.post(`/api/checkins/${decisionId}`, data),
  delete: (decisionId, checkinId)   => api.delete(`/api/checkins/${decisionId}/${checkinId}`),
}

// ── Analytics ─────────────────────────────────────────────
export const analyticsAPI = {
  summary:  ()           => api.get('/api/analytics/summary'),
  timeline: (decisionId) => api.get(`/api/analytics/timeline/${decisionId}`),
}
