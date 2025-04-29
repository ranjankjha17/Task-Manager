"use client"

import { Draggable } from '@hello-pangea/dnd'
import { Task } from '@/lib/db/types';
import ProgressBar from '../UI/ProgressBar';

export const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-2 bg-white rounded shadow border-l-4 ${
            task.priority === 'high' ? 'border-red-500' :
            task.priority === 'medium' ? 'border-yellow-500' :
            'border-blue-500'
          } ${
            snapshot.isDragging ? 'shadow-lg transform rotate-2' : ''
          }`}
        >
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <ProgressBar value={task.progress} className="h-2" />
          </div>
        </div>
      )}
    </Draggable>
  )
}