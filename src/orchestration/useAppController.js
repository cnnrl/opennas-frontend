import { useAuthOrchestration } from './useAuthOrchestration'
import { useFilesOrchestration } from './useFilesOrchestration'
import { useMusicOrchestration } from './useMusicOrchestration'
import { useState } from 'react'

export function useAppController() {
  const [status, setStatus] = useState('Ready')
  const [busy, setBusy] = useState(false)

  const auth = useAuthOrchestration({ setBusy, setStatus })
  const files = useFilesOrchestration({ token: auth.token, setBusy, setStatus })
  const music = useMusicOrchestration({ token: auth.token, setBusy, setStatus })

  const refreshEverything = async () => {
    await Promise.all([files.loadFiles(), music.loadMusic()])
  }

  const logout = () => {
    files.resetFilesState()
    music.resetMusicState()
    auth.setToken('')
    setStatus('Logged out.')
  }

  return {
    busy,
    status,
    token: auth.token,
    roles: auth.roles,
    isAdmin: auth.isAdmin,
    authMode: auth.authMode,
    authForm: auth.authForm,
    setAuthMode: auth.setAuthMode,
    updateAuth: auth.updateAuth,
    handleAuth: auth.handleAuth,
    logout,
    refreshEverything,
    files,
    music,
  }
}
