"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import ProgressBar from '../UI/ProgressBar'
interface TaskFormProps {
  onClose: () => void;
}

export const TaskForm = ({ onClose }: TaskFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setProgress(30) // Initial progress
    
    const supabase = createClientComponentClient()
    
    try {
      setProgress(60) // Midway progress
      const { error: supabaseError } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          priority,
          status: 'todo',
          progress: 0 // Initial progress for new task
        })
      
      if (supabaseError) throw supabaseError
      
      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setProgress(100) // Complete progress
      
      // Notify parent if needed
      if (onTaskAdded) onTaskAdded()
      
      // Reset progress after success
      setTimeout(() => setProgress(0), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      setProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Task</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {progress > 0 && progress < 100 && (
        <div className="mb-4">
          <ProgressBar value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            Saving your task... {progress}%
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add details about this task"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Progress
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                id="progress"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-600 w-10">{progress}%</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Task...
            </span>
          ) : (
            'Create Task'
          )}
        </button>
      </form>
    </div>
  )
}