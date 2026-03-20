import { request } from './httpClient'
import { sanitizeIdSegment } from '../utils/security'

export async function fetchFiles(token) {
  const data = await request('/files', { token })
  return Array.isArray(data) ? data : []
}

export async function uploadFile(token, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request('/upload', {
    token,
    method: 'POST',
    body: formData,
    isFormData: true,
  })
}

export async function fetchInlineFile(token, id) {
  const safeId = sanitizeIdSegment(id, 'file id')
  return request(`/files/${safeId}`, { token })
}

export async function fetchDownloadFile(token, id) {
  const safeId = sanitizeIdSegment(id, 'file id')
  return request(`/download/${safeId}`, { token })
}

export async function removeFile(token, id) {
  const safeId = sanitizeIdSegment(id, 'file id')
  return request(`/delete/${safeId}`, {
    token,
    method: 'DELETE',
  })
}
