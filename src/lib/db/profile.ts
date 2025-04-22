import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const getProfile = async (userId: string) => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateProfile = async (profile: Partial<Profile>) => {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}