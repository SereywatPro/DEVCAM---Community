import api from './axios'

export const profileApi = {
  getProfile() {
    return api.get('/api/v1/profile')
  },
  updateProfile({ name, email, bio, phone, address }) {
    return api.put('/api/v1/profile', { name, email, bio, phone, address })
  },
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/api/v1/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteAvatar() {
    return api.delete('/api/v1/profile/avatar')
  }
}
