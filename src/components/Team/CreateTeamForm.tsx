// components/Team/CreateTeamForm.tsx
'use client'

import { createTeam } from '@/lib/db/teams'
import { useState } from 'react'

export default function CreateTeamForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createTeam({ name, description })
      // Handle success (redirect or refresh)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label htmlFor="name">Team Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  )
}