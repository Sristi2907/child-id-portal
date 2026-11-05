import { useEffect, useState } from 'react'

const MAC_PATTERN = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/

// Keep only digits and cut to the max length
const onlyDigits = (value, max) => value.replace(/\D/g, '').slice(0, max)

const inputClass =
  'mt-1 w-full min-h-11 rounded-md border border-slate-300 bg-slate-50 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30'

// One fingerprint block: a capture / re-take button and a status tag
function FingerprintField({ label, captured, scanning, onCapture }) {
  return (
    <div>
      <p className="font-bold">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCapture}
          disabled={scanning}
          className="min-h-11 rounded-md border border-slate-300 px-4 hover:border-teal-700 disabled:opacity-60"
        >
          {scanning ? 'Scanning...' : captured ? 'Re-take' : `Capture ${label.toLowerCase()}`}
        </button>
        <span
          className={
            'rounded-full border px-3 py-0.5 text-sm ' +
            (captured
              ? 'border-transparent bg-green-100 text-green-900'
              : 'border-slate-300 bg-slate-50 text-slate-600')
          }
        >
          {captured ? 'Captured' : 'Not captured'}
        </span>
      </div>
    </div>
  )
}

export default function NewChildForm() {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [captured, setCaptured] = useState({ left: false, right: false })
  const [scanningKey, setScanningKey] = useState('')
  const [mac, setMac] = useState('')
  const [linked, setLinked] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Close the waiting popup with the Escape key
  useEffect(() => {
    if (!waiting) return
    const onKey = (e) => {
      if (e.key === 'Escape') setWaiting(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [waiting])

  // Fake fingerprint scan (a real scanner will be connected later)
  const handleCapture = (key) => {
    setScanningKey(key)
    setMessage({ type: '', text: '' })
    setTimeout(() => {
      setCaptured((prev) => ({ ...prev, [key]: true }))
      setScanningKey('')
    }, 800)
  }

  const handleMacChange = (value) => {
    // Allow only hex characters and colons, always uppercase
    setMac(value.toUpperCase().replace(/[^0-9A-F:]/g, '').slice(0, 17))
    setLinked(false)
  }

  // Fake device linking (a real device link will be connected later)
  const handleLink = () => {
    if (!MAC_PATTERN.test(mac)) {
      setMessage({ type: 'error', text: 'Enter a valid Device MAC, like AA:BB:CC:DD:EE:FF.' })
      return
    }
    setLinked(true)
    setMessage({ type: 'success', text: 'Device linked (simulated).' })
  }

  const handleClear = () => {
    setName('')
    setMobile('')
    setAadhaar('')
    setCaptured({ left: false, right: false })
    setMac('')
    setLinked(false)
    setMessage({ type: '', text: '' })
  }

  const handleSendConsent = () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Enter the name first.' })
      return
    }
    if (mobile.length !== 10) {
      setMessage({ type: 'error', text: 'Mobile number must be 10 digits to send consent.' })
      return
    }
    setMessage({ type: '', text: '' })
    setWaiting(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Enter the name.' })
      return
    }
    if (mobile.length !== 10) {
      setMessage({ type: 'error', text: 'Mobile number must be 10 digits.' })
      return
    }
    if (aadhaar.length !== 12) {
      setMessage({ type: 'error', text: 'Aadhaar number must be 12 digits.' })
      return
    }
    if (!captured.left || !captured.right) {
      setMessage({ type: 'error', text: 'Capture both left and right fingerprints.' })
      return
    }
    if (!linked) {
      setMessage({ type: 'error', text: 'Link the device first.' })
      return
    }

    // Placeholder: the backend does not exist yet
    setMessage({
      type: 'info',
      text: 'Form is valid. Saving is not connected to the backend yet.',
    })
  }

  const messageClass =
    message.type === 'error'
      ? 'bg-red-50 text-red-800'
      : message.type === 'success'
        ? 'bg-green-50 text-green-900'
        : 'bg-amber-50 text-amber-800'

  return (
    <>
      <h1 className="text-2xl font-bold">New child</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Name, Mobile no., Aadhaar no. */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="childName" className="block font-bold">
              Name
            </label>
            <input
              id="childName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block font-bold">
              Mobile no.
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(onlyDigits(e.target.value, 10))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="aadhaar" className="block font-bold">
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
          </div>
        </div>

        {/* Fingerprints */}
        <p className="mt-6 text-lg font-bold">Fingerprint</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <FingerprintField
            label="Left"
            captured={captured.left}
            scanning={scanningKey === 'left'}
            onCapture={() => handleCapture('left')}
          />
          <FingerprintField
            label="Right"
            captured={captured.right}
            scanning={scanningKey === 'right'}
            onCapture={() => handleCapture('right')}
          />
        </div>

        {/* Device MAC + Link */}
        <div className="mt-6 grid items-end gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mac" className="block font-bold">
              Device MAC
            </label>
            <input
              id="mac"
              type="text"
              placeholder="AA:BB:CC:DD:EE:FF"
              autoComplete="off"
              value={mac}
              onChange={(e) => handleMacChange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLink}
              className="min-h-11 rounded-md border border-slate-300 px-4 hover:border-teal-700"
            >
              Link
            </button>
            <span
              className={
                'rounded-full border px-3 py-0.5 text-sm ' +
                (linked
                  ? 'border-transparent bg-green-100 text-green-900'
                  : 'border-slate-300 bg-slate-50 text-slate-600')
              }
            >
              {linked ? 'Linked' : 'Not linked'}
            </span>
          </div>
        </div>

        {message.text && (
          <p role="alert" className={'mt-5 rounded-md p-3 text-sm ' + messageClass}>
            {message.text}
          </p>
        )}

        {/* Submit, Send consent, Clear */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="min-h-11 flex-1 rounded-md bg-green-100 px-4 font-bold text-green-900 hover:bg-green-200"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleSendConsent}
            className="min-h-11 flex-1 rounded-md border border-slate-300 px-4 font-bold hover:border-teal-700"
          >
            Send consent
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="min-h-11 flex-1 rounded-md bg-red-100 px-4 font-bold text-red-900 hover:bg-red-200"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Waiting popup */}
      {waiting && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitingTitle"
            className="w-full max-w-xs rounded-xl bg-white p-6 text-center shadow-lg"
          >
            <div
              className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700 motion-reduce:animate-none"
              aria-hidden="true"
            />
            <p id="waitingTitle" className="mt-4 font-bold">
              Waiting for consent...
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setWaiting(false)
                  setMessage({ type: 'success', text: 'Consent request sent (simulated).' })
                }}
                className="min-h-11 flex-1 rounded-md bg-green-100 px-4 font-bold text-green-900 hover:bg-green-200"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => {
                  setWaiting(false)
                  setMessage({ type: 'info', text: 'Consent request cancelled.' })
                }}
                className="min-h-11 flex-1 rounded-md bg-red-100 px-4 font-bold text-red-900 hover:bg-red-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}