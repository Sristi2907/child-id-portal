import { Navigate, useParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import NewChildForm from '../components/NewChildForm.jsx'
import ProfilePanel from '../components/ProfilePanel.jsx'
import SystemHealth from '../components/SystemHealth.jsx'
import ParentSection from '../components/ParentSection.jsx'
import OperatorSection from '../components/OperatorSection.jsx'
import AdminSection from '../components/AdminSection.jsx'
import { MENUS } from '../config/menus.js'
import { useAuth } from '../context/AuthContext.jsx'

// Picks what to show inside the dashboard for a role and section
function Content({ role, section, label, user }) {
  if (section === 'profile') return <ProfilePanel role={role} user={user} />
  if (section === 'health') return <SystemHealth />
  if (role === 'parent') return <ParentSection section={section} />
  if (role === 'operator') return <OperatorSection section={section} />
    if (role === 'admin') return <AdminSection section={section} />
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
      Content for "{label}" will be built next.
    </div>
  )
}

export default function Dashboard() {
  const { role, section } = useParams()
  const { user } = useAuth()

  // Not logged in: go to the home page
  if (!user) return <Navigate to="/" replace />

  // A user can only open the dashboard of their own role
  if (role !== user.role) return <Navigate to={`/dashboard/${user.role}`} replace />

  // Unknown role in the URL: go back to the home page
  if (!MENUS[role]) return <Navigate to="/" replace />

  // Profile is the default section
  const active = section || 'profile'

  const allItems = MENUS[role].flatMap((g) => g.items)
  const current = allItems.find((i) => i.key === active)

  // Unknown section in the URL: go to Profile
  if (!current) return <Navigate to={`/dashboard/${role}/profile`} replace />

  return (
    <DashboardLayout role={role} section={active}>
      {role === 'operator' && active === 'newchild' ? (
        <NewChildForm />
      ) : (
        <>
          <h1 className="mb-4 text-2xl font-bold">{current.label}</h1>
          <Content role={role} section={active} label={current.label} user={user} />
        </>
      )}
    </DashboardLayout>
  )
}