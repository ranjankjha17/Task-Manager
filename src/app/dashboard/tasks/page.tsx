// app/tasks/page.tsx
import TaskList from '@/components/TaskList'
import { supabase } from '@/utils/supabase/client'

export default async function TasksPage() {
  
  const { data: tasks,error } = await supabase
    .from('tasks')
    .select('*')
    .order('id', { ascending: false })

    if (error) {
      console.error(error);
      return <div>Error fetching Task List</div>;
    }
  
  return <TaskList tasks={tasks || []} />
}