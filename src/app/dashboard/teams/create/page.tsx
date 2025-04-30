'use client'

import CreateTeamForm from '@/components/Team/CreateTeamForm'
import Link from 'next/link'

export default function CreateTeamPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/teams" className="text-gray-600 hover:text-gray-900">
          &larr; Back to Teams
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Create New Team</h1>
      <CreateTeamForm />
    </div>
  )
}