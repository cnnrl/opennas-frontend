const USERNAME_REGEX = /^[A-Za-z0-9._-]+$/

function hasControlCharacters(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code <= 31 || code === 127) {
      return true
    }
  }

  return false
}

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

  if (hasControlCharacters(token)) {
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

  if (raw.length > 128 || hasControlCharacters(raw)) {
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

  if (!password || password.length > 256 || hasControlCharacters(password)) {
    throw new Error('Password is invalid.')
  }

  return { username, password }
}
