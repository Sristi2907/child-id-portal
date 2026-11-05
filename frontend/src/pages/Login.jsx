import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'operator', label: 'Operator' },
  { value: 'parent', label: 'Parent' },
]

export default function Login() {
  const navigate = useNavigate()  
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('')
  const [bioCaptured, setBioCaptured] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Fake fingerprint scan (a real scanner will be connected later)
  const handleCapture = () => {
    setScanning(true)
    setMessage({ type: '', text: '' })
    setTimeout(() => {
      setScanning(false)
      setBioCaptured(true)
    }, 800)
  }

  const handleClear = () => {
    setUserId('')
    setRole('')
    setBioCaptured(false)
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!userId.trim() || !role) {
      setMessage({ type: 'error', text: 'Enter your User ID / Email and select a role.' })
      return
    }
    if (!bioCaptured) {
      setMessage({ type: 'error', text: 'Capture your fingerprint first.' })
      return
    }

    
    // Temporary: no real login yet, go straight to the dashboard of the chosen role
     navigate(`/dashboard/${role}`)
  }

  const inputClass =
    'mt-1 w-full min-h-11 rounded-md border border-slate-300 bg-slate-50 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30'

  const messageClass =
    message.type === 'error'
      ? 'bg-red-50 text-red-800'
      : 'bg-amber-50 text-amber-800'

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      {/* Top bar: Back on the left, Refresh on the right */}
      <header className="flex items-center justify-between gap-2 p-4">
        <Link
          to="/"
          className="flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 hover:border-teal-700"
        >
          Back
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="min-h-11 rounded-md border border-slate-300 bg-white px-4 hover:border-teal-700"
        >
          Refresh
        </button>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-12 sm:items-center">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h1 className="text-2xl font-bold">Login</h1>

          <label htmlFor="userId" className="mt-5 block font-bold">
            User ID / Email
          </label>
          <input
            id="userId"
            type="text"
            autoComplete="username"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={inputClass}
          />

          <label htmlFor="role" className="mt-4 block font-bold">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
          >
            <option value="">Select</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <p className="mt-4 font-bold">Biometric</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCapture}
              disabled={scanning}
              className="min-h-11 rounded-md border border-slate-300 px-4 hover:border-teal-700 disabled:opacity-60"
            >
              {scanning ? 'Scanning...' : bioCaptured ? 'Re-take' : 'Capture fingerprint'}
            </button>
            <span
              className={
                'rounded-full border px-3 py-0.5 text-sm ' +
                (bioCaptured
                  ? 'border-transparent bg-green-100 text-green-900'
                  : 'border-slate-300 bg-slate-50 text-slate-600')
              }
            >
              {bioCaptured ? 'Captured' : 'Not captured'}
            </span>
          </div>

          {message.text && (
            <p role="alert" className={'mt-4 rounded-md p-3 text-sm ' + messageClass}>
              {message.text}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="min-h-11 flex-1 rounded-md bg-green-100 px-4 font-bold text-green-900 hover:bg-green-200"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="min-h-11 flex-1 rounded-md bg-red-100 px-4 font-bold text-red-900 hover:bg-red-200"
            >
              Clear
            </button>
          </div>

          <p className="mt-5 text-center text-slate-600">
            No account yet?{' '}
            <Link to="/register" className="font-bold text-teal-700 underline">
              Register
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}