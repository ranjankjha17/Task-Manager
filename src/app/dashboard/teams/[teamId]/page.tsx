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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md text-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-8 w-8 bg-blue-200 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading team data...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error loading team</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/dashboard/teams" className="text-blue-600 hover:text-blue-800 font-medium">
          Back to Teams
        </Link>
      </div>
    </div>
  )

  if (!team) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md text-center">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Team not found</h2>
        <p className="text-gray-600 mb-6">The team you're looking for doesn't exist or was deleted.</p>
        <Link href="/dashboard/teams" className="text-blue-600 hover:text-blue-800 font-medium">
          Back to Teams
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/teams" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Teams
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
                <p className="text-gray-600 max-w-2xl">{team.description}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link 
                  href={`/dashboard/teams/${teamId}/members`} 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Members
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {members.length} members
              </span>
            </div>

            <div className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {member.user.full_name ? 
                          member.user.full_name.charAt(0).toUpperCase() : 
                          member.user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.user.full_name || member.user.username}
                      </p>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    member.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                    member.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}