// app/dashboard/projects/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FiFolder, FiPlus, FiUsers, FiCheckCircle, FiClock, FiAlertTriangle, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}

type Project = {
  id: string
  name: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed'
  start_date: string
  end_date: string
  tasks_count: number
  completed_tasks: number
  team_members: { id: string; avatar_url: string | null }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          status,
          start_date,
          end_date,
          tasks:tasks!tasks_project_id_fkey (
            id,
            status
          ),
          team_members:project_members!project_members_project_id_fkey (
            user:profiles (
              id,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });
      
        if (error) throw error


        // Transform the data to include counts
        const formattedProjects = data?.map(project => ({
          ...project,
          tasks_count: project.tasks?.length || 0,
          completed_tasks: project.tasks?.filter(t => t.status === 'completed').length || 0,
          team_members: project.team_members?.map(tm => tm.user) || []
        })) || []

        setProjects(formattedProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const getStatusDetails = (status: string, endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)

    switch (status) {
      case 'completed':
        return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> }
      case 'in_progress':
        return end < now
          ? { text: 'Overdue', color: 'bg-red-100 text-red-800', icon: <FiAlertTriangle /> }
          : { text: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: <FiClock /> }
      default:
        return { text: 'Not Started', color: 'bg-gray-100 text-gray-800', icon: <FiClock /> }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiFolder size={24} />
          Projects
        </h1>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus size={18} />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiFolder size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mt-2">Get started by creating your first project</p>
          <Link
            href="/dashboard/projects/new"
            className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus size={18} className="mr-2" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const status = getStatusDetails(project.status, project.end_date)
            const progress = project.tasks_count > 0
              ? Math.round((project.completed_tasks / project.tasks_count) * 100)
              : 0

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon}
                      <span className="ml-1">{status.text}</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {project.team_members.slice(0, 4).map(member => (
                        member.avatar_url ? (
                          <img
                            key={member.id}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src={member.avatar_url}
                            alt="Team member"
                          />
                        ) : (
                          <div
                            key={member.id}
                            className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-500"
                          >
                            <FiUser size={14} />
                          </div>
                        )
                      ))}
                      {project.team_members.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{project.team_members.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {project.completed_tasks}/{project.tasks_count} tasks
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-200">
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}