<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="hairline-top mt-auto px-3 px-md-4 py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
      <span class="eyebrow">&copy; {{ year }} DEVCAM &mdash; SEREYWAT WHO WRITE</span>
      <div class="d-flex gap-3">
        <a href="https://github.com/SereywatPro" class="eyebrow">GitHub</a>
        <a href="https://www.linkedin.com/in/keo-sereywat-685655357" class="eyebrow">LinkIn</a>
      </div>
      <span class="corner-mark" aria-hidden="true">&#8600;</span>
    </div>
  </footer>
</template>

<style scoped>
.corner-mark {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  display: none;
}
@media (min-width: 768px) { .corner-mark { display: inline-block; } }
</style>
