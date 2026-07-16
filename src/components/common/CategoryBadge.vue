<script setup>
defineProps({
  name: { type: String, required: true },
  active: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="badge-tag"
    :class="{ 'is-accent': active }"
    @click="$emit('click')"
  >
    {{ name }}
  </button>
</template>
