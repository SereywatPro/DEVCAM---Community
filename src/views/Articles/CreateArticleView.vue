<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleForm from '@/components/blog/ArticleForm.vue'
import { useArticleStore } from '@/stores/article'
import { useToastStore } from '@/stores/toast'

const articleStore = useArticleStore()
const toast = useToastStore()
const router = useRouter()
const submitting = ref(false)

async function handleSubmit({ thumbnailFile, ...payload }) {
  submitting.value = true

  const res = await articleStore.createOwn(payload)
  if (!res.success) {
    submitting.value = false
    toast.error(res.message || 'Could not publish article')
    return
  }

  // Thumbnail can only be uploaded once the article exists (it's a per-article endpoint).
  if (thumbnailFile && res.data?.id) {
    const thumbRes = await articleStore.uploadThumbnail(res.data.id, thumbnailFile)
    if (!thumbRes.success) {
      toast.error('Article published, but the thumbnail upload failed: ' + thumbRes.message)
    }
  }

  submitting.value = false
  toast.success('Article published')
  router.push({ name: 'my-articles' })
}
</script>

<template>
  <div class="px-3 px-md-4 py-5 mx-auto" style="max-width: 800px;">
    <p class="eyebrow mb-2">New post</p>
    <h1 class="mb-5" style="font-size: 2.75rem;">Write an article</h1>
    <ArticleForm submit-label="Publish article" :submitting="submitting" @submit="handleSubmit" />
  </div>
</template>
