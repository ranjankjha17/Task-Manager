import { supabase } from "@/utils/supabase/client";
import { Task } from "./types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createTask = async (task: Omit<Task, 'id'>) => {
    const supabase = createClientComponentClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      user_id: session.user.id
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