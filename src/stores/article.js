import { defineStore } from 'pinia'
import { articleApi } from '@/api/article'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    ownArticles: [],
    currentArticle: null,
    pagination: null,
    ownPagination: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchAll(params) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await articleApi.getAll(params)
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
        const { data } = await articleApi.getById(id)
        this.currentArticle = data?.data || null
      } catch (err) {
        this.error = err.message
        this.currentArticle = null
      } finally {
        this.isLoading = false
      }
    },
    async fetchOwn(params) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await articleApi.getOwn(params)
        this.ownArticles = data?.data || []
        this.ownPagination = data?.pagination || null
      } catch (err) {
        this.error = err.message
        this.ownArticles = []
      } finally {
        this.isLoading = false
      }
    },
    async createOwn(payload) {
      try {
        const { data } = await articleApi.createOwn(payload)
        return { success: true, data: data?.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async updateOwn(id, payload) {
      try {
        const { data } = await articleApi.updateOwn(id, payload)
        return { success: true, data: data?.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async deleteOwn(id) {
      try {
        await articleApi.deleteOwn(id)
        this.ownArticles = this.ownArticles.filter((a) => a.id !== id)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async uploadThumbnail(articleId, file) {
      try {
        const { data } = await articleApi.uploadThumbnail(articleId, file)
        return { success: true, data: data?.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async deleteThumbnail(articleId) {
      try {
        await articleApi.deleteThumbnail(articleId)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    }
  }
})
