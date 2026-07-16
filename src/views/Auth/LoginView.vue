<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { isValidEmail } from '@/composables/useValidators'

const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const form = ref({ email: '', password: '' })
const errors = ref({})
const submitting = ref(false)
const showPassword = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.email) {
    errors.value.email = 'Email is required.'
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Enter a valid email address.'
  }
  if (!form.value.password) errors.value.password = 'Password is required.'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const res = await authStore.login(form.value)
  submitting.value = false
  if (res.success) {
    toast.success('Welcome back')
    const fallback = authStore.isAdmin ? { name: 'admin-dashboard' } : { name: 'dashboard' }
    router.push(route.query.redirect || fallback)
  } else {
    toast.error(res?.message || 'Login failed')
  }
}
</script>

<template>
  <div class="px-3 px-md-4 py-5 d-flex justify-content-center">
    <div style="max-width: 420px; width: 100%;">
      <p class="eyebrow mb-2">Welcome back</p>
      <h1 class="mb-4" style="font-size: 2.75rem;">Log in</h1>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3" novalidate>
        <div>
          <label class="eyebrow d-block mb-1" for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control-ink" autocomplete="email" />
          <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
        </div>
        <div>
          <label class="eyebrow d-block mb-1" for="password">Password</label>
          <div class="position-relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control-ink"
              autocomplete="current-password"
              style="padding-right: 3rem;"
            />
            <button
              type="button"
              class="btn-toggle-password text-uppercase"
              style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 0.25rem; font-size: 0.85rem; cursor: pointer;"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</p>
        </div>
        <button class="btn-ink mt-2" type="submit" :disabled="submitting">
          {{ submitting ? 'Logging in…' : 'Log in' }}
        </button>
      </form>

      <p class="eyebrow mt-4">
        No account?
        <RouterLink to="/register" class="text-decoration-underline">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>