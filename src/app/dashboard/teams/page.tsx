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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-900">Loading your teams</h2>
        <p className="mt-1 text-gray-500">Just a moment while we gather your information</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mt-3 text-lg font-medium text-gray-900">Error loading teams</h2>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Teams</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all your teams in one place</p>
          </div>
          <Link 
            href="/dashboard/teams/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Team
          </Link>
        </div>

        {teams?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="text-center p-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No teams yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first team.</p>
              <div className="mt-6">
                <Link
                  href="/dashboard/teams/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Team
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <div key={team.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <Link href={`/dashboard/teams/${team.id}`} className="block">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-gray-900">{team.name}</h2>
                        <p className="text-sm text-gray-500">{team.members_count || 1} members</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {team.description || 'No description provided'}
                    </p>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {team.visibility || 'private'}
                      </span>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}