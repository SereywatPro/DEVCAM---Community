import api from './axios'

export const articleApi = {
  getAll(params = {}) {
    // GET /api/v1/articles?search=&_page=&_per_page=&SortBy=&SortDir=
    return api.get('/api/v1/articles', { params })
  },
  getById(id) {
    // GET /api/v1/articles/:id
    return api.get(`/api/v1/articles/${id}`)
  },
  getOwn(params = {}) {
    // GET /api/v1/articles/own?search=&_page=&_per_page=&SortBy=&SortDir=
    return api.get('/api/v1/articles/own', { params })
  },
  createOwn({ title, content, category_id }) {
    // POST /api/v1/articles/own
    return api.post('/api/v1/articles/own', { title, content, category_id })
  },
  updateOwn(id, { title, content, category_id }) {
    // PUT /api/v1/articles/own/:id
    return api.put(`/api/v1/articles/own/${id}`, { title, content, category_id })
  },
  deleteOwn(id) {
    // DELETE /api/v1/articles/own/:id
    return api.delete(`/api/v1/articles/own/${id}`)
  },
  uploadThumbnail(articleId, file) {
    // POST /api/v1/articles/:id/thumbnail (multipart, field name "thumbnail")
    const formData = new FormData()
    formData.append('thumbnail', file)
    return api.post(`/api/v1/articles/${articleId}/thumbnail`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteThumbnail(articleId) {
    // DELETE /api/v1/articles/:id/thumbnail
    return api.delete(`/api/v1/articles/${articleId}/thumbnail`)
  }
}
