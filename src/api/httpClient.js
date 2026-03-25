import { API_BASE } from '../config/constants'
import { sanitizeBearerToken } from '../utils/security'

export async function request(path, { token, method = 'GET', body, isFormData = false } = {}) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    throw new Error('Request path must start with "/".')
  }

  const headers = {}
  const normalizedToken = sanitizeBearerToken(token)

  if (normalizedToken) {
    headers.Authorization = `Bearer ${normalizedToken}`
  }

  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  if (!response.ok) {
    let details = ''
    try {
      details = await response.text()
    } catch {
      details = ''
    }

    throw new Error(`HTTP ${response.status}${details ? `: ${details}` : ''}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  if (contentType.includes('text/')) {
    return response.text()
  }

  return response.blob()
}
