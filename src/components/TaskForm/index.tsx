// 'use client'

// import { Task } from "@/lib/db/types"
// import TaskFormActions from "./TaskFormActions"

// // Add this to your existing TaskForm props
// interface TaskFormProps {
//     task?: Task
//     onSubmitSuccess?: () => void
//     onCancel?: () => void
// }

// // Add this to the return section, right before the submit button
// export default function TaskForm({ task, onSubmitSuccess, onCancel }: TaskFormProps) {
//     return (
//         <div className="flex justify-end pt-4 space-x-3">
//             {onCancel && (
//                 <button
//                     type="button"
//                     onClick={onCancel}
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                     Cancel
//                 </button>
//             )}
//             <TaskFormActions isSubmitting={isSubmitting} isEdit={!!task} />
//         </div>
//     )
// }




'use client'

import { useState } from 'react'
import TaskFormHeader from './TaskFormHeader'
import TaskFormError from './TaskFormError'
import TaskFormFields from './TaskFormFields'
import TaskFormActions from './TaskFormActions'
import { Task, TaskStatus } from '@/lib/db/types'
import { createTask, updateTask } from '@/lib/db/tasks'

export default function TaskForm({
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
    due_date: task?.due_date,
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
        // console.log("update data",task)
        // await updateTask({            
        //   id: task.id,
        //   ...formData
        // } as Task)
        await updateTask(task.id, formData)

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TaskFormHeader isEdit={!!task} />
        <TaskFormError error={error} />
        <TaskFormFields 
          formData={formData} 
          onFieldChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))} 
        />
        <TaskFormActions isSubmitting={isSubmitting} isEdit={!!task} />
      </form>
    </div>
  )
}