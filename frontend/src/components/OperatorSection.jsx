import DataTable, { Badge } from './DataTable.jsx'
import { useConsents } from '../context/ConsentContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Show only the last 4 digits of a mobile number
const maskMobile = (mobile) => '******' + mobile.slice(-4)

const columns = [
  { key: 'id', label: 'Request' },
  { key: 'childAge', label: 'Child age', render: (row) => row.childAge ?? '-' },
  {
    key: 'parentMobile',
    label: 'Parent mobile',
    render: (row) => maskMobile(row.parentMobile),
  },
  { key: 'requestedOn', label: 'Sent on' },
  {
    key: 'status',
    label: 'Consent',
    render: (row) => <Badge value={row.status} />,
  },
]

export default function OperatorSection({ section }) {
  const { requests } = useConsents()
  const { user } = useAuth()

  if (section !== 'regchild') return null

  // Requests sent by this operator.
  // Requests made before operator IDs were saved have no operatorId, so they are shown too.
  // Old sample rows have no parentMobile, so they are skipped.
  const mine = requests.filter(
    (r) => r.parentMobile && (!r.operatorId || r.operatorId === user.userId)
  )

  return (
    <DataTable
      columns={columns}
      rows={mine}
      emptyText="No children yet. Send a consent request from New child."
    />
  )
}