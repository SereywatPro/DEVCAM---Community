const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mirrors validators/user.js on the backend exactly (Joi pattern), so the
// frontend rejects bad passwords before hitting the API at all:
// min 8 chars, at least one uppercase, one lowercase, one number, one special char.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim())
}

export function isStrongPassword(value) {
  return PASSWORD_RE.test(String(value || ''))
}

export function sanitizeText(value) {
  return String(value || '').replace(/<[^>]*>/g, '').trim()
}

// Matches backend multer fileFilter (configs multerMiddleware.js): jpeg/jpg/png/webp, 2MB max.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return 'No file selected.'
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Only JPEG, PNG, or WEBP images are allowed.'
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 2MB or smaller.'
  return null
}
