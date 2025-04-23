import { supabase } from "@/utils/supabase/client";
import { Task } from "./types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";



export const createTask = async (task: Omit<Task, 'id'>) => {
    const supabase = createClientComponentClient()
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      user_id: session.user.id  // Make sure to include user_id
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error details:', error)
    throw new Error(error.message)
  }

  return {data,error}
}
export async function getTasks(userId: string) {
  return await supabase.from('tasks').select('*').eq('assigned_to', userId);
}

export async function updateTask(id: number, updates: Partial<Task>) {
  return await supabase.from('tasks').update(updates).eq('id', id);
}

export async function deleteTask(id: number) {
  return await supabase.from('tasks').delete().eq('id', id);
}




//   import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// export const createTask = async (task: Omit<Task, 'id'>) => {
//   const supabase = createClientComponentClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) throw new Error('User not authenticated')

//   const { data, error } = await supabase
//     .from('tasks')
//     .insert({
//       ...task,
//       created_by: user.id,
//       assigned_to: task.assigned_to || user.id
//     })
//     .select()
//     .single()

//   if (error) throw error
//   return data
// }

// export const updateTask = async (task: Partial<Task> & { id: string }) => {
//   const supabase = createClientComponentClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) throw new Error('User not authenticated')

//   const { data, error } = await supabase
//     .from('tasks')
//     .update(task)
//     .eq('id', task.id)
//     .eq('created_by', user.id) // Ensure user owns the task
//     .select()
//     .single()

//   if (error) throw error
//   return data
// }

// export const deleteTask = async (taskId: string) => {
//   const supabase = createClientComponentClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) throw new Error('User not authenticated')

//   const { error } = await supabase
//     .from('tasks')
//     .delete()
//     .eq('id', taskId)
//     .eq('created_by', user.id) // Ensure user owns the task

//   if (error) throw error
// }