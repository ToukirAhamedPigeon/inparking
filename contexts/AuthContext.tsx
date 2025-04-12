// context/AuthContext.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: any
  setUser: (user: any) => void
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userInfo = localStorage.getItem('authUser')
    if (userInfo) setUser(JSON.parse(userInfo))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
