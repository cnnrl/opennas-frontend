import { request } from './httpClient'
import { sanitizeBearerToken } from '../utils/security'

function extractAuthToken(payload) {
  if (typeof payload === 'string') {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const directCandidates = [
    payload.token,
    payload.jwt,
    payload.accessToken,
    payload.access_token,
    payload.bearer,
  ]

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate
    }
  }

  // Handle wrapped payloads like Spring ResponseEntity serialization.
  const nestedCandidates = [
    payload.body,
    payload.data,
    payload.result,
    payload.payload,
    payload.response,
  ]

  for (const candidate of nestedCandidates) {
    const extracted = extractAuthToken(candidate)
    if (extracted) {
      return extracted
    }
  }

  return ''
}

export async function authenticate(mode, credentials) {
  const data = await request(`/${mode}`, {
    method: 'POST',
    body: credentials,
  })

  const rawToken = extractAuthToken(data)
  const token = sanitizeBearerToken(rawToken)
  if (!token) {
    throw new Error('Token not found in auth response.')
  }

  return token
}
