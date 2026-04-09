import api from './axios'

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data)       => api.post('/auth/register', data),
  login:    (data)       => api.post('/auth/login', data),
  me:       ()           => api.get('/auth/me'),
  updateProfile: (data)  => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
}

// ── Decisions ─────────────────────────────────────────────
export const decisionsAPI = {
  getAll:  ()          => api.get('/decisions'),
  getOne:  (id)        => api.get(`/decisions/${id}`),
  create:  (data)      => api.post('/decisions', data),
  update:  (id, data)  => api.put(`/decisions/${id}`, data),
  delete:  (id)        => api.delete(`/decisions/${id}`),
}

// ── Checkins ─────────────────────────────────────────────
export const checkinsAPI = {
  getAll: (decisionId)              => api.get(`/checkins/${decisionId}`),
  create: (decisionId, data)        => api.post(`/checkins/${decisionId}`, data),
  delete: (decisionId, checkinId)   => api.delete(`/checkins/${decisionId}/${checkinId}`),
}

// ── Analytics ─────────────────────────────────────────────
export const analyticsAPI = {
  summary:  ()           => api.get('/analytics/summary'),
  timeline: (decisionId) => api.get(`/analytics/timeline/${decisionId}`),
}

