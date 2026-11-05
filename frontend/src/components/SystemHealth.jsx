// Sample values. A real health endpoint will be connected later.
const CHECKS = [
  { name: 'API', status: 'Online' },
  { name: 'Database', status: 'Online' },
  { name: 'Fingerprint scanner', status: 'Ready' },
  { name: 'Match engine', status: 'Idle' },
]

export default function SystemHealth() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHECKS.map((c) => (
          <div key={c.name} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-slate-500">{c.name}</p>
            <p className="mt-1 text-xl font-bold">{c.status}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
        These are sample values. Live status will come from the backend.
      </p>
    </>
  )
}