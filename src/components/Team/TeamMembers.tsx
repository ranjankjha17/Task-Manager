'use client'

import { useEffect, useState } from 'react'
import { getTeamMembers, addTeamMember, removeTeamMember } from '@/lib/db/teams'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FiUserPlus, FiTrash2, FiMail, FiUser, FiAward } from 'react-icons/fi'

export default function TeamMembers({ teamId }: { teamId: string }) {
  const [members, setMembers] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const supabase = createClientComponentClient()

  const loadMembers = async () => {
    try {
      setIsLoading(true)
      const data = await getTeamMembers(teamId)
      setMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [teamId])

  const handleAddMember = async () => {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, email')
        .eq('email', email)
        .single()

      if (userError || !user) throw new Error('User not found')

      await addTeamMember({
        team_id: teamId,
        user_id: user.id,
        role: 'member',
      })

      setEmail('')
      setIsAdding(false)
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    const confirmed = confirm('Are you sure you want to remove this member?')
    if (!confirmed) return

    setIsLoading(true)
    setError(null)

    try {
      await removeTeamMember(memberId)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiUserPlus size={18} />
          {isAdding ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddMember}
              disabled={isLoading || !email}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                isLoading || !email
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Invite'
              )}
            </button>
          </div>
        </div>
      )}

      {isLoading && !members.length ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                  {member.user.avatar_url ? (
                    <img
                      src={member.user.avatar_url}
                      alt={member.user.full_name || member.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser size={18} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {member.user.full_name || member.user.username}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{member.user.email}</span>
                    <span className="flex items-center gap-1">
                      {member.role === 'owner' && (
                        <FiAward size={14} className="text-yellow-500" />
                      )}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          member.role === 'owner'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {member.role}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {member.role !== 'owner' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Remove member"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && members.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FiUser size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No team members yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add your first member
          </button>
        </div>
      )}
    </div>
  )
}
