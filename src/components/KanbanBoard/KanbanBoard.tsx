"use client"

import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import { useState } from 'react'
import { Task, TaskStatus } from '@/lib/db/types'
import { KanbanColumn } from './Column'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase=createClientComponentClient()
export const KanbanBoard = ({ tasks }: { tasks: Task[] }) => {
  const [tasksState, setTasksState] = useState<Task[]>(tasks)

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If dropped outside the list
    if (!destination) return

    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Find the task being dragged
    const task = tasksState.find(t => t.id === draggableId)
    if (!task) return

    // Determine new status based on the destination column
    const newStatus = destination.droppableId as TaskStatus

    // Update local state optimistically
    const newTasks = Array.from(tasksState)
    newTasks.splice(source.index, 1)
    newTasks.splice(destination.index, 0, {
      ...task,
      status: newStatus
    })

    setTasksState(newTasks)

    // Update in database
    try {
      await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', draggableId)
    } catch (error) {
      // Revert if update fails
      setTasksState(tasks)
      console.error('Error updating task status:', error)
    }
  }

  // Group tasks by status
  const tasksByStatus = {
    todo: tasksState.filter(task => task.status === 'todo'),
    'in-progress': tasksState.filter(task => task.status === 'progress'),
    done: tasksState.filter(task => task.status === 'done')
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        <KanbanColumn 
          id="todo" 
          title="To Do" 
          tasks={tasksByStatus.todo} 
        />
        <KanbanColumn 
          id="in-progress" 
          title="In Progress" 
          tasks={tasksByStatus['in-progress']} 
        />
        <KanbanColumn 
          id="done" 
          title="Done" 
          tasks={tasksByStatus.done} 
        />
      </div>
    </DragDropContext>
  )
}