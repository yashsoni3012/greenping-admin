import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ga_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Accept any user object from the API and store it
  const loginApi = (userData) => {
    setUser(userData)
    localStorage.setItem('ga_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ga_user')   // token is removed along with user data
  }

  return (
    <AuthContext.Provider value={{ user, loginApi, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}