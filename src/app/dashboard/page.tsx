'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FiCheckCircle, FiClock, FiList, FiUsers, FiCalendar, FiAlertTriangle } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    tasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    teamMembers: 0,
    upcomingDeadlines: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          tasksData,
          completedTasksData,
          overdueTasksData,
          teamMembersData,
          deadlinesData
        ] = await Promise.all([
          supabase.from('tasks').select('id', { count: 'exact' }),
          supabase.from('tasks').select('id', { count: 'exact' }).eq('status', 'completed'),
          supabase.from('tasks').select('id', { count: 'exact' }).lt('due_date', new Date().toISOString()).neq('status', 'completed'),
          supabase.from('team_members').select('id', { count: 'exact' }),
          supabase.from('tasks').select('id, title, due_date').gte('due_date', new Date().toISOString()).order('due_date', { ascending: true }).limit(5)
        ])

        setStats({
          tasks: tasksData.count || 0,
          completedTasks: completedTasksData.count || 0,
          overdueTasks: overdueTasksData.count || 0,
          teamMembers: teamMembersData.count || 0,
          upcomingDeadlines: deadlinesData.data || []
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<FiList className="text-blue-500" size={24} />}
          title="Total Tasks"
          value={stats.tasks}
          link="/dashboard/tasks"
        />
        <StatCard 
          icon={<FiCheckCircle className="text-green-500" size={24} />}
          title="Completed"
          value={stats.completedTasks}
          percentage={stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0}
        />
        <StatCard 
          icon={<FiAlertTriangle className="text-red-500" size={24} />}
          title="Overdue"
          value={stats.overdueTasks}
        />
        <StatCard 
          icon={<FiUsers className="text-purple-500" size={24} />}
          title="Team Members"
          value={stats.teamMembers}
          link="/dashboard/teams"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          <Link href="/dashboard/calendar" className="text-sm text-blue-600 hover:underline">
            View Calendar
          </Link>
        </div>
        
        {stats.upcomingDeadlines.length > 0 ? (
          <div className="space-y-3">
            {stats.upcomingDeadlines.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiClock className="text-gray-400" />
                  <span>{task.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(task.due_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming deadlines</p>
          </div>
        )}
      </div>

      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Activity feed will appear here</p>
        </div>
      </div> */}
    </div>
  )
}

function StatCard({ icon, title, value, percentage, link }: { 
  icon: React.ReactNode, 
  title: string, 
  value: number,
  percentage?: number,
  link?: string 
}) {
  const content = (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {percentage !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{percentage}% completed</p>
        </div>
      )}
    </div>
  )

  return link ? (
    <Link href={link} className="block">
      {content}
    </Link>
  ) : content
}