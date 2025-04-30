'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { createProfile } from '@/lib/db/profile'

export default function ProfileChecker() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAndHandleProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      // console.log("user",user)
      if (!user) {
        if (!['/login', '/signup', '/verify-email'].includes(pathname)) {
          router.push('/login')
        }
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        await createProfile({
          id: user.id,
          username: user.email?.split('@')[0] || `user_${Math.random().toString(36).substring(2, 8)}`,
          full_name: '',
          avatar_url: null
        })
        // router.push('/profile')
      }

      if (pathname === '/login' || pathname === '/signup') {
        router.push('/dashboard/tasks')
      }
    }

    checkAndHandleProfile()
  }, [pathname])

  return null
}