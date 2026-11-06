import { createContext, useContext, useEffect, useState } from 'react'
import { PARENT_DATA } from '../data/sampleData.js'

// Demo only: consent requests are shared between browser tabs through localStorage.
// The backend will replace this later.
const STORAGE_KEY = 'child-id-consents'

const ConsentContext = createContext(null)

function loadRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : PARENT_DATA.consents
  } catch {
    return PARENT_DATA.consents
  }
}

export function ConsentProvider({ children }) {
  const [requests, setRequests] = useState(loadRequests)

  // Save every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
    } catch {
      // Storage may be unavailable; the app still works for this session
    }
  }, [requests])

  // Keep two tabs in sync (for example an operator tab and a parent tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setRequests(JSON.parse(e.newValue))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

const addRequest = ({ child, parentMobile, operatorId, operatorName }) => {
    const id = 'R-' + Date.now().toString().slice(-6)
    const request = {
      id,
      child,
      parentMobile,
      operatorId,
      requestedBy: operatorName,
      requestedOn: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Waiting',
    }
    setRequests((prev) => [request, ...prev])
    return id
  }

  // Status: Waiting, Approved, Rejected or Cancelled
  const setStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <ConsentContext.Provider value={{ requests, addRequest, setStatus }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsents() {
  return useContext(ConsentContext)
}