<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAdminArticlesStore } from '@/stores/adminArticles'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'
import { useToastStore } from '@/stores/toast'
import { sanitizeText, validateImageFile } from '@/composables/useValidators'

const route = useRoute()
const router = useRouter()
const articlesStore = useAdminArticlesStore()
const articleStore = useArticleStore() // reused only for its uploadThumbnail action
const categoryStore = useCategoryStore()
const toast = useToastStore()

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131'
const form = ref({ title: '', category_id: '', content: '' })
const errors = ref({})
const submitting = ref(false)
const thumbnailFile = ref(null)
const thumbnailPreview = ref('')

onMounted(async () => {
  categoryStore.fetchAll()
  await articlesStore.fetchById(route.params.id)
  const a = articlesStore.currentArticle
  if (a) {
    form.value = { title: a.title, category_id: a.category_id, content: a.content }
    thumbnailPreview.value = a.thumbnail_file
      ? `${base}/uploads/thumbnails/${a.thumbnail_file}`
      : ''
  }
})

function validate() {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required.'
  if (!form.value.category_id) errors.value.category_id = 'Choose a category.'
  if (!form.value.content.trim()) errors.value.content = 'Content is required.'
  return Object.keys(errors.value).length === 0
}

function onThumbnailChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const fileError = validateImageFile(file)
  if (fileError) {
    errors.value.thumbnail = fileError
    e.target.value = ''
    return
  }
  errors.value.thumbnail = null
  thumbnailFile.value = file
  thumbnailPreview.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true

  const res = await articlesStore.update(route.params.id, {
    title: sanitizeText(form.value.title),
    content: form.value.content.trim(),
    category_id: Number(form.value.category_id)
  })
  if (!res.success) {
    submitting.value = false
    toast.error(res.message || 'Could not update article')
    return
  }

  if (thumbnailFile.value) {
    const thumbRes = await articleStore.uploadThumbnail(route.params.id, thumbnailFile.value)
    if (!thumbRes.success) {
      toast.error('Article updated, but the thumbnail upload failed: ' + thumbRes.message)
    }
  }

  submitting.value = false
  toast.success('Article updated')
  router.push({ name: 'admin-articles' })
}
</script>

<template>
  <div class="px-3 px-md-4 py-5 mx-auto" style="max-width: 800px;">
    <p class="eyebrow mb-2">Admin &middot; Moderate</p>
    <h1 class="mb-2" style="font-size: 2.75rem;">Edit article</h1>
    <p v-if="articlesStore.currentArticle" class="eyebrow mb-5">
      by {{ articlesStore.currentArticle.creator_name }} ({{ articlesStore.currentArticle.creator_email }})
    </p>

    <LoadingSpinner v-if="articlesStore.isLoading" label="Loading article" />

    <form v-else @submit.prevent="handleSubmit" class="d-flex flex-column gap-4">
      <div>
        <label class="eyebrow d-block mb-1" for="title">Title</label>
        <input id="title" v-model="form.title" type="text" class="form-control-ink" maxlength="140" required />
        <p v-if="errors.title" class="text-danger small mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label class="eyebrow d-block mb-1" for="category">Category</label>
        <select id="category" v-model="form.category_id" class="form-control-ink" required>
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <p v-if="errors.category_id" class="text-danger small mt-1">{{ errors.category_id }}</p>
      </div>

      <div>
        <label class="eyebrow d-block mb-1" for="thumbnail">Thumbnail</label>
        <input id="thumbnail" type="file" accept="image/jpeg,image/png,image/webp" class="form-control-ink" @change="onThumbnailChange" />
        <p class="eyebrow mt-1" style="font-size: 0.65rem;">JPEG, PNG, or WEBP — up to 2MB</p>
        <p v-if="errors.thumbnail" class="text-danger small mt-1">{{ errors.thumbnail }}</p>
        <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Preview" class="mt-2" style="max-width: 240px; border: 1px solid var(--color-ink);" />
      </div>

      <div>
        <label class="eyebrow d-block mb-1" for="content">Content</label>
        <textarea id="content" v-model="form.content" rows="10" class="form-control-ink" required></textarea>
        <p v-if="errors.content" class="text-danger small mt-1">{{ errors.content }}</p>
      </div>

      <div class="d-flex gap-3">
        <RouterLink :to="{ name: 'admin-articles' }" class="btn-outline-ink rounded-0">Back</RouterLink>
        <button class="btn-ink align-self-start" type="submit" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
