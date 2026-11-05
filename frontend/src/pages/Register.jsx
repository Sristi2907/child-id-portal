import { useState } from 'react'
import { Link } from 'react-router-dom'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'operator', label: 'Operator' },
  { value: 'parent', label: 'Parent' },
]

export default function Register() {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [bioCaptured, setBioCaptured] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Keep only digits and cut to the max length
  const onlyDigits = (value, max) => value.replace(/\D/g, '').slice(0, max)

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
    setName('')
    setMobile('')
    setUserId('')
    setRole('')
    setAadhaar('')
    setBioCaptured(false)
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Enter your name.' })
      return
    }
    if (mobile.length !== 10) {
      setMessage({ type: 'error', text: 'Mobile number must be 10 digits.' })
      return
    }
    if (!userId.trim()) {
      setMessage({ type: 'error', text: 'Enter a User ID / Email.' })
      return
    }
    if (!role) {
      setMessage({ type: 'error', text: 'Select a role.' })
      return
    }
    if (aadhaar.length !== 12) {
      setMessage({ type: 'error', text: 'Aadhaar number must be 12 digits.' })
      return
    }
    if (!bioCaptured) {
      setMessage({ type: 'error', text: 'Capture your fingerprint first.' })
      return
    }

    // Placeholder: the backend does not exist yet
    setMessage({
      type: 'info',
      text: 'Form is valid. Registration is not connected to the backend yet.',
    })
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

      <main className="flex flex-1 items-start justify-center px-4 pb-12">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h1 className="text-2xl font-bold">Register</h1>

          <label htmlFor="name" className="mt-5 block font-bold">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />

          <label htmlFor="mobile" className="mt-4 block font-bold">
            Mobile no.
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            onChange={(e) => setMobile(onlyDigits(e.target.value, 10))}
            className={inputClass}
          />

          <label htmlFor="userId" className="mt-4 block font-bold">
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

          <label htmlFor="aadhaar" className="mt-4 block font-bold">
            Aadhaar no.
          </label>
          <input
            id="aadhaar"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={aadhaar}
            onChange={(e) => setAadhaar(onlyDigits(e.target.value, 12))}
            className={inputClass}
          />

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
              Submit
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
            Already registered?{' '}
            <Link to="/login" className="font-bold text-teal-700 underline">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}