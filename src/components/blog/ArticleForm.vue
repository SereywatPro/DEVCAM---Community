<script setup>
import { ref, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { sanitizeText, validateImageFile } from '@/composables/useValidators'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ title: '', category_id: '', content: '', thumbnail_path: '' })
  },
  submitLabel: { type: String, default: 'Publish article' },
  submitting: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])

const categoryStore = useCategoryStore()
const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131'
const form = ref({ ...props.modelValue })
const thumbnailFile = ref(null)
const thumbnailPreview = ref(props.modelValue.thumbnail_path ? `${base}/${props.modelValue.thumbnail_path}` : '')
const errors = ref({})

onMounted(() => categoryStore.fetchAll())

watch(() => props.modelValue, (val) => {
  form.value = { ...val }
  thumbnailPreview.value = val.thumbnail_path ? `${base}/${val.thumbnail_path}` : ''
})

function validate() {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required.'
  else if (form.value.title.trim().length < 4) errors.value.title = 'Title must be at least 4 characters.'
  else if (form.value.title.trim().length > 140) errors.value.title = 'Title must be under 140 characters.'
  if (!form.value.category_id) errors.value.category_id = 'Choose a category.'
  if (!form.value.content.trim()) errors.value.content = 'Content is required.'
  else if (form.value.content.trim().length < 10) errors.value.content = 'Content must be at least 10 characters.'
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

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    title: sanitizeText(form.value.title),
    content: form.value.content.trim(),
    category_id: Number(form.value.category_id),
    thumbnailFile: thumbnailFile.value
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-4" style="max-width: 720px;">
    <div>
      <label class="eyebrow d-block mb-1" for="title">Title</label>
      <input id="title" v-model="form.title" type="text" class="form-control-ink" maxlength="140" required />
      <p v-if="errors.title" class="text-danger small mt-1">{{ errors.title }}</p>
    </div>

    <div>
      <label class="eyebrow d-block mb-1" for="category">Category</label>
      <select id="category" v-model="form.category_id" class="form-control-ink" required>
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <p v-if="!categoryStore.categories.length" class="eyebrow mt-1" style="font-size: 0.65rem;">
        No categories yet — create one first.
      </p>
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
      <RouterLink to="/dashboard" class="btn-outline-ink rounded-0" type="button" >
          Back
      </RouterLink>
      <button class="btn-ink align-self-start" type="submit" :disabled="submitting">
        {{ submitting ? 'Saving…' : submitLabel }}
      </button>
    </div>
  </form>
</template>
