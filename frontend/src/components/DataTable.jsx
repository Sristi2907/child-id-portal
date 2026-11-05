const BADGE_STYLES = {
  Verified: 'bg-green-100 text-green-900',
  Approved: 'bg-green-100 text-green-900',
  Completed: 'bg-green-100 text-green-900',
  Pending: 'bg-amber-100 text-amber-900',
  Waiting: 'bg-amber-100 text-amber-900',
  Running: 'bg-amber-100 text-amber-900',
  Open: 'bg-amber-100 text-amber-900',
  Rejected: 'bg-red-100 text-red-900',
  Closed: 'bg-slate-200 text-slate-800',
}

// Small coloured tag for a status value
export function Badge({ value }) {
  const style = BADGE_STYLES[value] || 'bg-slate-100 text-slate-800'
  return (
    <span className={'inline-block rounded-full px-3 py-0.5 text-sm font-bold ' + style}>
      {value}
    </span>
  )
}

// columns: [{ key, label, render?(row) }], rows: [{ id, ... }]
export default function DataTable({ columns, rows, emptyText = 'No records yet.' }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        {emptyText}
      </div>
    )
  }

  const cell = (col, row) => (col.render ? col.render(row) : row[col.key])

  return (
    <>
      {/* Table view: tablets and laptops */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="whitespace-nowrap px-4 py-3 font-bold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 align-middle">
                    {cell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view: phones */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <dl className="space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">{col.label}</dt>
                  <dd className="text-right font-bold">{cell(col, row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}