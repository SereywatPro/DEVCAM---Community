import { defineStore } from 'pinia'
import { adminApi } from '@/api/admin'

export const useAdminUsersStore = defineStore('adminUsers', {
  state: () => ({
    users: [],
    pagination: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchAll(params) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await adminApi.getUsers(params)
        this.users = data?.data || []
        this.pagination = data?.pagination || null
      } catch (err) {
        this.error = err.message
        this.users = []
      } finally {
        this.isLoading = false
      }
    },
    async softDelete(id) {
      try {
        await adminApi.softDeleteUser(id)
        const user = this.users.find((u) => u.id === id)
        if (user) user.deleted_at = new Date().toISOString()
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async restore(id) {
      try {
        await adminApi.restoreUser(id)
        const user = this.users.find((u) => u.id === id)
        if (user) user.deleted_at = null
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async setRole(id, role) {
      try {
        await adminApi.setUserRole(id, role)
        const user = this.users.find((u) => u.id === id)
        if (user) user.role = role
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    }
  }
})
