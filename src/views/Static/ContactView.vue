<script setup>
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import { isValidEmail } from '@/composables/useValidators'

const toast = useToastStore()
const form = ref({ name: '', email: '', message: '' })
const errors = ref({})

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required.'
  if (!isValidEmail(form.value.email)) errors.value.email = 'Enter a valid email address.'
  if (!form.value.message.trim()) errors.value.message = 'Message cannot be empty.'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  toast.success('Message sent — we will get back to you soon')
  form.value = { name: '', email: '', message: '' }
}
</script>

<template>
  <div class="px-3 px-md-4 py-5">
    <p class="eyebrow mb-2">Get in touch</p>
    <h1 class="mb-5" style="font-size: clamp(2.5rem, 7vw, 5rem);">Contact</h1>

    <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3" style="max-width: 480px;">
      <div>
        <label class="eyebrow d-block mb-1" for="name">Name</label>
        <input id="name" v-model="form.name" type="text" class="form-control-ink" required />
        <p v-if="errors.name" class="text-danger small mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="eyebrow d-block mb-1" for="email">Email</label>
        <input id="email" v-model="form.email" type="email" class="form-control-ink" required />
        <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
      </div>
      <div>
        <label class="eyebrow d-block mb-1" for="message">Message</label>
        <textarea id="message" v-model="form.message" rows="5" class="form-control-ink" required></textarea>
        <p v-if="errors.message" class="text-danger small mt-1">{{ errors.message }}</p>
      </div>
      <button class="btn-ink align-self-start" type="submit">Send message</button>
    </form>
  </div>
</template>
