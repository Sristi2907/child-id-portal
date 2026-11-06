import { createContext, useContext, useState } from 'react'

// Demo only: users live in the browser until the backend exists.
const USERS_KEY = 'child-id-users' // all registered users (shared by every tab)
const SESSION_KEY = 'child-id-session' // who is logged in (this tab only)

function read(storage, key, fallback) {
  try {
    const saved = storage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage may be unavailable; the demo then cannot remember users
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => read(sessionStorage, SESSION_KEY, null))

  // Always read fresh, so this tab sees users registered in another tab
  const getUsers = () => read(localStorage, USERS_KEY, [])

  const user = session ? getUsers().find((u) => u.userId === session.userId) || null : null

  const register = ({ name, mobile, userId, role }) => {
    const users = getUsers()
    const id = userId.trim().toLowerCase()

    if (users.some((u) => u.userId === id)) {
      return { ok: false, error: 'This User ID is already registered.' }
    }
    if (users.some((u) => u.mobile === mobile)) {
      return { ok: false, error: 'This mobile number is already registered.' }
    }

    write(localStorage, USERS_KEY, [...users, { userId: id, name: name.trim(), mobile, role }])
    return { ok: true }
  }

  const login = ({ userId, role }) => {
    const id = userId.trim().toLowerCase()
    const found = getUsers().find((u) => u.userId === id)

    if (!found) {
      return { ok: false, error: 'No account found. Please register first.' }
    }
    if (found.role !== role) {
      return { ok: false, error: 'This account is not registered with the selected role.' }
    }

    write(sessionStorage, SESSION_KEY, { userId: found.userId })
    setSession({ userId: found.userId })
    return { ok: true }
  }

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // Nothing to clean up if storage is unavailable
    }
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, getUsers }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}