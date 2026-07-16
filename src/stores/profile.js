import { defineStore } from 'pinia'
import { profileApi } from '@/api/profile'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchProfile() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await profileApi.getProfile()
        this.profile = data?.data || null
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
    async updateProfile(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await profileApi.updateProfile(payload)
        this.profile = data?.data || this.profile
        return { success: true }
      } catch (err) {
        this.error = err.message
        return { success: false, message: err.message }
      } finally {
        this.isLoading = false
      }
    },
    async uploadAvatar(file) {
      this.isLoading = true
      try {
        const { data } = await profileApi.uploadAvatar(file)
        if (this.profile) this.profile.avatar_url = data?.data?.avatar_url
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      } finally {
        this.isLoading = false
      }
    },
    async deleteAvatar() {
      this.isLoading = true
      try {
        await profileApi.deleteAvatar()
        if (this.profile) this.profile.avatar_url = null
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      } finally {
        this.isLoading = false
      }
    }
  }
})
