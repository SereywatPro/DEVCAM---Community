<script setup>
const tabs = [
  { to: { name: 'admin-dashboard' }, label: 'Overview' },
  { to: { name: 'admin-users' }, label: 'Users' },
  { to: { name: 'admin-articles' }, label: 'Articles' },
  { to: { name: 'admin-categories' }, label: 'Categories' }
]
</script>

<template>
  <nav class="hairline px-3 px-md-4 py-3 d-flex flex-wrap gap-2" aria-label="Admin sections">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.label"
      :to="tab.to"
      class="badge-tag admin-tab"
      active-class="is-accent"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.admin-tab { color: var(--color-ink); }
.admin-tab.is-accent { color: var(--color-paper); }
</style>
