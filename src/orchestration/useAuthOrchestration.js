import { useMemo, useState } from 'react'
import { authenticate } from '../api/authApi'
import { sanitizeBearerToken, validateAuthRequest } from '../utils/security'
import { extractRoles, parseJwt } from '../utils/jwt'

export function useAuthOrchestration({ setBusy, setStatus }) {
  // Keep JWT in memory only to reduce XSS token persistence risk.
  const [token, setTokenState] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', password: '' })

  const claims = useMemo(() => parseJwt(token), [token])
  const roles = useMemo(() => extractRoles(claims), [claims])
  const isAdmin = useMemo(() => roles.includes('ADMIN') || roles.includes('ROLE_ADMIN'), [roles])

  const setToken = (value) => {
    const nextToken = sanitizeBearerToken(value)
    setTokenState(nextToken)
  }

  const updateAuth = (field, value) => {
    setAuthForm((previous) => ({ ...previous, [field]: value }))
  }

  const handleAuth = async (event) => {
    event.preventDefault()
    setBusy(true)
    setStatus(`Submitting ${authMode} request...`)

    try {
      const credentials = validateAuthRequest(authMode, authForm)
      const nextToken = await authenticate(authMode, credentials)
      setToken(nextToken)
      setAuthForm((previous) => ({ ...previous, password: '' }))
      setStatus(`${authMode} successful.`)
    } catch (error) {
      setStatus(`Auth failed: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  return {
    token,
    setToken,
    authMode,
    setAuthMode,
    authForm,
    updateAuth,
    handleAuth,
    roles,
    isAdmin,
  }
}
