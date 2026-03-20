import { request } from './httpClient'
import { sanitizeBearerToken } from '../utils/security'

export async function authenticate(mode, credentials) {
  const data = await request(`/${mode}`, {
    method: 'POST',
    body: credentials,
  })

  const rawToken = typeof data === 'string' ? data : data.token || data.jwt || ''
  const token = sanitizeBearerToken(rawToken)
  if (!token) {
    throw new Error('Token not found in auth response.')
  }

  return token
}
