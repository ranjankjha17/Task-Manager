// 'use client'

// import TeamMembers from '@/components/Team/TeamMembers'
// import { getUserTeams } from '@/lib/db/teams'
// import { useEffect, useState } from 'react'

// export default function TeamsDashboard() {
//   const [teams, setTeams] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const loadTeams = async () => {
//       try {
//         const data = await getUserTeams()
//         setTeams(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load teams')
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadTeams()
//   }, [])

//   if (loading) return <div>Loading...</div>
//   if (error) return <div>Error: {error}</div>

//   return (
//     <div>
//       <h1>Your Teams</h1>
//       {teams.map(team => (
//         <div key={team.id}>
//           <h2>{team.name}</h2>
//           <p>{team.description}</p>
//           <TeamMembers teamId={team.id} />
//         </div>
//       ))}
//     </div>
//   )
// }



// app/teams/page.tsx
'use client'

import { getUserTeams } from '@/lib/db/teams'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TeamsPage() {
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
  if (loading) return <div className="p-4">Loading teams...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Teams</h1>
        <Link href="/teams/create" className="btn-primary">
          Create New Team
        </Link>
      </div>

      {teams?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any teams yet</p>
          <Link href="/teams/create" className="btn-primary">
            Create Your First Team
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(team => (
            <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <Link href={`/teams/${team.id}`} className="block">
                <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
                <p className="text-gray-600 mb-3">{team.description || 'No description'}</p>
                <div className="text-sm text-gray-500">
                  Members: {team.members_count || 1}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}