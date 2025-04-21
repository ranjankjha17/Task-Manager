// 'use client'

// import { createTask, updateTask } from '@/lib/db/tasks'
// import { Task, TaskStatus } from '@/lib/db/types'
// import { useState } from 'react'
// import { FiCalendar, FiEdit2, FiSave, FiPlusCircle } from 'react-icons/fi'

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
//     due_date: task?.due_date || '',
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
//         const updatePayload: Partial<Task> = {
//           id: task.id,
//           title: formData.title,
//           description: formData.description,
//           status: formData.status,
//           priority: formData.priority,
//           due_date: formData.due_date
//         }
//         await updateTask(updatePayload as Task)
//       } else {
//         await createTask({
//           title: formData.title,
//           description: formData.description,
//           status: formData.status,
//           priority: formData.priority,
//           due_date: formData.due_date,
//         } as Omit<Task, 'id'>)
//       }
//       onSubmitSuccess?.()
//     } catch (error) {
//       console.error('Error saving task:', error)
//       setError(error instanceof Error ? error.message : 'Failed to save task')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, due_date: e.target.value }))
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         {task ? (
//           <>
//             <FiEdit2 className="text-indigo-600" />
//             Edit Task
//           </>
//         ) : (
//           <>
//             <FiPlusCircle className="text-indigo-600" />
//             Create New Task
//           </>
//         )}
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && (
//           <div className="p-4 bg-red-50 rounded-lg border border-red-200">
//             <p className="text-red-600 font-medium">{error}</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Title Field */}
//           <div className="md:col-span-2">
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//               Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="title"
//               name="title"
//               type="text"
//               required
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//               placeholder="Enter task title"
//             />
//           </div>

//           {/* Description Field */}
//           <div className="md:col-span-2">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               rows={3}
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//               placeholder="Describe the task details"
//             />
//           </div>

//           {/* Status Field */}
//           <div>
//             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//               Status <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//             >
//               <option value="todo">To-Do</option>
//               <option value="progress">In Progress</option>
//               <option value="done">Done</option>
//             </select>
//           </div>

//           {/* Priority Field */}
//           <div>
//             <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
//               Priority
//             </label>
//             <select
//               id="priority"
//               name="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           {/* Due Date Field */}
//           <div className="relative">
//             <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
//               Due Date
//             </label>
//             <div className="relative">
//               <input
//                 id="due_date"
//                 name="due_date"
//                 type="date"
//                 value={formData.due_date}
//                 onChange={handleDateChange}
//                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//               />
//               <FiCalendar className="absolute left-3 top-3 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FiSave className="mr-2" />
//                 {task ? 'Update Task' : 'Create Task'}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }






'use client'

import TaskFormActions from '@/components/TaskForm/TaskFormActions'
import TaskFormError from '@/components/TaskForm/TaskFormError'
import TaskFormFields from '@/components/TaskForm/TaskFormFields'
import TaskFormHeader from '@/components/TaskForm/TaskFormHeader'
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