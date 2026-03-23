import { useEffect, useRef } from 'react'

function NowPlayingCard({ playerState }) {
  const audioRef = useRef(null)
  const sourceUrl = playerState.streamUrl || playerState.objectUrl || ''
  const coverSrc = playerState.artUrl || ''

  useEffect(() => {
    if (!sourceUrl || !audioRef.current) {
      return
    }

    const playPromise = audioRef.current.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Ignore autoplay rejections; user can still press play on controls.
      })
    }
  }, [sourceUrl])

  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-800/80 to-zinc-900 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">Now Playing</p>
      <h2 className="mt-2 text-xl font-semibold text-zinc-50">
        {playerState.id ? playerState.label : 'No song selected'}
      </h2>
      <p className="mt-1 text-sm text-zinc-400">{playerState.id ? `Track ID: ${playerState.id}` : 'Select any song from the library to start playback.'}</p>

      <div className="mt-4 rounded-xl border border-zinc-700/70 bg-zinc-900/60 p-4">
        <img
          className="aspect-square w-full rounded-xl border border-zinc-700/60 bg-zinc-900 object-cover"
          src={coverSrc}
          alt={playerState.id ? `${playerState.label} cover` : 'No cover art'}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.opacity = '0.28'
          }}
        />
      </div>

      {sourceUrl ? (
        <audio ref={audioRef} className="mt-4 w-full" controls preload="metadata" src={sourceUrl} />
      ) : (
        <p className="mt-4 text-xs text-zinc-500">Select a song to fetch stream token and load audio.</p>
      )}
    </div>
  )
}

export default NowPlayingCard
