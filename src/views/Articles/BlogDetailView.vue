<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'

const route = useRoute()
const articleStore = useArticleStore()
const categoryStore = useCategoryStore()

onMounted(() => {
  articleStore.fetchById(route.params.id);
  categoryStore.fetchAll()
})

const categoryName = computed(() =>
  articleStore.currentArticle ? categoryStore.nameById(articleStore.currentArticle.category_id) : ''
)

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131'
const thumbnailSrc = computed(() => {
  const a = articleStore.currentArticle
  if (!a?.thumbnail_path) return null
  return `${base}/${a.thumbnail_path}`
})

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
} 

function avatarSrc() {
  const url = articleStore.currentArticle?.avatar_url;
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131';
  
  if (url.split("/")[3] === "default_avatar.jpg") return base + url;

  return base +"/" + url
}
</script>

<template>
  <div>
    <LoadingSpinner v-if="articleStore.isLoading" label="Loading article" />

    <article v-else-if="articleStore.currentArticle" class="px-3 px-md-4 py-5">
      <p v-if="categoryName" class="eyebrow mb-3">{{ categoryName }}</p>
      <h1 class="mb-4" style="font-size: clamp(2rem, 6vw, 4rem);">{{ articleStore.currentArticle.title }}</h1>
      <img
        :src="avatarSrc()"
        alt="avatar"
        class="rounded-circle mb-3 me-2"
        style="width: 50px; height: 50px; object-fit: cover;"
      />
      <span class="mb-3" style="font-size: 1rem; color: var(--color-ink-50);">By {{ articleStore.currentArticle.name }}</span>
      <span class="mb-3" style="font-size: 1rem; color: var(--color-ink-50);"> | </span>
      <span class="mb-3" style="font-size: 1rem; color: var(--color-ink-50);"> {{ articleStore.currentArticle.email }}</span>
      
      <!-- <span class="mb-3" style="font-size: 1rem; color: var(--color-ink-50);"> {{ formatDate(articleStore.currentArticle.created_at) }}</span> -->
      <p v-if="formatDate(articleStore.currentArticle.created_at)" class="eyebrow hairline pb-4 mb-4">
        Published {{ formatDate(articleStore.currentArticle.created_at) }}
      </p>
      <img
        v-if="thumbnailSrc"
        :src="thumbnailSrc"
        class="w-100 mb-4 h-2"
        style="border: 1px solid var(--color-ink); aspect-ratio: 16/9; object-fit: cover;"
        :alt="articleStore.currentArticle.title"
      />
      <div class="content">{{articleStore.currentArticle.content }}</div>
    </article>

    <div v-else class="px-3 px-md-4 py-5 text-center">
      <p class="eyebrow">Article not found.</p>
    </div>
  </div>
</template>

<style scoped>
.content {
  max-width: 100%;
  font-size: 1.05rem;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-all;
}
.h-2{
  height: 50vh;
  object-fit: cover;
}
</style>
