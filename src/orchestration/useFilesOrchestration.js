import { useEffect, useState } from 'react'
import {
  fetchDownloadFile,
  fetchFiles,
  fetchInlineFile,
  removeFile,
  uploadFile,
} from '../api/filesApi'
import { valueToText } from '../utils/format'
import { revokeObjectUrl } from '../utils/objectUrl'

export function useFilesOrchestration({ token, setBusy, setStatus }) {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileUpload, setFileUpload] = useState(null)

  useEffect(() => {
    return () => {
      revokeObjectUrl(selectedFile?.objectUrl)
    }
  }, [selectedFile])

  const loadFiles = async () => {
    setBusy(true)
    setStatus('Loading files...')
    try {
      const data = await fetchFiles(token)
      setFiles(data)
      setStatus('Files loaded.')
    } catch (error) {
      setStatus(`Failed to load files: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const uploadGenericFile = async (event) => {
    event.preventDefault()
    if (!fileUpload) {
      setStatus('Pick a file before upload.')
      return
    }

    setBusy(true)
    setStatus('Uploading file...')

    try {
      await uploadFile(token, fileUpload)
      setFileUpload(null)
      setStatus('File uploaded.')
      await loadFiles()
    } catch (error) {
      setStatus(`File upload failed: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const openFileInline = async (id) => {
    setBusy(true)
    setStatus(`Opening file ${id} inline...`)

    try {
      const blob = await fetchInlineFile(token, id)
      revokeObjectUrl(selectedFile?.objectUrl)
      const objectUrl = URL.createObjectURL(blob)
      setSelectedFile({ id, objectUrl })
      setStatus(`File ${id} opened.`)
    } catch (error) {
      setStatus(`Could not open file ${id}: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const downloadFile = async (id) => {
    setBusy(true)
    setStatus(`Downloading file ${id}...`)

    try {
      const blob = await fetchDownloadFile(token, id)
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `file-${id}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
      setStatus(`File ${id} downloaded.`)
    } catch (error) {
      setStatus(`Download failed for file ${id}: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const deleteFile = async (id) => {
    setBusy(true)
    setStatus(`Deleting file ${id}...`)

    try {
      const ticket = await removeFile(token, id)
      setStatus(`Deleted file ${id}. Ticket: ${valueToText(ticket)}`)
      await loadFiles()
    } catch (error) {
      setStatus(`Delete failed for file ${id}: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  const resetFilesState = () => {
    revokeObjectUrl(selectedFile?.objectUrl)
    setFiles([])
    setFileUpload(null)
    setSelectedFile(null)
  }

  return {
    files,
    selectedFile,
    fileUpload,
    setFileUpload,
    loadFiles,
    uploadGenericFile,
    openFileInline,
    downloadFile,
    deleteFile,
    resetFilesState,
  }
}
