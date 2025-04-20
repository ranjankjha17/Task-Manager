// 'use client'

// import { createTask, updateTask } from '@/lib/db/tasks'
// import { Task, TaskStatus } from '@/lib/db/types'
// import { useState } from 'react'

// export default function TaskForm({
//   task,
//   onSubmitSuccess,
// }: {
//   task?: Task
//   onSubmitSuccess?: () => void
// }) {
//   const [formData, setFormData] = useState<Partial<Task>>({
//     title: task?.title || '',
//     description: task?.description || '',
//     status: (task?.status as TaskStatus) || 'todo',
//     priority: task?.priority || 'low',
//     due_date: task?.due_date || '2025-04-30',
//     // created_by: task?.created_by || "f81d4fae-7dec-11d0-a765-00a0c91e6b99",
//     // assigned_to: task?.assigned_to || "f21d4fae-7dec-11d0-a765-00a0c91e6bf6",
//     // team_id: task?.team_id || 8956231456

//   })

//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsSubmitting(true)

//     try {
//       if (!formData.title) {
//         throw new Error('Title is required')
//       }

//       if (task?.id) {
//         await updateTask({ ...formData, id: task.id } as Task)
//       } else {
//         // if (!formData.created_by) {
//         //   throw new Error('Creator ID is required')
//         // }
//         await createTask(formData as Omit<Task, 'id'>)
//       }
//       onSubmitSuccess?.()
//     } catch (error) {
//       console.error('Error saving task:', error)
//       setError(error instanceof Error ? error.message : 'Failed to save task')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, due_date: e.target.value }))
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="rounded-md bg-red-50 p-4">
//           <div className="text-sm text-red-700">{error}</div>
//         </div>
//       )}

//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//           Title *
//         </label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           required
//           value={formData.title}
//           onChange={handleChange}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//         />
//       </div>

//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//           Description
//         </label>
//         <input
//           id="description"
//           name="description"
//           type="text"
//           value={formData.description}
//           onChange={handleChange}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//         />
//       </div>

//       <div>
//         <label htmlFor="status" className="block text-sm font-medium text-gray-700">
//           Status *
//         </label>
//         <select
//           id="status"
//           name="status"
//           value={formData.status}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//         >
//           <option value="todo">To-Do</option>
//           <option value="progress">In Progress</option>
//           <option value="done">Done</option>
//         </select>
//       </div>

//       <div>
//         <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
//           Priority
//         </label>
//         <select
//           id="priority"
//           name="priority"
//           value={formData.priority}
//           onChange={handleChange}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//         >
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//         </select>
//       </div>

//       <div>
//         <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
//           Due Date
//         </label>
//         <input
//           id="due_date"
//           name="due_date"
//           type="date"
//           value={formData.due_date}
//           onChange={handleDateChange}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//         />
//       </div>

//       {!task?.id && (
//         <>
//           <input type="hidden" name="created_by" value={formData.created_by} />
//           <input type="hidden" name="assigned_to" value={formData.assigned_to} />
//           <input type="hidden" name="team_id" value={formData.team_id} />
//         </>
//       )}

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
//       >
//         {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
//       </button>
//     </form>
//   )
// }






'use client'

import { createTask, updateTask } from '@/lib/db/tasks'
import { Task, TaskStatus } from '@/lib/db/types'
import { useState } from 'react'

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
    due_date: task?.due_date || '',
    // created_by: task?.created_by || '',
    // assigned_to: task?.assigned_to || '',
    // team_id: task?.team_id || undefined
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!formData.title) {
        throw new Error('Title is required')
      }

      if (task?.id) {
        const updatePayload: Partial<Task> = {
          id: task.id,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date
        }
        await updateTask(updatePayload as Task)
      } else {
        // if (!formData.created_by) {
        //   throw new Error('Creator ID is required')
        // }
        await createTask({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date,
          // created_by: formData.created_by,
          // assigned_to: formData.assigned_to,
          // team_id: formData.team_id
        } as Omit<Task, 'id'>)
      }
      onSubmitSuccess?.()
    } catch (error) {
      console.error('Error saving task:', error)
      setError(error instanceof Error ? error.message : 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, due_date: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="todo">To-Do</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {!task?.id && (
        <>
          <input type="hidden" name="created_by" value={formData.created_by} />
          <input type="hidden" name="assigned_to" value={formData.assigned_to} />
          <input type="hidden" name="team_id" value={formData.team_id?.toString()} />
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  )
}