'use client'

import { FiEdit2, FiPlusCircle } from 'react-icons/fi'

export default function TaskFormHeader({ isEdit }: { isEdit: boolean }) {
  return (
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      {isEdit ? (
        <>
          <FiEdit2 className="text-indigo-600" />
          Edit Task
        </>
      ) : (
        <>
          <FiPlusCircle className="text-indigo-600" />
          Create New Task
        </>
      )}
    </h2>
  )
}