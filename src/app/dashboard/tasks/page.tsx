// app/tasks/page.tsx
import TaskList from '@/components/TaskList'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', session.user.id)  // Only fetch tasks for current user
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error);
    return <div>Error fetching Task List</div>;
  }

  return (
    <>
      <TaskList tasks={tasks || []} />
    </>
  )
}