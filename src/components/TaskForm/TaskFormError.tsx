'use client'

export default function TaskFormError({ error }: { error: string | null }) {
    if (!error) return null
    
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }