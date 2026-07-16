<script setup>
import { onMounted, ref, watch } from 'vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import { useAdminUsersStore } from '@/stores/adminUsers'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const usersStore = useAdminUsersStore()
const authStore = useAuthStore()
const toast = useToastStore()

const search = ref('')
const page = ref(1)
const perPage = 10
const includeDeleted = ref(false)
const pendingDelete = ref(null) // user object pending soft delete

function load() {
  usersStore.fetchAll({
    search: search.value || undefined,
    _page: page.value,
    _per_page: perPage,
    include_deleted: includeDeleted.value
  })
}

onMounted(load)
watch(search, () => { page.value = 1; load() })
watch(includeDeleted, () => { page.value = 1; load() })
watch(page, load)

async function confirmDelete() {
  const user = pendingDelete.value
  pendingDelete.value = null
  const res = await usersStore.softDelete(user.id)
  toast[res.success ? 'success' : 'error'](res.success ? `${user.name} deactivated` : res.message)
}

async function handleRestore(user) {
  const res = await usersStore.restore(user.id)
  toast[res.success ? 'success' : 'error'](res.success ? `${user.name} restored` : res.message)
}

async function toggleRole(user) {
  const nextRole = user.role === 'admin' ? 'user' : 'admin'
  const res = await usersStore.setRole(user.id, nextRole)
  toast[res.success ? 'success' : 'error'](res.success ? `${user.name} is now ${nextRole}` : res.message)
}

const totalPages = () => usersStore.pagination?.total_pages || 1
</script>

<template>
  <div>
    <section class="hairline px-3 px-md-4 pt-4 pb-5">
      <p class="eyebrow mb-3">Admin</p>
      <h1 class="hero-title">Users</h1>
    </section>

    <AdminTabs />

    <div class="px-3 px-md-4 py-4 hairline d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
      <div style="min-width: 260px;">
        <SearchBox v-model="search" placeholder="Search by name or email…" />
      </div>
      <label class="eyebrow d-flex align-items-center gap-2" style="cursor: pointer;">
        <input type="checkbox" v-model="includeDeleted" />
        Show deactivated
      </label>
    </div>

    <section class="px-3 px-md-4 py-5">
      <LoadingSpinner v-if="usersStore.isLoading" label="Loading users" />
      <p v-else-if="!usersStore.users.length" class="eyebrow py-5 text-center">No users found.</p>

      <table v-else class="table-ink w-100">
        <thead>
          <tr class="hairline">
            <th class="eyebrow text-start py-2">Name</th>
            <th class="eyebrow text-start py-2">Email</th>
            <th class="eyebrow text-start py-2">Role</th>
            <th class="eyebrow text-start py-2">Status</th>
            <th class="eyebrow text-end py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usersStore.users" :key="u.id" class="hairline">
            <td class="py-3">{{ u.name }}</td>
            <td class="py-3">{{ u.email }}</td>
            <td class="py-3">
              <span class="badge-tag" :class="{ 'is-accent': u.role === 'admin' }">{{ u.role }}</span>
            </td>
            <td class="py-3">
              <span class="eyebrow" :style="u.deleted_at ? 'color: var(--color-danger);' : ''">
                {{ u.deleted_at ? 'Deactivated' : 'Active' }}
              </span>
            </td>
            <td class="py-3 text-end">
              <button
                v-if="u.id !== authStore.user?.id"
                class="eyebrow btn btn-link p-0 me-3"
                @click="toggleRole(u)"
              >
                {{ u.role === 'admin' ? 'Demote' : 'Promote' }}
              </button>
              <button
                v-if="!u.deleted_at && u.id !== authStore.user?.id"
                class="eyebrow btn btn-link p-0 text-danger"
                @click="pendingDelete = u"
              >
                Deactivate
              </button>
              <button
                v-else-if="u.deleted_at"
                class="eyebrow btn btn-link p-0"
                @click="handleRestore(u)"
              >
                Restore
              </button>
              <span v-else class="eyebrow" style="opacity: 0.5;">You</span>
            </td>
          </tr>
        </tbody>
      </table>

      <AppPagination v-model:current-page="page" :total-pages="totalPages()" />
    </section>

    <ConfirmDeleteModal
      :show="!!pendingDelete"
      title="Deactivate this user?"
      :message="`${pendingDelete?.name || 'This user'} will be signed out and unable to log in until restored.`"
      button-text="Deactivate"
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
