import { API_BASE } from '../config/constants'
import { request } from './httpClient'
import { sanitizeBearerToken, sanitizeIdSegment } from '../utils/security'

function normalizePossibleToken(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  // Some backends return JSON-stringified token values (e.g. "abc") as plain text.
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

function extractStreamToken(payload, forbiddenToken = '') {
  if (typeof payload === 'string') {
    const normalized = normalizePossibleToken(payload)
    return normalized && normalized !== forbiddenToken ? normalized : ''
  }

  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const directCandidates = [payload.token, payload.streamToken, payload.stream_token]

  for (const candidate of directCandidates) {
    const normalized = normalizePossibleToken(candidate)
    if (normalized && normalized !== forbiddenToken) {
      return normalized
    }
  }

  const nestedCandidates = [payload.data, payload.result, payload.payload]
  for (const candidate of nestedCandidates) {
    const extracted = extractStreamToken(candidate, forbiddenToken)
    if (extracted) {
      return extracted
    }
  }

  return ''
}

export async function fetchMusic(token) {
  const data = await request('/music', { token })
  return Array.isArray(data) ? data : []
}

export async function uploadMusic(token, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request('/music/upload', {
    token,
    method: 'POST',
    body: formData,
    isFormData: true,
  })
}

export async function fetchAlbumArt(token, songId) {
  const safeSongId = sanitizeIdSegment(songId, 'song id')
  const normalizedToken = sanitizeBearerToken(token)
  const response = await fetch(`${API_BASE}/music/art/${safeSongId}`, {
    method: 'GET',
    headers: normalizedToken
      ? {
          Authorization: `Bearer ${normalizedToken}`,
        }
      : {},
    credentials: 'omit',
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

  return response.blob()
}

export async function fetchStreamToken(token, songId) {
  const safeSongId = sanitizeIdSegment(songId, 'song id')
  const payload = await request(`/stream/token/${safeSongId}`, { token })
  const normalizedAuthToken = normalizePossibleToken(token)
  const streamToken = extractStreamToken(payload, normalizedAuthToken)

  if (!streamToken) {
    throw new Error('Missing stream token from /stream/token response.')
  }

  return streamToken
}

export function buildSongStreamUrl(songId, streamToken) {
  const safeSongId = sanitizeIdSegment(songId, 'song id')
  const safeStreamToken = encodeURIComponent(sanitizeBearerToken(streamToken))
  return `${API_BASE}/stream/${safeSongId}?token=${safeStreamToken}`
}

export async function fetchSongStream(token, songId, streamToken) {
  const normalizedToken = sanitizeBearerToken(token)
  const response = await fetch(buildSongStreamUrl(songId, streamToken), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${normalizedToken}`,
      Range: 'bytes=0-',
    },
    credentials: 'omit',
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

  return response.blob()
}
