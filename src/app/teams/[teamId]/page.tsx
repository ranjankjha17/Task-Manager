// app/teams/[teamId]/page.tsx
'use client'

import { getTeamMembers, getTeamDetails } from '@/lib/db/teams'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TeamDetailsPage() {
  const { teamId } = useParams()
  const [team, setTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const [teamData, membersData] = await Promise.all([
          getTeamDetails(teamId as string),
          getTeamMembers(teamId as string)
        ])
        setTeam(teamData)
        setMembers(membersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team data')
      } finally {
        setLoading(false)
      }
    }
    loadTeamData()
  }, [teamId])

  if (loading) return <div className="p-4">Loading team data...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!team) return <div className="p-4">Team not found</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/teams" className="text-gray-600 hover:text-gray-900">
          &larr; Back to Teams
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{team.name}</h1>
        <p className="text-gray-600 mb-4">{team.description}</p>
        <div className="flex space-x-4">
          <Link 
            href={`/teams/${teamId}/members`} 
            className="btn-secondary"
          >
            Manage Members
          </Link>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="space-y-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {member.user.full_name || member.user.username}
                </p>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                member.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                member.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}