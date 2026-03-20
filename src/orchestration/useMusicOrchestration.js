import { useEffect, useState } from 'react'
import {
  fetchAlbumArt,
  fetchMusic,
  fetchSongStream,
  fetchStreamToken,
  uploadMusic,
} from '../api/musicApi'
import { revokeObjectUrl, revokeObjectUrlMap } from '../utils/objectUrl'

export function useMusicOrchestration({ token, setBusy, setStatus }) {
  const [music, setMusic] = useState([])
  const [songUpload, setSongUpload] = useState(null)
  const [playerState, setPlayerState] = useState({
    id: null,
    label: '',
    streamToken: '',
    objectUrl: '',
  })
  const [artUrls, setArtUrls] = useState({})

  useEffect(() => {
    return () => {
      revokeObjectUrl(playerState.objectUrl)
    }
  }, [playerState.objectUrl])

  useEffect(() => {
    let cancelled = false

    const fetchArt = async () => {
      if (!token || music.length === 0) {
        return
      }

      const nextArtUrls = {}
      await Promise.all(
        music.map(async (song) => {
          const songId = song.id ?? song.musicId ?? song.songId
          if (!songId) {
            return
          }

          try {
            const blob = await fetchAlbumArt(token, songId)
            nextArtUrls[songId] = URL.createObjectURL(blob)
          } catch {
            nextArtUrls[songId] = ''
          }
        }),
      )

      if (!cancelled) {
        setArtUrls((previous) => {
          revokeObjectUrlMap(previous)
          return nextArtUrls
        })
      } else {
        revokeObjectUrlMap(nextArtUrls)
      }
    }

    fetchArt()

    return () => {
      cancelled = true
    }
  }, [music, token])

  const loadMusic = async () => {
    setBusy(true)
    setStatus('Loading music...')
    try {
      const data = await fetchMusic(token)
      setMusic(data)
      setStatus('Music loaded.')
    } catch (error) {
      setStatus(`Failed to load music: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const uploadSong = async (event) => {
    event.preventDefault()
    if (!songUpload) {
      setStatus('Pick a song before upload.')
      return
    }

    setBusy(true)
    setStatus('Uploading song...')

    try {
      await uploadMusic(token, songUpload)
      setSongUpload(null)
      setStatus('Song uploaded.')
      await loadMusic()
    } catch (error) {
      setStatus(`Song upload failed: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const playSong = async (song) => {
    const songId = song?.id ?? song?.musicId ?? song?.songId
    if (!songId) {
      setStatus('Cannot play song: missing id in payload.')
      return
    }

    setBusy(true)
    setStatus(`Getting stream token for song ${songId}...`)

    try {
      const streamToken = await fetchStreamToken(token, songId)
      const streamBlob = await fetchSongStream(token, songId, streamToken)
      const objectUrl = URL.createObjectURL(streamBlob)

      revokeObjectUrl(playerState.objectUrl)

      setPlayerState({
        id: songId,
        label: song.title || song.name || `Song ${songId}`,
        streamToken,
        objectUrl,
      })
      setStatus(`Ready to play song ${songId}. Auth header and stream token applied.`)
    } catch (error) {
      setStatus(`Playback failed: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const resetMusicState = () => {
    revokeObjectUrlMap(artUrls)
    revokeObjectUrl(playerState.objectUrl)
    setMusic([])
    setSongUpload(null)
    setPlayerState({ id: null, label: '', streamToken: '', objectUrl: '' })
    setArtUrls({})
  }

  return {
    music,
    songUpload,
    setSongUpload,
    playerState,
    artUrls,
    loadMusic,
    uploadSong,
    playSong,
    resetMusicState,
  }
}
