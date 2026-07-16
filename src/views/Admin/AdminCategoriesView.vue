<script setup>
import { onMounted, ref } from 'vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import { useCategoryStore } from '@/stores/category'
import { useToastStore } from '@/stores/toast'
import { sanitizeText } from '@/composables/useValidators'

const categoryStore = useCategoryStore()
const toast = useToastStore()

const newName = ref('')
const creating = ref(false)
const editingId = ref(null)
const editingName = ref('')
const savingEdit = ref(false)
const pendingDelete = ref(null)

onMounted(() => categoryStore.fetchAll())

async function handleCreate() {
  const name = sanitizeText(newName.value)
  if (!name) {
    toast.error('Category name is required.')
    return
  }
  creating.value = true
  const res = await categoryStore.create({ name })
  creating.value = false
  if (res.success) {
    newName.value = ''
    toast.success('Category created')
  } else {
    toast.error(res.message || 'Could not create category')
  }
}

function startEdit(cat) {
  editingId.value = cat.id
  editingName.value = cat.name
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}

async function saveEdit(cat) {
  const name = sanitizeText(editingName.value)
  if (!name) {
    toast.error('Category name is required.')
    return
  }
  savingEdit.value = true
  const res = await categoryStore.update(cat.id, { name })
  savingEdit.value = false
  if (res.success) {
    toast.success('Category updated')
    cancelEdit()
  } else {
    toast.error(res.message || 'Could not update category')
  }
}

async function confirmDelete() {
  const cat = pendingDelete.value
  pendingDelete.value = null
  const res = await categoryStore.remove(cat.id)
  toast[res.success ? 'success' : 'error'](res.success ? 'Category deleted' : res.message)
}
</script>

<template>
  <div>
    <section class="hairline px-3 px-md-4 pt-4 pb-5">
      <p class="eyebrow mb-3">Admin</p>
      <h1 class="hero-title">Categories</h1>
    </section>

    <AdminTabs />

    <section class="px-3 px-md-4 py-5">
      <form @submit.prevent="handleCreate" class="d-flex gap-3 mb-5" style="max-width: 480px;">
        <input v-model="newName" type="text" class="form-control-ink" placeholder="New category name" maxlength="80" />
        <button class="btn-ink" type="submit" :disabled="creating">{{ creating ? 'Adding…' : 'Add' }}</button>
      </form>

      <LoadingSpinner v-if="categoryStore.isLoading" label="Loading categories" />
      <p v-else-if="!categoryStore.categories.length" class="eyebrow py-5 text-center">No categories yet.</p>

      <table v-else class="table-ink w-100">
        <thead>
          <tr class="hairline">
            <th class="eyebrow text-start py-2">Name</th>
            <th class="eyebrow text-end py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categoryStore.categories" :key="cat.id" class="hairline">
            <td class="py-3">
              <input
                v-if="editingId === cat.id"
                v-model="editingName"
                type="text"
                class="form-control-ink"
                style="max-width: 320px;"
                maxlength="80"
              />
              <span v-else>{{ cat.name }}</span>
            </td>
            <td class="py-3 text-end">
              <template v-if="editingId === cat.id">
                <button class="eyebrow btn btn-link p-0 me-3" :disabled="savingEdit" @click="saveEdit(cat)">
                  {{ savingEdit ? 'Saving…' : 'Save' }}
                </button>
                <button class="eyebrow btn btn-link p-0" @click="cancelEdit">Cancel</button>
              </template>
              <template v-else>
                <button class="eyebrow btn btn-link p-0 me-3" @click="startEdit(cat)">Edit</button>
                <button class="eyebrow btn btn-link p-0 text-danger" @click="pendingDelete = cat">Delete</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <ConfirmDeleteModal
      :show="!!pendingDelete"
      title="Delete this category?"
      :message="`'${pendingDelete?.name}' will be removed. Articles using it will keep their content but lose this category.`"
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
