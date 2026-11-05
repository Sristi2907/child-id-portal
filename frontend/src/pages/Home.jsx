import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  // Message shown after clicking "Health check"
  const [status, setStatus] = useState('')

  const handleHealthCheck = () => {
    // Placeholder: the backend does not exist yet
    setStatus('Backend is not connected yet.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      {/* Top bar: Health check on the left, Refresh on the right */}
      <header className="flex items-center justify-between gap-2 p-4">
        <button
          onClick={handleHealthCheck}
          className="min-h-11 rounded-md border border-slate-300 bg-white px-4 hover:border-teal-700"
        >
          Health check
        </button>
        <button
          onClick={() => window.location.reload()}
          className="min-h-11 rounded-md border border-slate-300 bg-white px-4 hover:border-teal-700"
        >
          Refresh
        </button>
      </header>

      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold">Child ID Portal</h1>
          <p className="mt-1 text-slate-600">
            Secure registration and identification for children.
          </p>

          {status && (
            <p role="status" className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              {status}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="flex min-h-11 items-center justify-center rounded-md bg-teal-700 px-4 font-bold text-white hover:bg-teal-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-4 font-bold hover:border-teal-700"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}