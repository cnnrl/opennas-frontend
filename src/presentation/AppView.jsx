import { useMemo, useState } from 'react'
import FilesPanel from './components/FilesPanel'
import InlineFileViewerCard from './components/InlineFileViewerCard'
import MusicPanel from './components/MusicPanel'
import NowPlayingCard from './components/NowPlayingCard'
import StatusCard from './components/StatusCard'

function AppView({
  roles,
  busy,
  status,
  token,
  isAdmin,
  authMode,
  authForm,
  setAuthMode,
  updateAuth,
  handleAuth,
  logout,
  refreshEverything,
  files,
  music,
}) {
  const [activeService, setActiveService] = useState('files')
  const [authMenuOpen, setAuthMenuOpen] = useState(false)
  const hasToken = Boolean(token)

  const serviceTitle = useMemo(() => {
    return activeService === 'music' ? 'Music Service' : 'File Service'
  }, [activeService])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">OpenNAS</p>
            <h1 className="text-2xl font-semibold text-zinc-50">Service Console</h1>
            <div className="inline-flex rounded-xl border border-zinc-700 bg-zinc-950/80 p-1">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  activeService === 'files'
                    ? 'bg-emerald-500 font-medium text-zinc-950'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                onClick={() => setActiveService('files')}
                disabled={!hasToken}
              >
                Files
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  activeService === 'music'
                    ? 'bg-emerald-500 font-medium text-zinc-950'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                onClick={() => setActiveService('music')}
                disabled={!hasToken}
              >
                Music
              </button>
            </div>
          </div>
          <div className="relative flex items-start gap-3">
            <div className="text-right text-sm text-zinc-300">
              <p>Roles: {roles.length ? roles.join(', ') : 'none'}</p>
            </div>
            <div className="relative">
              <button
                type="button"
                className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800"
                onClick={() => setAuthMenuOpen((previous) => !previous)}
              >
                {hasToken ? 'Account' : 'Sign In'}
              </button>

              {authMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
                  {!hasToken ? (
                    <>
                      <div className="mb-3 inline-flex rounded-lg border border-zinc-700 bg-zinc-950/80 p-1">
                        <button
                          className={`rounded px-3 py-1 text-xs ${
                            authMode === 'login'
                              ? 'bg-emerald-500 text-zinc-950'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                          type="button"
                          onClick={() => setAuthMode('login')}
                        >
                          Login
                        </button>
                        <button
                          className={`rounded px-3 py-1 text-xs ${
                            authMode === 'register'
                              ? 'bg-emerald-500 text-zinc-950'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                          type="button"
                          onClick={() => setAuthMode('register')}
                        >
                          Register
                        </button>
                      </div>

                      <form className="space-y-2" onSubmit={handleAuth}>
                        <label className="block text-xs text-zinc-400">
                          Username
                          <input
                            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm"
                            value={authForm.username}
                            onChange={(event) => updateAuth('username', event.target.value)}
                            required
                          />
                        </label>

                        <label className="block text-xs text-zinc-400">
                          Password
                          <input
                            type="password"
                            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm"
                            value={authForm.password}
                            onChange={(event) => updateAuth('password', event.target.value)}
                            required
                          />
                        </label>

                        <button
                          className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
                          type="submit"
                          disabled={busy}
                        >
                          {authMode === 'login' ? 'Login' : 'Create Account'}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-400">Authenticated session active.</p>
                      <button
                        className="w-full rounded bg-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
                        type="button"
                        onClick={refreshEverything}
                        disabled={busy}
                      >
                        Refresh Services
                      </button>
                      <button
                        className="w-full rounded bg-red-600 px-3 py-2 text-sm text-red-50 disabled:opacity-50"
                        type="button"
                        onClick={() => {
                          logout()
                          setAuthMenuOpen(false)
                        }}
                        disabled={busy}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5">
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Active Service</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-50">
              {hasToken ? serviceTitle : 'Authentication Required'}
            </h2>
          </div>

          {!hasToken && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="text-lg font-semibold text-zinc-100">Please log in to access OpenNAS services.</p>
              <p className="mt-2 text-sm text-zinc-400">
                Open the account menu in the top-right corner to login or register.
              </p>
            </div>
          )}

          {hasToken && activeService === 'files' ? (
            <>
              <FilesPanel
                files={files.files}
                setFileUpload={files.setFileUpload}
                uploadGenericFile={files.uploadGenericFile}
                loadFiles={files.loadFiles}
                openFileInline={files.openFileInline}
                downloadFile={files.downloadFile}
                deleteFile={files.deleteFile}
                busy={busy}
                token={token}
                isAdmin={isAdmin}
              />

              <InlineFileViewerCard selectedFile={files.selectedFile} />
            </>
          ) : null}

          {hasToken && activeService === 'music' ? (
            <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
              <MusicPanel
                music={music.music}
                artUrls={music.artUrls}
                setSongUpload={music.setSongUpload}
                uploadSong={music.uploadSong}
                loadMusic={music.loadMusic}
                playSong={music.playSong}
                busy={busy}
                token={token}
                isAdmin={isAdmin}
              />

              <NowPlayingCard playerState={music.playerState} />
            </div>
          ) : null}

          <StatusCard status={status} />
        </section>
      </main>
    </div>
  )
}

export default AppView
