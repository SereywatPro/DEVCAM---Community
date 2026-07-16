<script setup>
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()
</script>

<template>
  <div class="toast-stack">
    <TransitionGroup name="toast">
      <div
        v-for="t in toastStore.toasts"
        :key="t.id"
        class="toast-item"
        :class="`is-${t.variant}`"
      >
        <span class="eyebrow">{{ t.message }}</span>
        <button class="toast-close" @click="toastStore.dismiss(t.id)" aria-label="Dismiss">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 320px;
}
.toast-item {
  background: var(--color-ink);
  color: var(--color-paper);
  border: 1px solid var(--color-ink);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.toast-item .eyebrow { color: var(--color-paper); }
.toast-item.is-danger { background: var(--color-danger); border-color: var(--color-danger); }
.toast-item.is-success { background: #1F5C3B; border-color: #1F5C3B; }
.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}
.toast-enter-active, .toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
