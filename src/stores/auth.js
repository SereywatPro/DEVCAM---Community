import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    isBootstrapped: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async fetchMe() {
      // Skip entirely if we have no token — calling /me without one just
      // throws an auth error and is a wasted round trip.
      const token = localStorage.getItem('auth_token')
      if (!token) {
        this.user = null
        this.isBootstrapped = true
        return
      }
      this.isLoading = true
      try {
        const { data } = await authApi.getMe()
        this.user = data?.data || null
      } catch (err) {
        this.user = null
        localStorage.removeItem('auth_token')
      } finally {
        this.isLoading = false
        this.isBootstrapped = true
      }
    },

    async login(credentials) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await authApi.login(credentials)
        const { token, ...user } = data?.data || {}
        if (token) localStorage.setItem('auth_token', token)
        this.user = user
        this.isBootstrapped = true;
        await this.fetchMe();
        return { success: true }
      } catch (err) {
        this.error = err.message
        return { success: false, message: err.message }
      } finally {
        this.isLoading = false
      }
    },

    async register(payload) {
      this.isLoading = true
      this.error = null
      try {
        await authApi.register(payload)
        return { success: true }
      } catch (err) {
        this.error = err.message
        return { success: false, message: err.message }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      try {
        await authApi.logout()
      } catch (err) {
        // clear local state regardless of whether the API call succeeded
      } finally {
        this.user = null
        localStorage.removeItem('auth_token')
        this.isLoading = false
      }
    }
  }
})
