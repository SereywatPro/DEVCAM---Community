<script setup>
import { onMounted, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useToastStore } from '@/stores/toast'
import { isValidEmail, sanitizeText } from '@/composables/useValidators'

const profileStore = useProfileStore()
const toast = useToastStore()
const form = ref({ name: '', email: '', bio: '', phone: '', address: '' })
const errors = ref({})
const submitting = ref(false)

onMounted(async () => {
  await profileStore.fetchProfile()
  if (profileStore.profile) {
    form.value.name = profileStore.profile.name || ''
    form.value.email = profileStore.profile.email || ''
    form.value.bio = profileStore.profile.bio || ''
    form.value.phone = profileStore.profile.phone || ''
    form.value.address = profileStore.profile.address || ''
  }
})

function validate() {
  errors.value = {}
  // The backend requires ALL of these fields to be present on update.
  if (!form.value.name.trim()) errors.value.name = 'Name is required.'
  if (!isValidEmail(form.value.email)) errors.value.email = 'Enter a valid email address.'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const res = await profileStore.updateProfile({
    name: sanitizeText(form.value.name),
    email: form.value.email.trim().toLowerCase(),
    bio: sanitizeText(form.value.bio),
    phone: sanitizeText(form.value.phone),
    address: sanitizeText(form.value.address)
  })
  submitting.value = false
  toast[res.success ? 'success' : 'error'](res.success ? 'Profile updated' : res.message)
}
</script>

<template>
  <div class="px-3 px-md-4 py-5 mx-auto" style="max-width: 480px;">
    <p class="eyebrow mb-2">Account settings</p>
    <h1 class="mb-5" style="font-size: 2.75rem;">Settings</h1>

    <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3" style="max-width: 480px;">
      <div>
        <label class="eyebrow d-block mb-1" for="name">Name</label>
        <input id="name" v-model="form.name" type="text" class="form-control-ink" />
        <p v-if="errors.name" class="text-danger small mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="eyebrow d-block mb-1" for="email">Email</label>
        <input id="email" v-model="form.email" type="email" class="form-control-ink" />
        <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
      </div>
      <div>
        <label class="eyebrow d-block mb-1" for="phone">Phone</label>
        <input id="phone" v-model="form.phone" type="tel" class="form-control-ink" />
      </div>
      <div>
        <label class="eyebrow d-block mb-1" for="address">Address</label>
        <input id="address" v-model="form.address" type="text" class="form-control-ink" />
      </div>
      <div>
        <label class="eyebrow d-block mb-1" for="bio">Bio</label>
        <textarea id="bio" v-model="form.bio" rows="4" class="form-control-ink"></textarea>
      </div>
      <div class="d-flex gap-3">
        <RouterLink to="/profile" class="btn-outline-ink d-inline-block">Back to profile</RouterLink>
        <button class="btn-ink d-inline-block" type="submit" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
