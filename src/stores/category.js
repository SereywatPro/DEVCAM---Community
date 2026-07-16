import { defineStore } from 'pinia'
import { categoryApi } from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
    pagination: {},
    error: null
  }),
  getters: {
    nameById: (state) => (id) => {
      const cat = state.categories.find((c) => c.id === id || c.id === Number(id))
      return cat?.name || ''
    }
  },

  actions: {
    async fetchAll(params) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await categoryApi.getAll(params)
        this.categories = data?.data || data || [];
        this.pagination = data?.pagination;
      } catch (err) {
        this.error = err.message
        this.categories = []
      } finally {
        this.isLoading = false
      }
    },
    async create(payload) {
      try {
        await categoryApi.create(payload)
        await this.fetchAll()
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async update(id, payload) {
      try {
        await categoryApi.update(id, payload)
        await this.fetchAll()
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async remove(id) {
      try {
        await categoryApi.remove(id)
        this.categories = this.categories.filter((c) => c.id !== id && c._id !== id)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    }
  }
})
