function AuthPanel({
  authMode,
  setAuthMode,
  authForm,
  updateAuth,
  handleAuth,
  busy,
  token,
  refreshEverything,
  logout,
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-semibold">Authentication</h2>

      <div className="flex gap-2">
        <button
          className={`rounded px-3 py-1 text-sm ${
            authMode === 'login' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-100'
          }`}
          type="button"
          onClick={() => setAuthMode('login')}
        >
          Login
        </button>
        <button
          className={`rounded px-3 py-1 text-sm ${
            authMode === 'register' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-100'
          }`}
          type="button"
          onClick={() => setAuthMode('register')}
        >
          Register
        </button>
      </div>

      <form className="space-y-3" onSubmit={handleAuth}>
        <label className="block text-sm text-zinc-300">
          Username
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
            value={authForm.username}
            onChange={(event) => updateAuth('username', event.target.value)}
            required
          />
        </label>

        <label className="block text-sm text-zinc-300">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
            value={authForm.password}
            onChange={(event) => updateAuth('password', event.target.value)}
            required
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
            type="submit"
            disabled={busy}
          >
            {authMode === 'login' ? 'Login' : 'Create Account'}
          </button>
          <button
            className="rounded bg-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
            type="button"
            onClick={logout}
            disabled={busy}
          >
            Logout
          </button>
        </div>
      </form>

      <button
        className="w-full rounded bg-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
        type="button"
        onClick={refreshEverything}
        disabled={busy || !token}
      >
        Refresh Services
      </button>
    </section>
  )
}

export default AuthPanel
