import { ROLE_LABELS } from '../config/menus.js'

export default function ProfilePanel({ role }) {
  return (
    <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <dl className="space-y-3">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Role</dt>
          <dd className="font-bold">{ROLE_LABELS[role]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">User ID</dt>
          <dd className="text-slate-600">Will appear after login is connected</dd>
        </div>
      </dl>
    </div>
  )
}