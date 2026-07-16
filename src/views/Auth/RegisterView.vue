<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { isValidEmail, isStrongPassword, sanitizeText } from '@/composables/useValidators'

const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const errors = ref({})
const submitting = ref(false);
const showPassword = ref(false);

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required.'
  if (!form.value.email) {
    errors.value.email = 'Email is required.'
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Enter a valid email address.'
  }
  if (!isStrongPassword(form.value.password)) {
    errors.value.password = 'Min 8 characters, with uppercase, lowercase, a number, and a special character (@$!%*?&).'
  }
  if (form.value.confirmPassword !== form.value.password) {
    errors.value.confirmPassword = 'Passwords do not match.'
  }
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const res = await authStore.register({
    name: sanitizeText(form.value.name),
    email: form.value.email.trim().toLowerCase(),
    password: form.value.password,
    confirmPassword: form.value.confirmPassword
  })
  submitting.value = false
  if (res.success) {
    toast.success('Account created — please log in')
    router.push({ name: 'login' })
  } else {
    toast.error(res.message || 'Registration failed')
  }
}
</script>

<template>
  <div class="px-3 px-md-4 py-5 d-flex justify-content-center">
    <div style="max-width: 420px; width: 100%;">
      <p class="eyebrow mb-2">Join the community</p>
      <h1 class="mb-4" style="font-size: 2.75rem;">Register</h1>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3" novalidate>
        <div>
          <label class="eyebrow d-block mb-1" for="name">Name</label>
          <input id="name" v-model="form.name" type="text" class="form-control-ink" autocomplete="name" />
          <p v-if="errors.name" class="text-danger small mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="eyebrow d-block mb-1" for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control-ink" autocomplete="email" />
          <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
        </div>
        <div class="position-relative">
          <label class="eyebrow d-block mb-1" for="password">Password</label>
          <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-control-ink" autocomplete="new-password" />
          <p class="eyebrow mt-1" style="font-size: 0.65rem;">8+ chars, upper &amp; lowercase, number, special character</p>
          <p v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</p>
          <button @click="showPassword = !showPassword" type="button" class="position-absolute toggle" >
            {{ showPassword ? 'Hide' : 'Show' }}</button>
        </div>
        <div class="position-relative">
          <label class="eyebrow d-block mb-1" for="confirm">Confirm password</label>
          <input id="confirm" v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" class="form-control-ink" autocomplete="new-password" />
          <p v-if="errors.confirmPassword" class="text-danger small mt-1">{{ errors.confirmPassword }}</p>
        </div>
        <button class="btn-ink mt-2" type="submit" :disabled="submitting">
          {{ submitting ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="eyebrow mt-4">
        Already registered?
        <RouterLink to="/login" class="text-decoration-underline">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.toggle{
  top: 49%;
  right: 0.75rem; 
  transform: translateY(-100%);
  border: none;
  font-size:1rem;
  color: var(--ink-500);
  background-color: transparent;
}
.toggle-2{
  top: 60%;
  right: 0.75rem; 
  transform: translateY(-40%);
  border: none;
  font-size:1rem;
  color: var(--ink-500);
  background-color: transparent;
}
</style>