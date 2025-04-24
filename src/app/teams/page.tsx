'use client'

import TeamMembers from '@/components/Team/TeamMembers'
import { getUserTeams } from '@/lib/db/teams'
import { useEffect, useState } from 'react'

export default function TeamsDashboard() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await getUserTeams()
        setTeams(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teams')
      } finally {
        setLoading(false)
      }
    }
    loadTeams()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Your Teams</h1>
      {teams.map(team => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>{team.description}</p>
          <TeamMembers teamId={team.id} />
        </div>
      ))}
    </div>
  )
}