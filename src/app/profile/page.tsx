import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/Profile/ProfileForm'
import { getProfile } from '@/lib/db/profile'
// import { getProfile } from '@/lib/db/profiles'

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const profile = await getProfile(session.user.id)

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}