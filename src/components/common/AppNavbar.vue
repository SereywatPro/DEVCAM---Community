<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import confirmedLogout from "./ConfirmDeleteModal.vue"

const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const menuOpen = ref(false)
const showLogoutConfirm = ref(false)

async function handleLogout() {
  await authStore.logout()
  showLogoutConfirm.value = false
  toast.success('Logged out')
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="hairline">
    <nav class="navbar navbar-expand-lg px-3 px-md-4 py-3">
      <div class="container-fluid px-0">
        <RouterLink class="navbar-brand fw-bold" to="/" style="font-family: var(--font-display); letter-spacing: 0.02em;">
          DEVCAM
        </RouterLink>
        <button class="navbar-toggler border-0" type="button" @click="menuOpen = !menuOpen" aria-label="Toggle navigation">
          <span class="eyebrow">MENU</span>
        </button>
        <div class="collapse navbar-collapse" :class="{ show: menuOpen }">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-4 mt-3 mt-lg-0">
            <li class="nav-item"><RouterLink class="nav-link eyebrow" to="/blog" @click="menuOpen=false">Blog</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link eyebrow" to="/about" @click="menuOpen=false">About</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link eyebrow" to="/contact" @click="menuOpen=false">Contact</RouterLink></li>

            <template v-if="!authStore.isAuthenticated">
              <li class="nav-item"><RouterLink class="nav-link eyebrow" to="/login" @click="menuOpen=false">Log in</RouterLink></li>
              <li class="nav-item">
                <RouterLink class="btn-ink d-inline-block" to="/register" @click="menuOpen=false">Join</RouterLink>
              </li>
            </template>
            <template v-else>
              <li class="nav-item"><RouterLink class="nav-link eyebrow" to="/dashboard" @click="menuOpen=false">Dashboard</RouterLink></li>
              <li class="nav-item" v-if="authStore.isAdmin"><RouterLink class="nav-link eyebrow" to="/admin" @click="menuOpen=false">Admin</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link eyebrow" to="/profile" @click="menuOpen=false">Profile</RouterLink></li>
              <li class="nav-item">
                <button class="btn-outline-ink" @click="showLogoutConfirm = true">Log out</button>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
    <confirmedLogout v-if="showLogoutConfirm" @confirm="handleLogout" 
    title="Are you sure?" message="You will be logged out of your account."
    buttonText="Logout"
     @cancel="showLogoutConfirm = false" :show="showLogoutConfirm" />
  </header>
</template>

<style scoped>
.nav-link { color: var(--color-ink); padding: 0.25rem 0; }
.nav-link.router-link-active { color: var(--color-accent); }
</style>
