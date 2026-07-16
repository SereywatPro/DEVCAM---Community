import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/HomeView.vue'),
    meta: { public: true }
  },
  {
    path: '/blog',
    name: 'blog-list',
    component: () => import('@/views/Articles/BlogListView.vue'),
    meta: { public: true }
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: () => import('@/views/Articles/BlogDetailView.vue'),
    meta: { public: true },
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { public: true, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth/RegisterView.vue'),
    meta: { public: true, guestOnly: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/Static/AboutView.vue'),
    meta: { public: true }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/Static/ContactView.vue'),
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/articles/create',
    name: 'article-create',
    component: () => import('@/views/Articles/CreateArticleView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/articles/:id/edit',
    name: 'article-edit',
    component: () => import('@/views/Articles/EditArticleView.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/my-articles',
    name: 'my-articles',
    component: () => import('@/views/Articles/MyArticlesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Profile/SettingsView.vue'),
    meta: { requiresAuth: true }
  },

  // ---- Admin: same login route/page as everyone else — access is gated
  // entirely by the route guard below checking authStore.isAdmin. ----
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/Admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/Admin/AdminUsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/articles',
    name: 'admin-articles',
    component: () => import('@/views/Admin/AdminArticlesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/articles/:id/edit',
    name: 'admin-article-edit',
    component: () => import('@/views/Admin/AdminArticleEditView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true
  },
  {
    path: '/admin/categories',
    name: 'admin-categories',
    component: () => import('@/views/Admin/AdminCategoriesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/Static/NotFoundView.vue'),
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Fetch the current user once, on first navigation, so guards below are accurate.
  if (!authStore.isBootstrapped) {
    await authStore.fetchMe()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Admin routes: logged in but not an admin gets bounced to the regular
  // dashboard rather than a dead end — same login route, restricted by role.
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'dashboard' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: authStore.isAdmin ? 'admin-dashboard' : 'dashboard' }
  }

  return true
})

export default router
