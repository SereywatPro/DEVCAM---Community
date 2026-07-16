<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Delete this item?' },
  message: { type: String, default: 'This action cannot be undone.' }, 
  buttonText: { type: String, default: 'Delete' }
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop-ink" @click.self="$emit('cancel')">
      <div class="modal-panel">
        <p class="eyebrow mb-2">Confirm</p>
        <h3 class="mb-3" style="font-size:1.4rem;">{{ title }}</h3>
        <p class="text-secondary mb-4">{{ message }}</p>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn-outline-ink" @click="emit('cancel')">Cancel</button>
          <button class="btn-ink" style="background: var(--color-danger); border-color: var(--color-danger);" @click="emit('confirm')">{{ buttonText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop-ink {
  position: fixed;
  inset: 0;
  background: rgba(18,18,18,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1rem;
}
.modal-panel {
  background: var(--color-paper);
  border: 1px solid var(--color-ink);
  padding: 2rem;
  max-width: 420px;
  width: 100%;
}
</style>
