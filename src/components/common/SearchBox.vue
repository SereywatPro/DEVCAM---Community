<script setup>
const model = defineModel({ type: String, default: '' })
defineProps({ placeholder: { type: String, default: 'Search articles…' } })
</script>

<template>
  <div class="search-box hairline pb-2">
    <input
      v-model="model"
      type="search"
      class="search-input"
      :placeholder="placeholder"
      aria-label="Search articles"
    />
  </div>
</template>

<style scoped>
.search-input {
  border: none;
  background: transparent;
  width: 100%;
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.35rem 0;
}
.search-input:focus { outline: none; }
</style>
