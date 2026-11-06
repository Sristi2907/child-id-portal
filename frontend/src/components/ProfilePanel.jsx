import { ROLE_LABELS } from '../config/menus.js'

export default function ProfilePanel({ role, user }) {
  const rows = [
    ['Name', user.name],
    ['User ID', user.userId],
    ['Mobile no.', user.mobile],
    ['Role', ROLE_LABELS[role]],
  ]

  return (
    <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <dl className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}