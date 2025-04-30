import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string
  created_at: string
}
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

export const createProfile = async (
  profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
): Promise<Profile> => {
  const supabase = createClientComponentClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('User not authenticated')

    if (!profileData.username?.trim()) throw new Error('Username is required')
    
    const { data: usernameCheck, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', profileData.username)
      .maybeSingle()

    if (usernameError) throw usernameError
    if (usernameCheck) throw new Error('Username already taken')

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...profileData,
        id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Profile creation failed:', error)
    throw error instanceof Error ? error : new Error('Failed to create profile')
  }
}

export const ensureProfileExists = async (): Promise<boolean> => {
  const supabase = createClientComponentClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return false

    try {
      await getProfile(user.id)
      return true
    } catch {
      await createProfile({
        username: user.email?.split('@')[0] || `user_${Math.random().toString(36).slice(2, 8)}`,
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || null
      })
      return true
    }
  } catch (error) {
    console.error('Failed to ensure profile exists:', error)
    return false
  }
}

