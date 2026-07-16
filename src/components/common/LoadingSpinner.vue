<script setup>
defineProps({
  label: { type: String, default: 'Loading' }
})
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center py-5">
    <div class="spinner" aria-hidden="true"></div>
    <span class="eyebrow mt-2">{{ label }}&hellip;</span>
  </div>
</template>

<style scoped>
.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-ink);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
