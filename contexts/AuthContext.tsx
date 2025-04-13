'use client'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: any
  setUser: (user: any) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userInfo = localStorage.getItem('authUser')
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    }
    setLoading(false) // ✅ Done loading
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
