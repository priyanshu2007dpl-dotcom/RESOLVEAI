import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AuthUser, UserRole } from '@shared/types'

interface AuthContextValue {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (userId: string): Promise<AuthUser | null> => {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('Failed to fetch profile:', profileError.message)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      email: data.email,
      role: data.role as UserRole,
      fullName: data.full_name,
      createdAt: data.created_at,
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession)
      if (initialSession?.user) {
        const profile = await fetchProfile(initialSession.user.id)
        setUser(profile)
      }
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, newSession: Session | null) => {
        (async () => {
          setSession(newSession)
          setError(null)

          if (event === 'SIGNED_OUT' || !newSession) {
            setUser(null)
            setLoading(false)
            return
          }

          if (newSession?.user) {
            const profile = await fetchProfile(newSession.user.id)
            setUser(profile)
          }
          setLoading(false)
        })()
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      const msg = signInError.message
      setError(msg)
      return { error: msg }
    }
    return { error: null }
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, role: UserRole) => {
      setError(null)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })

      if (signUpError) {
        const msg = signUpError.message
        setError(msg)
        return { error: msg }
      }

      if (signUpData.session?.user) {
        const profile = await fetchProfile(signUpData.session.user.id)
        setUser(profile)
        setSession(signUpData.session)
      }

      return { error: null }
    },
    [fetchProfile]
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  const value: AuthContextValue = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
