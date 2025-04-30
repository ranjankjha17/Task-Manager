'use client'

import TaskForm from '@/components/TaskForm'
import TaskFormActions from '@/components/TaskForm/TaskFormActions'
import TaskFormError from '@/components/TaskForm/TaskFormError'
import TaskFormFields from '@/components/TaskForm/TaskFormFields'
import TaskFormHeader from '@/components/TaskForm/TaskFormHeader'
import { createTask, updateTask } from '@/lib/db/tasks'
import { Task, TaskStatus } from '@/lib/db/types'
import { useState } from 'react'

export default function TaskForm2({
  task,
  onSubmitSuccess,
}: {
  task?: Task
  onSubmitSuccess?: () => void
}) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: task?.title || '',
    description: task?.description || '',
    status: (task?.status as TaskStatus) || 'todo',
    priority: task?.priority || 'low',
    due_date: task?.due_date || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!formData.title) throw new Error('Title is required')

      if (task?.id) {
        await updateTask({
          id: task.id,
          ...formData
        } as Task)
      } else {
        await createTask(formData as Omit<Task, 'id'>)
      }
      onSubmitSuccess?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <TaskForm/>
  )
}


