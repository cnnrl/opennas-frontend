function MusicPanel({
  music,
  artUrls,
  setSongUpload,
  uploadSong,
  loadMusic,
  playSong,
  busy,
  token,
  isAdmin,
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-800/70 to-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">Library</p>
          <h2 className="mt-1 text-lg font-semibold">Music Service</h2>
        </div>
        <button
          className="rounded-full bg-zinc-900 px-3 py-1 text-sm disabled:opacity-50"
          type="button"
          onClick={loadMusic}
          disabled={busy || !token}
        >
          Reload
        </button>
      </div>

      {isAdmin && (
        <form className="mb-4 space-y-2 rounded-xl border border-zinc-700/70 bg-zinc-900/70 p-3" onSubmit={uploadSong}>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Admin Upload</p>
          <input
            className="block w-full text-sm"
            type="file"
            accept="audio/*"
            onChange={(event) => setSongUpload(event.target.files?.[0] || null)}
          />
          <button
            className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
            type="submit"
            disabled={busy || !token}
          >
            Upload Song (Admin)
          </button>
        </form>
      )}

      <div className="max-h-[56vh] space-y-2 overflow-auto pr-1">
        {music.length === 0 && <p className="text-sm text-zinc-500">No songs loaded.</p>}
        {music.map((song, index) => {
          const id = song.id ?? song.musicId ?? song.songId ?? index
          const title = song.title || song.name || `Song ${id}`
          const artist = song.artist || song.author || 'Unknown artist'

          return (
            <div
              key={`${id}-${index}`}
              className="group flex items-center gap-3 rounded-xl border border-zinc-700/60 bg-zinc-900/70 p-3 transition hover:border-zinc-500 hover:bg-zinc-800/80"
            >
              <img
                className="h-14 w-14 rounded-md object-cover"
                src={artUrls[id] || ''}
                alt={`${title} cover`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.opacity = '0.35'
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{title}</p>
                <p className="truncate text-xs text-zinc-400">{artist}</p>
                <p className="text-[11px] text-zinc-500">id: {id}</p>
              </div>
              <button
                className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-zinc-950 opacity-90 transition group-hover:opacity-100"
                type="button"
                onClick={() => playSong(song)}
              >
                Play
              </button>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default MusicPanel
