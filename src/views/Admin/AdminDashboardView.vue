<script setup>
import { onMounted, ref } from 'vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'
import { adminApi } from '@/api/admin'
import { categoryApi } from '@/api/category'

const authStore = useAuthStore()
const isLoading = ref(true)
const stats = ref({ users: 0, articles: 0, categories: 0 })
const recentUsers = ref([])
const recentArticles = ref([])

async function load() {
  isLoading.value = true
  try {
    const [usersRes, articlesRes, categoriesRes] = await Promise.all([
      adminApi.getUsers({ _per_page: 5, sortBy: 'created_at', sortDir: 'DESC' }),
      adminApi.getArticles({ _per_page: 5, sortBy: 'created_at', sortDir: 'DESC' }),
      categoryApi.getAll({ _per_page: 1 })
    ])
    stats.value = {
      users: usersRes.data?.pagination?.total_items ?? usersRes.data?.data?.length ?? 0,
      articles: articlesRes.data?.pagination?.total_items ?? articlesRes.data?.data?.length ?? 0,
      categories: categoriesRes.data?.pagination?.total_items ?? categoriesRes.data?.data?.length ?? 0
    }
    recentUsers.value = usersRes.data?.data || []
    recentArticles.value = articlesRes.data?.data || []
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false
  }
}
const base = import.meta.env.VITE_API_BASE_URL
const avatarUrl = ((u) => {
  // console.log(u);
  if (u?.avatar_url?.split("/")[3] === "default_image.jpg") return base + u.avatar_url;
  return base + "/" + u.avatar_url
})


onMounted(load);
</script>

<template>
  <div>
    <section class="hairline px-3 px-md-4 pt-4 pb-5">
      <p class="eyebrow mb-3">Signed in as {{ authStore.user?.name || authStore.user?.email }}</p>
      <h1 class="hero-title">Admin</h1>
    </section>

    <AdminTabs />

    <section class="px-3 px-md-4 py-5">
      <LoadingSpinner v-if="isLoading" label="Loading overview" />

      <template v-else>
        <div class="row g-4 mb-5">
          <div class="col-6 col-md-4">
            <div class="hairline pb-3">
              <p class="eyebrow mb-2">Users</p>
              <p class="fs-3 fw-semibold">{{ stats.users }}</p>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="hairline pb-3">
              <p class="eyebrow mb-2">Articles</p>
              <p class="fs-3 fw-semibold">{{ stats.articles }}</p>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="hairline pb-3">
              <p class="eyebrow mb-2">Categories</p>
              <p class="fs-3 fw-semibold">{{ stats.categories }}</p>
            </div>
          </div>
        </div>

        <div class="row g-5">
          <div class="col-12 col-md-6">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <p class="eyebrow mb-0">Newest users</p>
              <RouterLink :to="{ name: 'admin-users' }" class="eyebrow">View all</RouterLink>
            </div>
            <ul class="list-unstyled">
              <li v-for="u in recentUsers" :key="u.id" class="hairline-top py-2 d-flex justify-content-between">
                <img :src="avatarUrl(u)" alt="user-avatar" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;" />
                <span>{{ u.name }}</span>
                <span class="eyebrow">{{ u.role }}</span>
              </li>
              <li v-if="!recentUsers.length" class="hairline-top py-2 eyebrow">No users yet.</li>
            </ul>
          </div>

          <div class="col-12 col-md-6">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <p class="eyebrow mb-0">Newest articles</p>
              <RouterLink :to="{ name: 'admin-articles' }" class="eyebrow">View all</RouterLink>
            </div>
            <ul class="list-unstyled">
              <li v-for="a in recentArticles" :key="a.id" class="hairline-top py-2 d-flex justify-content-between">
                <span>{{ a.title }}</span>
                <span class="eyebrow">{{ a.creator_name || '—' }}</span>
              </li>
              <li v-if="!recentArticles.length" class="hairline-top py-2 eyebrow">No articles yet.</li>
            </ul>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.hero-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 0.95;
  font-family: var(--font-display);
  text-transform: uppercase;
}
</style>
