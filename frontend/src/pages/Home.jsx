import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  // Message shown after clicking "Health check"
  const [status, setStatus] = useState('')

  const handleHealthCheck = () => {
    // Placeholder: the backend does not exist yet
    setStatus('Backend is not connected yet.')
  }

  const topButton =
    'min-h-11 rounded-md border border-slate-300 bg-white px-4 hover:border-teal-700'

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      {/* Header bar: Health check on the left, Refresh on the right */}
      <header className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white p-4">
        <button onClick={handleHealthCheck} className={topButton}>
          Health check
        </button>
        <button onClick={() => window.location.reload()} className={topButton}>
          Refresh
        </button>
      </header>

      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          {/* Simple shield icon (decorative) */}
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 text-teal-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-balance sm:text-4xl">
            Child Safety and Identification Portal
          </h1>

          {status && (
            <p role="status" className="mt-5 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              {status}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="flex min-h-12 flex-1 items-center justify-center rounded-md bg-teal-700 px-6 font-bold text-white hover:bg-teal-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex min-h-12 flex-1 items-center justify-center rounded-md border border-slate-300 px-6 font-bold hover:border-teal-700"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}