'use client'

import { FiCalendar } from 'react-icons/fi'
import { Task, TaskStatus } from '@/lib/db/types'

export default function TaskFormFields({
  formData,
  onFieldChange
}: {
  formData: Partial<Task>
  onFieldChange: (name: string, value: string) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onFieldChange(e.target.name, e.target.value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter task title"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Describe the task details"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
          <option value="todo">To-Do</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="relative">
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <div className="relative">
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <FiCalendar className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
    </div>
  )
}