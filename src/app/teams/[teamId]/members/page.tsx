// app/teams/[teamId]/members/page.tsx
'use client'

import TeamMembers from '@/components/Team/TeamMembers'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function TeamMembersPage() {
  const { teamId } = useParams()

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/teams/${teamId}`} className="text-gray-600 hover:text-gray-900">
          &larr; Back to Team
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Team Members</h1>
      <TeamMembers teamId={teamId as string} />
    </div>
  )
}