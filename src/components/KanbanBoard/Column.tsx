"use client"

import { Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'
import { Task } from '@/lib/db/types'

export const KanbanColumn = ({
  id,
  title,
  tasks
}: {
  id: string
  title: string
  tasks: Task[]
}) => {
  return (
    <div className="flex-1 min-w-[300px]">
      <h2 className="font-semibold text-lg mb-4 sticky top-0 bg-white py-2">
        {title} ({tasks.length})
      </h2>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 h-full"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}