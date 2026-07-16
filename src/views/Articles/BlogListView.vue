<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import CategoryBadge from '@/components/common/CategoryBadge.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const search = ref('')
const activeCategory = ref('all')
const page = ref(1)
const perPage = 12

function load() {
  articleStore.fetchAll({
    search: search.value || undefined,
    category_id: activeCategory.value !== 'all' ? activeCategory.value : undefined,
    _page: page.value,
    _per_page: perPage
  })
}

onMounted(() => {
  load()
  categoryStore.fetchAll()
})

// any filter change must reset to page 1, THEN load
watch(search, () => { page.value = 1; load() })
watch(activeCategory, () => { page.value = 1; load() })
watch(page, load)

// no more client-side filtering — the server already returned
// exactly the (filtered + paginated) articles we should show
const articles = computed(() => articleStore.articles)
const totalPages = computed(() => articleStore.pagination?.total_pages || 1)
</script>

<template>
  <div>
    <div class="px-3 px-md-4 py-4 hairline d-flex flex-column flex-md-row justify-content-between gap-3">
      <h1 style="font-size: 2.5rem;">Blog</h1>
      <div style="min-width: 260px;">
        <SearchBox v-model="search" />
      </div>
    </div>

    <div class="px-3 px-md-4 py-4 hairline">
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
    </div>

    <section class="px-3 px-md-4 py-5">
      <LoadingSpinner v-if="articleStore.isLoading" label="Loading articles" />

      <div v-else-if="articleStore.requiresAuthToView" class="text-center py-5">
        <p class="eyebrow mb-3">Log in required</p>
        <p class="text-secondary mb-4">This backend currently requires an account to browse articles.</p>
        <RouterLink to="/login" class="btn-ink">Log in</RouterLink>
      </div>

      <p v-else-if="!articles.length" class="eyebrow py-5 text-center">No articles found.</p>

      <div v-else class="row g-4">
        <div class="col-12 col-md-4 col-lg-3" v-for="a in articles" :key="a.id">
          <BlogCard :article="a" />
        </div>
      </div>
      <AppPagination v-model:current-page="page" :total-pages="totalPages" />
    </section>
  </div>
</template>