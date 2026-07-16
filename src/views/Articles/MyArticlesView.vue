<script setup>
import { computed, onMounted, ref } from 'vue'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const toast = useToastStore()
const pendingDeleteId = ref(null)
const base = import.meta.env.VITE_API_BASE_URL;
onMounted(() => {
  articleStore.fetchOwn()
  categoryStore.fetchAll()
})

async function confirmDelete() {
  const id = pendingDeleteId.value
  pendingDeleteId.value = null
  const res = await articleStore.deleteOwn(id)
  toast[res.success ? 'success' : 'error'](res.success ? 'Article deleted' : res.message)
}
const thumbnail = (a) => {
  if (a?.thumbnail_path) return base + '/' + a?.thumbnail_path;
  return base + "/uploads/thumbnails/default_image.jpg";
}
</script>

<template>
  <div class="px-3 px-md-4 py-5">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <p class="eyebrow mb-2">Manage</p>
        <h1 style="font-size: 2.75rem;">My articles</h1>
      </div>
      <div class="d-flex gap-3">
        <RouterLink to="/dashboard" class="btn-outline-ink">Back to dashboard</RouterLink>
        <RouterLink to="/articles/create" class="btn-ink">New article</RouterLink>
      </div>
    </div>

    <LoadingSpinner v-if="articleStore.isLoading" label="Loading" />
    <p v-else-if="!articleStore.ownArticles.length" class="eyebrow py-5 text-center">You haven't written anything yet.</p>

    <table v-else class="table-ink w-100">
      <thead>
        <tr class="hairline">
          <th class="eyebrow text-start py-2">thumbnail</th>
          <th class="eyebrow text-start py-2">Title</th>
          <th class="eyebrow text-start py-2">Category</th>
          <th class="eyebrow text-start py-2">Content</th>
          <th class="eyebrow text-end py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in articleStore.ownArticles" :key="a.id" class="hairline">
          <td class="py-3"> 
            <img width="200px" class="img-thumbnail" :src="thumbnail(a)" alt="thumbnail"> 
          </td>
          <td class="py-3">{{ a.title }}</td>
          <td class="py-3">{{ categoryStore.nameById(a.category_id) || '—' }}</td>
          <td class="py-3">{{ a.content.length > 37 ? a.content.slice(0,37) + "..." : a.content }}</td>
          <td class="py-3 text-end">
            <RouterLink :to="`/articles/${a.id}/edit`" class="eyebrow me-3">Edit</RouterLink>
            <button class="eyebrow btn btn-link p-0 text-danger" @click="pendingDeleteId = a.id">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmDeleteModal
      :show="!!pendingDeleteId"
      title="Delete this article?"
      message="This article will be permanently removed."
      @confirm="confirmDelete"
      @cancel="pendingDeleteId = null"
    />
  </div>
</template>

<style scoped>
.table-ink { border-collapse: collapse; }
</style>
