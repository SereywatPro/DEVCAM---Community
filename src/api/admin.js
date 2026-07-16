import api from './axios'

export const adminApi = {
  // ---- Users ----
  getUsers(params = {}) {
    // GET /api/v1/admin/users?search=&_page=&_per_page=&sortBy=&sortDir=&include_deleted=
    return api.get('/api/v1/admin/users', { params })
  },
  getUser(id) {
    return api.get(`/api/v1/admin/users/${id}`)
  },
  softDeleteUser(id) {
    // DELETE — soft delete: sets deleted_at, revokes the user's session token.
    return api.delete(`/api/v1/admin/users/${id}`)
  },
  restoreUser(id) {
    return api.patch(`/api/v1/admin/users/${id}/restore`)
  },
  setUserRole(id, role) {
    return api.patch(`/api/v1/admin/users/${id}/role`, { role })
  },

  // ---- Articles ----
  getArticles(params = {}) {
    // GET /api/v1/admin/articles?search=&_page=&_per_page=&sortBy=&sortDir=
    return api.get('/api/v1/admin/articles', { params })
  },
  getArticle(id) {
    return api.get(`/api/v1/admin/articles/${id}`)
  },
  updateArticle(id, { title, content, category_id }) {
    return api.put(`/api/v1/admin/articles/${id}`, { title, content, category_id })
  },
  deleteArticle(id) {
    // Hard delete — the thumbnails row cascades automatically on the backend.
    return api.delete(`/api/v1/admin/articles/${id}`)
  }
}
