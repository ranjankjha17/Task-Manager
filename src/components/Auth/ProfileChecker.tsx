// // components/Auth/ProfileChecker.tsx
// 'use client'

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import { createProfile } from '@/lib/db/profile'

// export default function ProfileChecker() {
//   const supabase = createClientComponentClient()
//   const router = useRouter()

//   useEffect(() => {
//     const checkAndCreateProfile = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
      
//       if (user) {
//         // Check if profile exists
//         const { data: profile, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', user.id)
//           .single()

//         // If no profile exists, create one
//         if (error || !profile) {
//           await createProfile({
//             id: user.id,
//             username: user.email?.split('@')[0] || `user_${Math.random().toString(36).substring(2, 8)}`,
//             full_name: ''
//           })
//         }
//       }
//     }

//     checkAndCreateProfile()
//   }, [])

//   return null
// }




// components/Auth/ProfileChecker.tsx
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
      // 1. Get current user session
      const { data: { user } } = await supabase.auth.getUser()
      // console.log("user",user)
      if (!user) {
        // If no user and not on auth pages, redirect to login
        if (!['/login', '/signup', '/verify-email'].includes(pathname)) {
          router.push('/login')
        }
        return
      }

      // 2. Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // 3. If no profile exists, create a default one
      if (error || !profile) {
        await createProfile({
          id: user.id,
          username: user.email?.split('@')[0] || `user_${Math.random().toString(36).substring(2, 8)}`,
          full_name: '',
          avatar_url: null
        })
        // router.push('/profile')
      }

      // 4. Redirect logic
      if (pathname === '/login' || pathname === '/signup') {
        router.push('/dashboard/tasks') // Redirect to dashboard after auth
      }
    }

    checkAndHandleProfile()
  }, [pathname])

  return null
}