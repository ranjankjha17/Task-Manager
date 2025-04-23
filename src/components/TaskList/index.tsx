'use client'

import { Task } from '@/lib/db/types'
import { FiEdit2, FiTrash2, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi'
import TaskForm from '@/components/TaskForm'
import { useState } from 'react'
import { deleteTask } from '@/lib/db/tasks'
import { useRouter } from 'next/navigation'

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
      router.refresh() // Re-fetches data from server
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingTask(null)
    router.refresh() // Re-fetches data from server
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null)
            setIsFormOpen(true)
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Task
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <TaskForm 
            task={editingTask} 
            onSubmitSuccess={handleFormSuccess} 
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      <div className="overflow-hidden sm:rounded-lg max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No tasks found. Create your first task!
            </li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <div className="flex-shrink-0 mr-4">
                      {task.status === 'done' ? (
                        <FiCheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <FiCircle className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {task.title}
                        </p>
                        {task.priority === 'high' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            High
                          </span>
                        )}
                        {task.priority === 'medium' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Medium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <FiClock className="flex-shrink-0 mr-1" />
                        <span>
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </span>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{task.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => task.id && handleDelete(task.id)}
                      className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}