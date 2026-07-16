<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import AppHero from '@/components/common/AppHero.vue'
import CategoryBadge from '@/components/common/CategoryBadge.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const activeCategory = ref('all')
const perPage = ref(12)
const nextPage = ref(false)

function load() {
  articleStore.fetchAll({
    _per_page: perPage.value,
    category_id: activeCategory.value !== 'all' ? activeCategory.value : undefined,
    has_next: nextPage.value,
  })
}
onMounted(() => {
  load()
  categoryStore.fetchAll()
})
function NextPage() {
  nextPage.value = true;
  perPage.value += 12;
  load()
}
watch(activeCategory, () => { perPage.value = 12; load() })

const filtered = computed(() => {
  if (activeCategory.value === 'all') return articleStore.articles
  return articleStore.articles.filter((a) => a.category_id === activeCategory.value)
})
</script>

<template>
  <div>
    <AppHero title="DEVCAM" subtitle="Writing from developers, for developers" />

    <section class="px-3 px-md-4 py-4 hairline">
      <p class="eyebrow mb-3">Categories</p>
      <div class="d-flex flex-wrap gap-2">
        <CategoryBadge name="All" :active="activeCategory === 'all'" @click="activeCategory = 'all'" />
        <CategoryBadge
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          :name="cat.name"
          :active="activeCategory === cat.id"
          @click="activeCategory = cat.id"
        />
      </div>
    </section>

    <section class="px-3 px-md-4 py-5">
      <LoadingSpinner v-if="articleStore.isLoading" label="Loading articles" />

      <div v-else-if="articleStore.requiresAuthToView" class="text-center py-5">
        <p class="eyebrow mb-3">Log in required</p>
        <p class="text-secondary mb-4">This backend currently requires an account to browse articles.</p>
        <RouterLink to="/login" class="btn-ink">Log in</RouterLink>
      </div>

      <p v-else-if="!filtered.length" class="eyebrow py-5 text-center">
        No articles published yet. Be the first to write one.
      </p>

      <div v-else class="row g-4">
        <div class="col-12 col-md-4 col-lg-3" v-for="a in filtered" :key="a.id">
          <BlogCard :article="a" />
        </div>
        <div v-if="articleStore.pagination?.has_next" class="col-12 text-center">
          <button class="btn-outline-ink" @click="NextPage()">Load more</button>
        </div>
      </div>
    </section>
  </div>
</template>
