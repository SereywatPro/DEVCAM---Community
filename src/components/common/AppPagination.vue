<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
const emit = defineEmits(['update:currentPage'])

function go(p) {
  if (p < 1 || p > props.totalPages || p === props.currentPage) return
  emit('update:currentPage', p)
}

const jumpValue = ref(String(props.currentPage))

watch(() => props.currentPage, (p) => {
  jumpValue.value = String(p)
})

function handleJump() {
  const n = Number(jumpValue.value)

  if (!Number.isInteger(n) || n < 1 || n > props.totalPages) {
    jumpValue.value = String(props.currentPage)
    return
  }
  go(n)
}
</script>

<template>
  <nav v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-3 py-4" aria-label="Pagination">
    <button class="btn-outline-ink" :disabled="currentPage === 1" @click="go(currentPage - 1)">&larr; Prev</button>

    <span class="eyebrow">{{ String(currentPage).padStart(2, '0') }} / {{ String(totalPages).padStart(2, '0') }}</span>

    <form class="d-flex align-items-center gap-2" @submit.prevent="handleJump">
      <label class="eyebrow" for="jump-page">Go to</label>
      <input
        id="jump-page"
        v-model="jumpValue"
        type="number"
        min="1"
        :max="totalPages"
        class="form-control-ink"
        style="width: 4.5rem; height:2.5rem; text-align: center;"
        @blur="handleJump"
      />
    </form>

    <button class="btn-outline-ink" :disabled="currentPage === totalPages" @click="go(currentPage + 1)">Next &rarr;</button>
  </nav>
</template>