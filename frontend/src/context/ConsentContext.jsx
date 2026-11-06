import { createContext, useContext, useEffect, useState } from 'react'

// Demo only: consent requests are shared between browser tabs through localStorage.
// The backend will replace this later.
const STORAGE_KEY = 'child-id-consents'

const ConsentContext = createContext(null)

function loadRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    // Real requests always have a parent mobile; this drops old made-up sample rows
    return saved ? JSON.parse(saved).filter((r) => r.parentMobile) : []
  } catch {
    return []
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

  // Operator sends a new consent request to a parent (identified by mobile number)
  const addRequest = ({ child, childAge, parentMobile, operatorId, operatorName }) => {
    const id = 'R-' + Date.now().toString().slice(-6)
    const request = {
      id,
      child,
      childAge,
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