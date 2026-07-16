<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/category'

const props = defineProps({
  article: { type: Object, required: true }
})

const categoryStore = useCategoryStore()

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Derive an excerpt from real content only — never fabricate copy.
const excerpt = computed(() => {
  if (props.article.content) {
    const text = String(props.article.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text.length > 140 ? text.slice(0, 140) + '…' : text
  }
  return ''
})
const thumbnailUrl = computed(() => 
  import.meta.env.VITE_API_BASE_URL + "/" + (props.article.thumbnail_path || 'uploads/thumbnails/default_image.jpg')
)

const categoryName = computed(() => categoryStore.nameById(props.article.category_id))
const dateLabel = computed(() => formatDate(props.article.created_at))
</script>

<template>
  <RouterLink :to="`/blog/${article.id}`" class="blog-card d-block">
    <div class="thumb-wrap">
      <img
        v-if="thumbnailUrl"
        :src="thumbnailUrl"
        :alt="article.title"
        class="thumb"
        loading="lazy"
      />
      <div v-else class="thumb thumb-placeholder eyebrow">No image</div>
      <span v-if="categoryName" class="badge-tag thumb-badge">{{ categoryName }}</span>
    </div>
    <p v-if="dateLabel" class="eyebrow mt-3 mb-2">{{ dateLabel }}</p>
    <h3 class="card-title">{{ article.title.length >25 ? article.title.slice(0,25) + "..." : article.title }}</h3>
    <p v-if="excerpt" class="card-excerpt">{{ excerpt.length > 46 ? excerpt.slice(0,46) +"..." : excerpt }}</p>
  </RouterLink>
</template>

<style scoped>
.blog-card { color: var(--color-ink); }
.thumb-wrap { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--color-paper-dim); border: 1px solid var(--color-ink); }
.thumb { width: 100%; height: 100%; object-fit: cover; filter: grayscale(15%); transition: transform 0.3s ease; }
.blog-card:hover .thumb { transform: scale(1.03); }
.thumb-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; }
.thumb-badge { position: absolute; top: 0.6rem; right: 0.6rem; background: var(--color-paper); }
.card-title { font-size: 1.25rem; margin-bottom: 0.5rem; text-transform: none; font-family: var(--font-display); }
.card-excerpt { color: var(--color-ink-soft); font-size: 0.92rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
