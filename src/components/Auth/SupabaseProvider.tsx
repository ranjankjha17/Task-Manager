// components/Auth/SupabaseProvider.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type SupabaseContext = {
  supabase: ReturnType<typeof createClientComponentClient>
  session: any | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<any | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}