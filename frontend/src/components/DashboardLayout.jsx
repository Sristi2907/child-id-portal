import { Link, useNavigate } from 'react-router-dom'
import { MENUS, ROLE_LABELS } from '../config/menus.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function DashboardLayout({ role, section, children }) {
  const groups = MENUS[role]
  const navigate = useNavigate()
  const { logout } = useAuth()

  const baseNav =
    'flex min-h-11 items-center whitespace-nowrap rounded-md px-3 text-left hover:bg-slate-100'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:grid md:grid-cols-[240px_1fr]">
      {/* Sidebar: horizontal scroll bar on phones, vertical on md and up */}
      <aside className="border-b border-slate-200 bg-white md:border-b-0 md:border-r">
        <nav
          aria-label="Dashboard menu"
          className="flex items-center gap-1 overflow-x-auto p-2 md:flex-col md:items-stretch md:overflow-visible md:p-3"
        >
          <Link to="/" className={baseNav + ' font-bold'}>
            Back to main
          </Link>

          {groups.map((g) => (
            <div key={g.group} className="flex shrink-0 items-center gap-1 md:flex-col md:items-stretch">
              <p className="hidden px-3 pt-4 text-sm font-bold text-slate-500 md:block">
                {g.group}
              </p>
              {g.items.map((item) => (
                <Link
                  key={item.key}
                  to={`/dashboard/${role}/${item.key}`}
                  aria-current={section === item.key ? 'page' : undefined}
                  className={
                    baseNav +
                    (section === item.key
                      ? ' bg-teal-700 font-bold text-white hover:bg-teal-700'
                      : '')
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 p-4 md:p-6">
        {/* Top bar: role name on the left, Logout and Refresh on the right */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold">{ROLE_LABELS[role]} dashboard</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="min-h-11 rounded-md bg-red-100 px-4 font-bold text-red-900 hover:bg-red-200"
            >
              Logout
            </button>
            <button
              onClick={() => window.location.reload()}
              className="min-h-11 rounded-md border border-slate-300 bg-white px-4 hover:border-teal-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}