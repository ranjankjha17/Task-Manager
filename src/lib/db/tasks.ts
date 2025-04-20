import { supabase } from "@/utils/supabase/client";
import { Task } from "./types";


export async function createTask(task: Task) {
    const { data, error } = await supabase.from('tasks').insert(task);
    return { data, error };
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