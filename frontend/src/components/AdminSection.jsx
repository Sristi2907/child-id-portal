import DataTable, { Badge } from './DataTable.jsx'
import { useConsents } from '../context/ConsentContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Show only the last 4 digits of a mobile number
const maskMobile = (mobile) => '******' + mobile.slice(-4)

// Sections that have no data source yet (the backend will fill them later)
const EMPTY_TEXT = {
  identities: 'No identities yet. Children will appear here once registrations are saved.',
  cases: 'No cases yet.',
  contracts: 'No contracts yet.',
  jobs: 'No match jobs yet.',
}

const consentColumns = [
  { key: 'id', label: 'Request' },
  { key: 'child', label: 'Child' },
  {
    key: 'parentMobile',
    label: 'Parent mobile',
    render: (row) => maskMobile(row.parentMobile),
  },
  { key: 'requestedBy', label: 'Requested by' },
  { key: 'requestedOn', label: 'Requested on' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Badge value={row.status} />,
  },
]

const guardianColumns = [
  { key: 'name', label: 'Name' },
  { key: 'userId', label: 'User ID' },
  { key: 'mobile', label: 'Mobile', render: (row) => maskMobile(row.mobile) },
  { key: 'approved', label: 'Approved consents' },
]

export default function AdminSection({ section }) {
  const { requests } = useConsents()
  const { getUsers } = useAuth()

  // Real requests only: old sample rows have no parent mobile
  if (section === 'consents') {
    const rows = requests.filter((r) => r.parentMobile)
    return (
      <DataTable columns={consentColumns} rows={rows} emptyText="No consent requests yet." />
    )
  }

  // Every user who registered with the Parent role
  if (section === 'guardians') {
    const rows = getUsers()
      .filter((u) => u.role === 'parent')
      .map((u) => ({
        id: u.userId,
        name: u.name,
        userId: u.userId,
        mobile: u.mobile,
        approved: requests.filter((r) => r.parentMobile === u.mobile && r.status === 'Approved')
          .length,
      }))
    return (
      <DataTable columns={guardianColumns} rows={rows} emptyText="No parents have registered yet." />
    )
  }

  const text = EMPTY_TEXT[section]
  if (!text) return null
  return <DataTable columns={[]} rows={[]} emptyText={text} />
}