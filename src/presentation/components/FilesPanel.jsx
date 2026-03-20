function FilesPanel({
  files,
  setFileUpload,
  uploadGenericFile,
  loadFiles,
  openFileInline,
  downloadFile,
  deleteFile,
  busy,
  token,
  isAdmin,
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Files</h2>
        <button
          className="rounded bg-zinc-800 px-3 py-1 text-sm disabled:opacity-50"
          type="button"
          onClick={loadFiles}
          disabled={busy || !token}
        >
          Reload
        </button>
      </div>

      <form className="mb-4 space-y-2" onSubmit={uploadGenericFile}>
        <input
          className="block w-full text-sm"
          type="file"
          onChange={(event) => setFileUpload(event.target.files?.[0] || null)}
        />
        <button
          className="rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
          type="submit"
          disabled={busy || !token}
        >
          Upload File (`POST /upload`)
        </button>
      </form>

      <div className="max-h-[45vh] space-y-2 overflow-auto pr-1">
        {files.length === 0 && <p className="text-sm text-zinc-500">No files loaded.</p>}
        {files.map((fileItem, index) => {
          const id = fileItem.id ?? fileItem.fileId ?? index
          const label = fileItem.fileName || fileItem.name || fileItem.originalName || `File ${id}`

          return (
            <div key={`${id}-${index}`} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-zinc-400">id: {id}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  className="rounded bg-zinc-800 px-2 py-1 text-xs"
                  type="button"
                  onClick={() => openFileInline(id)}
                >
                  View Inline
                </button>
                <button
                  className="rounded bg-zinc-800 px-2 py-1 text-xs"
                  type="button"
                  onClick={() => downloadFile(id)}
                >
                  Download
                </button>
                {isAdmin && (
                  <button
                    className="rounded bg-red-600 px-2 py-1 text-xs text-red-50"
                    type="button"
                    onClick={() => deleteFile(id)}
                  >
                    Delete (Admin)
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default FilesPanel
