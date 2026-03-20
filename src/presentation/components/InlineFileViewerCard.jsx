function InlineFileViewerCard({ selectedFile }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-semibold">Inline File Viewer</h2>
      {selectedFile?.objectUrl ? (
        <iframe
          title={`file-${selectedFile.id}`}
          className="mt-3 h-72 w-full rounded border border-zinc-800 bg-zinc-950"
          src={selectedFile.objectUrl}
          sandbox=""
          referrerPolicy="no-referrer"
        />
      ) : (
        <p className="mt-2 text-sm text-zinc-500">Choose "View Inline" on a file to preview it here.</p>
      )}
    </div>
  )
}

export default InlineFileViewerCard
