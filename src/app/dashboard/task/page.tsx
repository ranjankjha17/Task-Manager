'use client'

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
import { KanbanBoard } from '@/components/KanbanBoard/KanbanBoard'
import { TaskForm } from '@/components/KanbanBoard/TaskForm'
import { Dialog } from "@headlessui/react"; // We use Headless UI for modal
import { useState } from 'react';

export default async function TasksPage() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);


  // const supabase = createServerComponentClient({ cookies })
  const supabase=createClientComponentClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Create Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Removed direct TaskForm from here */}
          <div className="lg:col-span-3">
            <KanbanBoard tasks={tasks || []} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">
              Create Task
            </Dialog.Title>

            {/* Task Form */}
            <TaskForm onClose={closeModal} />

          </Dialog.Panel>
        </div>
      </Dialog>
    </div>

  )
}