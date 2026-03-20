const CONTROL_CHARACTERS_REGEX = /[\u0000-\u001F\u007F]/
const USERNAME_REGEX = /^[A-Za-z0-9._-]+$/

export function normalizeToken(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

export function sanitizeBearerToken(value) {
  const token = normalizeToken(value)
  if (!token) {
    return ''
  }

  if (CONTROL_CHARACTERS_REGEX.test(token)) {
    throw new Error('Token contains invalid control characters.')
  }

  if (token.length > 4096) {
    throw new Error('Token is too long.')
  }

  return token
}

export function sanitizeIdSegment(value, name = 'id') {
  const raw = String(value ?? '').trim()

  if (!raw) {
    throw new Error(`Missing ${name}.`)
  }

  if (raw.length > 128 || CONTROL_CHARACTERS_REGEX.test(raw)) {
    throw new Error(`Invalid ${name}.`)
  }

  return encodeURIComponent(raw)
}

export function validateAuthRequest(mode, authForm) {
  if (mode !== 'login' && mode !== 'register') {
    throw new Error('Unsupported authentication mode.')
  }

  const username = String(authForm?.username ?? '').trim()
  const password = String(authForm?.password ?? '')

  if (username.length < 3 || username.length > 64 || !USERNAME_REGEX.test(username)) {
    throw new Error('Username must be 3-64 chars and use only letters, numbers, ., _, or -.')
  }

  if (!password || password.length > 256 || CONTROL_CHARACTERS_REGEX.test(password)) {
    throw new Error('Password is invalid.')
  }

  return { username, password }
}
