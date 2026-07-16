<script setup>
import { onMounted, ref, watch } from 'vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import { useAdminArticlesStore } from '@/stores/adminArticles'
import { useCategoryStore } from '@/stores/category'
import { useToastStore } from '@/stores/toast'

const articlesStore = useAdminArticlesStore()
const categoryStore = useCategoryStore()
const toast = useToastStore()

const search = ref('')
const page = ref(1)
const perPage = 10
const pendingDelete = ref(null)
const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131'

function load() {
  articlesStore.fetchAll({ search: search.value || undefined, _page: page.value, _per_page: perPage })
}

onMounted(() => {
  load()
  categoryStore.fetchAll()
})

watch(search, () => { page.value = 1; load() })
watch(page, load)

async function confirmDelete() {
  const article = pendingDelete.value
  pendingDelete.value = null
  const res = await articlesStore.remove(article.id)
  toast[res.success ? 'success' : 'error'](res.success ? 'Article deleted' : res.message)
}

function thumbnail(a) {
  if (a?.thumbnail_file) return `${base}/uploads/thumbnails/${a.thumbnail_file}`
  return `${base}/uploads/thumbnails/default_image.jpg`
}

function categoryName(a) {
  return a.category_name || categoryStore.nameById(a.category_id) || '—'
}

const totalPages = () => articlesStore.pagination?.total_pages || 1
</script>

<template>
  <div>
    <section class="hairline px-3 px-md-4 pt-4 pb-5">
      <p class="eyebrow mb-3">Admin</p>
      <h1 class="hero-title">Articles</h1>
    </section>

    <AdminTabs />

    <div class="px-3 px-md-4 py-4 hairline" style="min-width: 260px; max-width: 360px;">
      <SearchBox v-model="search" placeholder="Search by title or author…" />
    </div>

    <section class="px-3 px-md-4 py-5">
      <LoadingSpinner v-if="articlesStore.isLoading" label="Loading articles" />
      <p v-else-if="!articlesStore.articles.length" class="eyebrow py-5 text-center">No articles found.</p>

      <table v-else class="table-ink w-100">
        <thead>
          <tr class="hairline">
            <th class="eyebrow text-start py-2">Thumbnail</th>
            <th class="eyebrow text-start py-2">Title</th>
            <th class="eyebrow text-start py-2">Author</th>
            <th class="eyebrow text-start py-2">Category</th>
            <th class="eyebrow text-end py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in articlesStore.articles" :key="a.id" class="hairline">
            <td class="py-3">
              <img width="72" height="54" style="object-fit: cover; border: 1px solid var(--color-ink);" :src="thumbnail(a)" alt="" />
            </td>
            <td class="py-3">{{ a.title }}</td>
            <td class="py-3">
              <div>{{ a.creator_name || '—' }}</div>
              <div class="eyebrow" style="font-size: 0.62rem;">{{ a.creator_email }}</div>
            </td>
            <td class="py-3">{{ categoryName(a) }}</td>
            <td class="py-3 text-end">
              <RouterLink :to="{ name: 'admin-article-edit', params: { id: a.id } }" class="eyebrow me-3">Edit</RouterLink>
              <button class="eyebrow btn btn-link p-0 text-danger" @click="pendingDelete = a">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <AppPagination v-model:current-page="page" :total-pages="totalPages()" />
    </section>

    <ConfirmDeleteModal
      :show="!!pendingDelete"
      title="Delete this article?"
      :message="`'${pendingDelete?.title}' by ${pendingDelete?.creator_name || 'unknown'} will be permanently removed.`"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>

<style scoped>
.hero-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 0.95;
  font-family: var(--font-display);
  text-transform: uppercase;
}
.table-ink { border-collapse: collapse; }
</style>
