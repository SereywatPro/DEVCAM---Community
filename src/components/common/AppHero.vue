<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <section class="hairline px-3 px-md-4 pt-4 pb-5">
    <p class="eyebrow mb-3">{{ subtitle || 'A developer blog community' }}</p>
    <h1 class="hero-title">{{ title }}</h1>
  </section>
</template>

<style scoped>
.hero-title {
  font-size: clamp(3rem, 11vw, 8.5rem);
  line-height: 0.92;
  font-weight: 400;
}
</style>
