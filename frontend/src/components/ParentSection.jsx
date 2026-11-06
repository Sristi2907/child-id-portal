import DataTable, { Badge } from './DataTable.jsx'
import { useConsents } from '../context/ConsentContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const statusCol = {
  key: 'status',
  label: 'Status',
  render: (row) => <Badge value={row.status} />,
}

function ConsentsTable() {
  // Requests come from the shared store, so new operator requests show up here
  const { requests, setStatus } = useConsents()
  const { user } = useAuth()

  // Show only requests sent to this parent's registered mobile number
  const myRequests = requests.filter((r) => r.parentMobile === user.mobile)

  const columns = [
    { key: 'id', label: 'Request' },
    { key: 'child', label: 'Child' },
    { key: 'requestedBy', label: 'Requested by' },
    { key: 'requestedOn', label: 'Requested on' },
    statusCol,
    {
      key: 'action',
      label: 'Action',
      render: (row) =>
        row.status === 'Waiting' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus(row.id, 'Approved')}
              className="min-h-11 rounded-md bg-green-100 px-4 font-bold text-green-900 hover:bg-green-200"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setStatus(row.id, 'Rejected')}
              className="min-h-11 rounded-md bg-red-100 px-4 font-bold text-red-900 hover:bg-red-200"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-slate-500">Done</span>
        ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={myRequests}
      emptyText="No consent requests for you yet."
    />
  )
}

// Pages whose columns are not decided yet stay empty
const EMPTY_TEXT =
  'Nothing here yet. The columns and data for this page will be added once they are decided.'

export default function ParentSection({ section }) {
  if (section === 'consents') return <ConsentsTable />
  return <DataTable columns={[]} rows={[]} emptyText={EMPTY_TEXT} />
}