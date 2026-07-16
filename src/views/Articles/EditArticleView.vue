<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleForm from '@/components/blog/ArticleForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useArticleStore } from '@/stores/article'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const toast = useToastStore()
const submitting = ref(false)

onMounted(async () => {
  await articleStore.fetchOwn()
})

const article = computed(() =>
  articleStore.ownArticles.find((a) => String(a.id) === String(route.params.id))
)

async function handleSubmit({ thumbnailFile, ...payload }) {
  submitting.value = true
  const id = route.params.id

  const res = await articleStore.updateOwn(id, payload)
  if (!res.success) {
    submitting.value = false
    toast.error(res.message || 'Could not update article')
    return
  }

  if (thumbnailFile) {
    const thumbRes = await articleStore.uploadThumbnail(id, thumbnailFile)
    if (!thumbRes.success) {
      toast.error('Article updated, but the thumbnail upload failed: ' + thumbRes.message)
    }
  }

  submitting.value = false
  toast.success('Article updated')
  router.push({ name: 'my-articles' })
}
</script>

<template>
  <div class="px-3 px-md-4 py-5 mx-auto" style="max-width: 800px;">
    <p class="eyebrow mb-2">Edit post</p>
    <h1 class="mb-5" style="font-size: 2.75rem;">Edit article</h1>

    <LoadingSpinner v-if="articleStore.isLoading" label="Loading" />
    <ArticleForm
      v-else-if="article"
      :model-value="article"
      submit-label="Save changes"
      :submitting="submitting"
      @submit="handleSubmit"
    />
    <p v-else class="eyebrow">Article not found.</p>
  </div>
</template>
