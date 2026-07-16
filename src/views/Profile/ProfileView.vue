<script setup>
import { onMounted, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { validateImageFile } from '@/composables/useValidators'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const toast = useToastStore()
const fileInput = ref(null)

onMounted(() => profileStore.fetchProfile())

async function onAvatarChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const fileError = validateImageFile(file)
  if (fileError) {
    toast.error(fileError)
    e.target.value = ''
    return
  }
  const res = await profileStore.uploadAvatar(file)
  toast[res.success ? 'success' : 'error'](res.success ? 'Avatar updated' : res.message)
  profileStore.fetchProfile();
}

async function removeAvatar() {
  const res = await profileStore.deleteAvatar()
  toast[res.success ? 'success' : 'error'](res.success ? 'Avatar removed' : res.message)
  profileStore.fetchProfile();
}

function avatarSrc() {
  const url = profileStore.profile?.avatar_url;
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3131';
  
  if (url.split("/")[3] === "default_avatar.jpg") return base + url;

  return base +"/" + url
}

</script>

<template>
  <div class="px-3 px-md-4 py-5">
    <p class="eyebrow mb-2">Your account</p>
    <h1 class="mb-5" style="font-size: 2.75rem;">Profile</h1>

    <LoadingSpinner v-if="profileStore.isLoading && !profileStore.profile" label="Loading profile" />

    <div v-else class="row g-5">
      <div class="col-12 col-md-4 text-center">
        <div class="avatar-wrap mx-auto mb-3">
          <img
            v-if="avatarSrc()"
            :src="avatarSrc()"
            alt="Avatar"
            class="avatar-img"
          />
          <span v-else class="eyebrow">No avatar</span>
        </div>
        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" class="d-none" @change="onAvatarChange" />
        <div class="d-flex flex-column gap-2">
          <button class="btn-outline-ink" @click="fileInput.click()">Upload avatar</button>
          <button v-if="profileStore.profile?.avatar_url" class="btn-outline-ink" @click="removeAvatar">Remove avatar</button>
        </div>
      </div>

      <div class="col-12 col-md-8">
        <dl class="row hairline pb-3 mb-3">
          <dt class="col-4 eyebrow">Name</dt>
          <dd class="col-8">{{ profileStore.profile?.name || '—' }}</dd>
        </dl>
        <dl class="row hairline pb-3 mb-3">
          <dt class="col-4 eyebrow">Email</dt>
          <dd class="col-8">{{ profileStore.profile?.email || '—' }}</dd>
        </dl>
        <dl class="row hairline pb-3 mb-3">
          <dt class="col-4 eyebrow">Phone</dt>
          <dd class="col-8">{{ profileStore.profile?.phone || '—' }}</dd>
        </dl>
        <dl class="row hairline pb-3 mb-3">
          <dt class="col-4 eyebrow">Address</dt>
          <dd class="col-8">{{ profileStore.profile?.address || '—' }}</dd>
        </dl>
        <dl class="row pb-3 mb-3">
          <dt class="col-4 eyebrow">Bio</dt>
          <dd class="col-8">{{ profileStore.profile?.bio || 'No bio yet.' }}</dd>
        </dl>
        <div class="d-flex gap-3">
          <RouterLink :to="authStore.isAdmin ? { name: 'admin-dashboard' } : { name: 'dashboard' }" class="btn-outline-ink d-inline-block">Back</RouterLink>
          <RouterLink to="/settings" class="btn-ink d-inline-block">Edit profile</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-wrap {
  width: 140px; height: 140px;
  border: 1px solid var(--color-ink);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
</style>
