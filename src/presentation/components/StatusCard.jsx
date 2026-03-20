function StatusCard({ status }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm">
      <p className="font-medium">Status</p>
      <p className="mt-1 text-zinc-300">{status}</p>
      <p className="mt-2 text-xs text-zinc-500">
        Protected endpoints automatically send `Authorization: Bearer {'<token>'}`.
      </p>
    </div>
  )
}

export default StatusCard
