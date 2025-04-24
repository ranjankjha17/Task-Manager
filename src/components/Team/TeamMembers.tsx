// components/Team/TeamMembers.tsx
'use client'

import { getTeamMembers, addTeamMember, removeTeamMember } from '@/lib/db/teams'
import { useEffect, useState } from 'react'

export default function TeamMembers({ teamId }: { teamId: string }) {
  const [members, setMembers] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getTeamMembers(teamId)
        setMembers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load members')
      }
    }
    loadMembers()
  }, [teamId])

  const handleAddMember = async () => {
    if (!email) return
    
    setIsLoading(true)
    setError(null)

    try {
      // First find user by email
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (!user) throw new Error('User not found')

      // Add to team
      await addTeamMember({
        team_id: teamId,
        user_id: user.id,
        role: 'member'
      })

      // Refresh members list
      const data = await getTeamMembers(teamId)
      setMembers(data)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    
    setIsLoading(true)
    setError(null)

    try {
      await removeTeamMember(memberId)
      setMembers(members.filter(m => m.id !== memberId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h3>Team Members</h3>
      
      {error && <div className="error">{error}</div>}

      <div className="space-y-2">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between">
            <div>
              {member.user.full_name || member.user.username}
              <span className="role-badge">{member.role}</span>
            </div>
            <button 
              onClick={() => handleRemoveMember(member.id)}
              disabled={isLoading}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
        />
        <button 
          onClick={handleAddMember}
          disabled={isLoading || !email}
        >
          Add Member
        </button>
      </div>
    </div>
  )
}