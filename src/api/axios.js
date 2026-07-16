import axios from 'axios'

// Base URL for the Blog backend. All routes live under /api/v1 (see app.js).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.result === false) {
      const err = new Error(response.data.message || 'Request failed')
      err.response = response
      return Promise.reject(err)
    }
    return response
  },
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    return Promise.reject({ ...error, message })
  }
)

export default api
