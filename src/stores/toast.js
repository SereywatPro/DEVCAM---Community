import { defineStore } from 'pinia'

let idCounter = 0

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),
  actions: {
    push(message, variant = 'ink') {
      const id = ++idCounter
      this.toasts.push({ id, message, variant })
      setTimeout(() => this.dismiss(id), 3500)
    },
    success(message) { this.push(message, 'success') },
    error(message) { this.push(message, 'danger') },
    dismiss(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})
