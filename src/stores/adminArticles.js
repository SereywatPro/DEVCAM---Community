import { defineStore } from 'pinia'
import { adminApi } from '@/api/admin'

export const useAdminArticlesStore = defineStore('adminArticles', {
  state: () => ({
    articles: [],
    currentArticle: null,
    pagination: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchAll(params) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await adminApi.getArticles(params)
        this.articles = data?.data || []
        this.pagination = data?.pagination || null
      } catch (err) {
        this.error = err.message
        this.articles = []
      } finally {
        this.isLoading = false
      }
    },
    async fetchById(id) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await adminApi.getArticle(id)
        this.currentArticle = data?.data || null
      } catch (err) {
        this.error = err.message
        this.currentArticle = null
      } finally {
        this.isLoading = false
      }
    },
    async update(id, payload) {
      try {
        const { data } = await adminApi.updateArticle(id, payload)
        return { success: true, data: data?.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async remove(id) {
      try {
        await adminApi.deleteArticle(id)
        this.articles = this.articles.filter((a) => a.id !== id)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    }
  }
})
