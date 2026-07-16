import api from './axios'

export const categoryApi = {
  getAll(params = {}) {
    return api.get('/api/v1/categories', { params })
  },
  getById(id) {
    return api.get(`/api/v1/categories/${id}`)
  },
  create(payload) {
    return api.post('/api/v1/categories', payload)
  },
  update(id, payload) {
    return api.put(`/api/v1/categories/${id}`, payload)
  },
  remove(id) {
    return api.delete(`/api/v1/categories/${id}`)
  }
}
