import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, authService, profilesService } from './supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = chargement initial, null = déconnecté
  const [profile, setProfile] = useState(null)
  const [recoveryMode, setRecoveryMode] = useState(false)

  useEffect(() => {
    authService.getSession().then(s => setSession(s ?? null)).catch(() => setSession(null))
    const sub = authService.onAuthChange((s, event) => {
      setSession(s ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true)
    })
    return () => sub?.unsubscribe?.()
  }, [])

  useEffect(() => {
    if (session?.user) {
      profilesService.get(session.user.id).then(setProfile).catch(() => setProfile(null))
    } else {
      setProfile(null)
    }
  }, [session?.user?.id])

  const user = session?.user || null
  const loading = session === undefined

  const signUp = async (email, password, fullName, phone) => {
    const data = await authService.signUp(email, password, fullName, phone)
    return data
  }
  const signIn = async (email, password) => {
    const data = await authService.signIn(email, password)
    return data
  }
  const signOut = async () => {
    await authService.signOut()
  }
  const updatePassword = async (newPassword) => {
    await authService.updatePassword(newPassword)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updatePassword, recoveryMode, clearRecoveryMode: () => setRecoveryMode(false), refreshProfile: () => user && profilesService.get(user.id).then(setProfile) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>")
  return ctx
}
