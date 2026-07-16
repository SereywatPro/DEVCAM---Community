<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  recent: { type: Array, default: () => [] }
})
</script>

<template>
  <aside>
    <div class="hairline pb-3 mb-4">
      <p class="eyebrow mb-3">Categories</p>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink
          v-for="cat in categories"
          :key="cat.id || cat._id || cat.name"
          class="badge-tag"
          :to="{ path: '/blog', query: { category: cat.slug || cat.name } }"
        >
          {{ cat.name }}
        </RouterLink>
      </div>
    </div>
    <div>
      <p class="eyebrow mb-3">Recent</p>
      <ul class="list-unstyled d-flex flex-column gap-3">
        <li v-for="a in recent" :key="a.id || a._id" class="hairline-top pt-2">
          <RouterLink :to="`/blog/${a.id || a._id}`" class="d-block fw-semibold">{{ a.title }}</RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
