import { useState } from 'react'
import DataTable, { Badge } from './DataTable.jsx'
import { PARENT_DATA } from '../data/sampleData.js'

const statusCol = {
  key: 'status',
  label: 'Status',
  render: (row) => <Badge value={row.status} />,
}

const TABLES = {
  childs: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Child' },
      { key: 'age', label: 'Age' },
      { key: 'registeredOn', label: 'Registered on' },
      statusCol,
    ],
    rows: PARENT_DATA.children,
  },
  location: {
    columns: [
      { key: 'child', label: 'Child' },
      { key: 'place', label: 'Last seen at' },
      { key: 'seenAt', label: 'When' },
    ],
    rows: PARENT_DATA.location,
  },
  cases: {
    columns: [
      { key: 'id', label: 'Case' },
      { key: 'child', label: 'Child' },
      { key: 'openedOn', label: 'Opened on' },
      statusCol,
    ],
    rows: PARENT_DATA.cases,
  },
  jobs: {
    columns: [
      { key: 'id', label: 'Job' },
      { key: 'child', label: 'Child' },
      { key: 'type', label: 'Type' },
      { key: 'startedOn', label: 'Started on' },
      statusCol,
      { key: 'result', label: 'Result' },
    ],
    rows: PARENT_DATA.jobs,
  },
}

function ConsentsTable() {
  const [rows, setRows] = useState(PARENT_DATA.consents)

  const decide = (id, status) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

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
              onClick={() => decide(row.id, 'Approved')}
              className="min-h-11 rounded-md bg-green-100 px-4 font-bold text-green-900 hover:bg-green-200"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => decide(row.id, 'Rejected')}
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

  return <DataTable columns={columns} rows={rows} />
}

export default function ParentSection({ section }) {
  if (section === 'consents') return <ConsentsTable />

  const table = TABLES[section]
  if (!table) return null
  return <DataTable columns={table.columns} rows={table.rows} />
}