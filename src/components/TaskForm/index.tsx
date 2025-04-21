'use client'

import { Task } from "@/lib/db/types"
import TaskFormActions from "./TaskFormActions"

// Add this to your existing TaskForm props
interface TaskFormProps {
    task?: Task
    onSubmitSuccess?: () => void
    onCancel?: () => void
}

// Add this to the return section, right before the submit button
export default function TaskForm({ task, onSubmitSuccess, onCancel }: TaskFormProps) {
    return (
        <div className="flex justify-end pt-4 space-x-3">
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
            )}
            <TaskFormActions isSubmitting={isSubmitting} isEdit={!!task} />
        </div>
    )
}