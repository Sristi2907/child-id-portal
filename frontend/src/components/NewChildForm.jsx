import { useEffect, useState } from 'react'
import { Badge } from './DataTable.jsx'
import { useConsents } from '../context/ConsentContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const MAC_PATTERN = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/

// Keep only digits and cut to the max length
const onlyDigits = (value, max) => value.replace(/\D/g, '').slice(0, max)

// The age must be filled in and below 18
const isValidAge = (value) => value !== '' && Number(value) <= 17

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

const POPUP_TEXT = {
  Waiting: 'Waiting for the parent to respond...',
  Approved: 'The parent approved the request.',
  Rejected: 'The parent rejected the request.',
  Cancelled: 'The request was cancelled.',
}

export default function NewChildForm() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [parentMobile, setParentMobile] = useState('')
  const [captured, setCaptured] = useState({ left: false, right: false })
  const [scanningKey, setScanningKey] = useState('')
  const [mac, setMac] = useState('')
  const [linked, setLinked] = useState(false)
  const [requestId, setRequestId] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const { requests, addRequest, setStatus } = useConsents()
  const { user } = useAuth()

  // The consent request sent from this form (if any) and its live status
  const request = requests.find((r) => r.id === requestId)
  const consentStatus = request ? request.status : ''

  // Close the popup with the Escape key
  useEffect(() => {
    if (!showPopup) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowPopup(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showPopup])

  // If the child or parent details change, the old consent no longer applies
  const resetConsent = () => {
    if (request && request.status === 'Waiting') setStatus(request.id, 'Cancelled')
    setRequestId('')
  }

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
    resetConsent()
    setName('')
    setAge('')
    setAadhaar('')
    setParentMobile('')
    setCaptured({ left: false, right: false })
    setMac('')
    setLinked(false)
    setShowPopup(false)
    setMessage({ type: '', text: '' })
  }

  const handleSendConsent = () => {
    // A request is already waiting: just show the popup again
    if (consentStatus === 'Waiting') {
      setShowPopup(true)
      return
    }
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Enter the child name first.' })
      return
    }
    if (!isValidAge(age)) {
      setMessage({ type: 'error', text: 'Enter the child age (0 to 17 years) to send consent.' })
      return
    }
    if (parentMobile.length !== 10) {
      setMessage({ type: 'error', text: 'Enter the parent mobile number (10 digits) to send consent.' })
      return
    }
    setMessage({ type: '', text: '' })
    const id = addRequest({
      child: name.trim(),
      childAge: Number(age),
      parentMobile,
      operatorId: user.userId,
      operatorName: user.name,
    })
    setRequestId(id)
    setShowPopup(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Enter the child name.' })
      return
    }
    if (!isValidAge(age)) {
      setMessage({ type: 'error', text: 'Enter the child age (0 to 17 years).' })
      return
    }
    if (aadhaar.length !== 12) {
      setMessage({ type: 'error', text: 'Child Aadhaar number must be 12 digits.' })
      return
    }
    if (parentMobile.length !== 10) {
      setMessage({ type: 'error', text: 'Enter the parent mobile number (10 digits).' })
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
    if (consentStatus !== 'Approved') {
      setMessage({
        type: 'error',
        text: 'Parent consent is required. Send consent and wait for approval.',
      })
      return
    }

    // Placeholder: the backend does not exist yet
    setMessage({
      type: 'info',
      text: 'All details are valid, but nothing is saved yet. Saving will work once the backend is connected.',
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
        {/* Child details */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="childName" className="block font-bold">
              Child name
            </label>
            <input
              id="childName"
              type="text"
              value={name}
              onChange={(e) => {
                resetConsent()
                setName(e.target.value)
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="age" className="block font-bold">
              Child age (years)
            </label>
            <input
              id="age"
              type="text"
              inputMode="numeric"
              value={age}
              onChange={(e) => {
                resetConsent()
                setAge(onlyDigits(e.target.value, 2))
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="aadhaar" className="block font-bold">
              Child Aadhaar no.
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

        {/* Parent (the consent request goes to this parent) */}
        <div className="mt-4 sm:max-w-xs">
          <label htmlFor="parentMobile" className="block font-bold">
            Parent mobile no. (for consent)
          </label>
          <input
            id="parentMobile"
            type="tel"
            inputMode="numeric"
            value={parentMobile}
            onChange={(e) => {
              resetConsent()
              setParentMobile(onlyDigits(e.target.value, 10))
            }}
            className={inputClass}
          />
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

        {request && (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            Parent consent: <Badge value={request.status} />
          </p>
        )}
      </form>

      {/* Waiting popup: follows the live status of the request */}
      {showPopup && request && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consentTitle"
            className="w-full max-w-xs rounded-xl bg-white p-6 text-center shadow-lg"
          >
            {request.status === 'Waiting' && (
              <div
                className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700 motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            <p id="consentTitle" className="mt-4 font-bold">
              {POPUP_TEXT[request.status]}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Sent to parent mobile ******{request.parentMobile.slice(-4)}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="min-h-11 flex-1 rounded-md bg-green-100 px-4 font-bold text-green-900 hover:bg-green-200"
              >
                OK
              </button>
              {request.status === 'Waiting' && (
                <button
                  type="button"
                  onClick={() => {
                    setStatus(request.id, 'Cancelled')
                    setShowPopup(false)
                    setMessage({ type: 'info', text: 'Consent request cancelled.' })
                  }}
                  className="min-h-11 flex-1 rounded-md bg-red-100 px-4 font-bold text-red-900 hover:bg-red-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}