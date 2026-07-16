import api from './axios'

// routers/auth.js
export const authApi = {
  register(payload) {
    // POST /api/v1/register  { name, email, password, confirmPassword }
    return api.post('/api/v1/register', payload)
  },
  login(payload) {
    // POST /api/v1/login  { email, password }
    return api.post('/api/v1/login', payload)
  },
  getMe() {
    // GET /api/v1/me
    return api.get('/api/v1/me')
  },
  logout() {
    // DELETE /api/v1/logout
    return api.delete('/api/v1/logout')
  }
}
