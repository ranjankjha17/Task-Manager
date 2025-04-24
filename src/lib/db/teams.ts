import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export interface Team {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

/**
 * Creates a new team
 */
export const createTeam = async (teamData: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team> => {
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('teams')
    .insert({
      ...teamData,
      created_by: user.id
    })
    .select()
    .single()

  if (error) throw error

  // Add creator as team owner
  await addTeamMember({
    team_id: data.id,
    user_id: user.id,
    role: 'owner'
  })

  return data
}

/**
 * Adds a member to a team
 */
export const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at'>): Promise<TeamMember> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Verify requester is team owner
  const { data: team } = await supabase
    .from('teams')
    .select('created_by')
    .eq('id', memberData.team_id)
    .single()

  if (!team || team.created_by !== user.id) {
    throw new Error('Only team owners can add members')
  }

  const { data, error } = await supabase
    .from('team_members')
    .insert(memberData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Gets all teams for current user
 */
export const getUserTeams = async (): Promise<Team[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('team_members')
    .select('team:teams(*)')
    .eq('user_id', user.id)

  if (error) throw error
  return data.map(item => item.team) as Team[]
}

/**
 * Gets all members of a team
 */
export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Verify user is a member of the team
  const { data: membership } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) throw new Error('Not a team member')

  const { data, error } = await supabase
    .from('team_members')
    .select('*, user:profiles(username, full_name, avatar_url)')
    .eq('team_id', teamId)

  if (error) throw error
  return data
}

/**
 * Removes a member from a team
 */
export const removeTeamMember = async (memberId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Verify requester is team owner
  const { data: member } = await supabase
    .from('team_members')
    .select('team:teams(created_by)')
    .eq('id', memberId)
    .single()

  if (!member || member.team.created_by !== user.id) {
    throw new Error('Only team owners can remove members')
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)

  if (error) throw error
}



/**
 * Gets team details
 */
export const getTeamDetails = async (teamId: string): Promise<Team & { members_count: number }> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Verify user is a member of the team
  const { data: membership } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) throw new Error('Not a team member')

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*, members:team_members(count)')
    .eq('id', teamId)
    .single()

  if (teamError) throw teamError

  return {
    ...team,
    members_count: team.members[0].count
  }
}