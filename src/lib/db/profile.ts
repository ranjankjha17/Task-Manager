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



export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string
  created_at: string
}




// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// export interface Profile {
//   id: string
//   username: string
//   full_name: string | null
//   avatar_url: string | null
//   created_at: string
//   updated_at: string
// }

// // Initialize Supabase client
// const supabase = createClientComponentClient()

// /**
//  * Creates a new user profile with validation
//  */
export const createProfile = async (
  profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
): Promise<Profile> => {
  const supabase = createClientComponentClient()

  try {
    // Verify user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('User not authenticated')

    // Validate required fields
    if (!profileData.username?.trim()) throw new Error('Username is required')
    
    // Check username availability
    const { data: usernameCheck, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', profileData.username)
      .maybeSingle()

    if (usernameError) throw usernameError
    if (usernameCheck) throw new Error('Username already taken')

    // Create profile
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

// /**
//  * Fetches user profile by ID
//  */
// // export const getProfile = async (userId: string): Promise<Profile> => {
// //   try {
// //     const { data, error } = await supabase
// //       .from('profiles')
// //       .select('*')
// //       .eq('id', userId)
// //       .single()

// //     if (error) throw error
// //     return data

// //   } catch (error) {
// //     console.error('Failed to fetch profile:', error)
// //     throw error instanceof Error ? error : new Error('Profile not found')
// //   }
// // }


// export const getProfile = async (userId: string): Promise<Profile> => {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('*')
//     .eq('id', userId)
//     .maybeSingle() // ✅ This won't throw error if 0 rows, just returns null

//   if (error) {
//     console.error('Profile fetch error:', error)
//     throw new Error(error.message)
//   }
//   console.log("data",data)

//   if (!data) {
//     console.warn('Profile not found')
//     throw new Error('Profile not found')
//   }

//   return data
// }

// /**
//  * Updates profile with validation
//  */
// export const updateProfile = async (
//   profileData: Partial<Profile> & { id: string }
// ): Promise<Profile> => {
//   try {
//     // Verify ownership
//     const { data: { user }, error: userError } = await supabase.auth.getUser()
//     if (userError || !user || user.id !== profileData.id) {
//       throw new Error('Not authorized to update this profile')
//     }

//     // Validate username if being updated
//     if (profileData.username) {
//       const { data: usernameCheck, error: usernameError } = await supabase
//         .from('profiles')
//         .select('username')
//         .eq('username', profileData.username)
//         .neq('id', profileData.id)
//         .maybeSingle()

//       if (usernameError) throw usernameError
//       if (usernameCheck) throw new Error('Username already taken')
//     }

//     // Update profile
//     const { data, error } = await supabase
//       .from('profiles')
//       .update({
//         ...profileData,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', profileData.id)
//       .select()
//       .single()

//     if (error) throw error
//     return data

//   } catch (error) {
//     console.error('Profile update failed:', error)
//     throw error instanceof Error ? error : new Error('Failed to update profile')
//   }
// }

/**
 * Ensures a profile exists for the current user
 */
export const ensureProfileExists = async (): Promise<boolean> => {
  const supabase = createClientComponentClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return false

    try {
      await getProfile(user.id)
      return true
    } catch {
      // Create default profile if doesn't exist
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

