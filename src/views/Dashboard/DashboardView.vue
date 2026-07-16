<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useArticleStore } from '@/stores/article'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const articleStore = useArticleStore()

onMounted(() => articleStore.fetchOwn())

const stats = computed(() => ([
  { label: 'Published articles', value: articleStore.ownArticles.length },
  { label: 'Account', value: authStore.user?.name || authStore.user?.email || '—' }
]))
</script>

<template>
  <div class="px-3 px-md-4 py-5">
    <p class="eyebrow mb-2">Overview</p>
    <h1 class="mb-5" style="font-size: 2.75rem;">Dashboard</h1>

    <div class="row g-4 mb-5">
      <div class="col-6 col-md-3" v-for="s in stats" :key="s.label">
        <div class="hairline pb-3">
          <p class="eyebrow mb-2">{{ s.label }}</p>
          <p class="fs-4 fw-semibold">{{ s.value }}</p>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-3 mb-5">
      <RouterLink to="/articles/create" class="btn-ink">Write new article</RouterLink>
      <RouterLink to="/my-articles" class="btn-outline-ink">Manage my articles</RouterLink>
      <RouterLink to="/profile" class="btn-outline-ink">View profile</RouterLink>
    </div>

    <p class="eyebrow mb-3">Recent articles</p>
    <LoadingSpinner v-if="articleStore.isLoading" label="Loading" />
    <ul v-else class="list-unstyled">
      <li v-for="a in articleStore.ownArticles.slice(0, 5)" :key="a.id" class="hairline-top py-3 d-flex justify-content-between">
        <span>{{ a.title }}</span>
        <RouterLink :to="`/articles/${a.id}/edit`" class="eyebrow">Edit</RouterLink>
      </li>
      <li v-if="!articleStore.ownArticles.length" class="hairline-top py-3 eyebrow">No articles yet — write your first one.</li>
    </ul>
  </div>
</template>
