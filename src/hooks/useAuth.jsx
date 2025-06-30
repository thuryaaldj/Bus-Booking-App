import { useState } from 'react'

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [role, setRole] = useState(() => localStorage.getItem('role') || '')

  const login = (newToken, newRole) => {
    console.log(token, role);
    setToken(newToken)
    setRole(newRole)
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
  }

  const logout = () => {
    setToken('')
    setRole('')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  const isLoggedIn = !!token

  return { token, role, login, logout, isLoggedIn }
}
