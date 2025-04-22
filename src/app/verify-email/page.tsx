'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Checking your email verification status...')
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Check the current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setMessage('No session found. Please log in.')
          setIsLoading(false)
          return
        }

        // Check if email is verified
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.email_confirmed_at) {
          setIsVerified(true)
          setMessage('Email successfully verified! Redirecting to dashboard...')
          setTimeout(() => router.push('/dashboard/tasks'), 3000)
        } else {
          setMessage('Email not yet verified. Please check your inbox.')
        }
      } catch (error) {
        setMessage('Error checking verification status. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    checkVerification()

    // Set up real-time listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        setIsVerified(true)
        setMessage('Email successfully verified! Redirecting to dashboard...')
        setTimeout(() => router.push('/dashboard/tasks'), 3000)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleResend = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: (await supabase.auth.getSession()).data.session?.user.email || '',
      })
      
      if (error) throw error
      setMessage('Verification email resent! Please check your inbox.')
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
        </div>
        
        <div className="text-center">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">{message}</p>
              {!isVerified && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Didn't receive an email?
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Resend Verification Email
                  </button>
                </div>
              )}
              <div className="mt-4">
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}