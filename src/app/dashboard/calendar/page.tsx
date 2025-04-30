'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { FiCalendar, FiPlus, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import Link from 'next/link'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { EventInput } from '@fullcalendar/core'

export default function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([])
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth')
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Fetch tasks with due dates
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, title, due_date, status')
          .not('due_date', 'is', null)

        // Fetch team events (if you have an events table)
        const { data: teamEvents } = await supabase
          .from('events')
          .select('id, title, start_date, end_date, type')

        // Transform data for FullCalendar
        const calendarEvents: EventInput[] = [
          (tasks?.map(task => ({
            id: `task-${task.id}`,
            title: task.title,
            start: task.due_date,
            allDay: true,
            extendedProps: { type: 'task' },
            color: task.status === 'completed' ? '#10B981' : 
                  new Date(task.due_date) < new Date() ? '#EF4444' : '#3B82F6',
            textColor: '#FFFFFF'
          })) || [])
          (teamEvents?.map(event => ({
            id: `event-${event.id}`,
            title: event.title,
            start: event.start_date,
            end: event.end_date,
            extendedProps: { type: 'event' },
            color: event.type === 'meeting' ? '#8B5CF6' : '#F59E0B'
          })) || [])
        ]

        setEvents(calendarEvents)
      } catch (error) {
        console.error('Error fetching calendar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarData()
  }, [])

  const handleEventClick = (clickInfo: any) => {
    const eventType = clickInfo.event.extendedProps.type
    const id = clickInfo.event.id.split('-')[1]
    
    if (eventType === 'task') {
      window.location.href = `/dashboard/tasks/${id}`
    } else if (eventType === 'event') {
      window.location.href = `/dashboard/events/${id}`
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
          <FiCalendar size={24} />
          Calendar
        </h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard/tasks/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus size={18} />
            New Task
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          views={{
            dayGridMonth: { buttonText: 'Month' },
            timeGridWeek: { buttonText: 'Week' },
            timeGridDay: { buttonText: 'Day' },
            listWeek: { buttonText: 'List' }
          }}
          events={events}
          eventClick={handleEventClick}
          height="70vh"
          nowIndicator
          editable
          selectable
          eventDisplay="block"
          eventContent={(eventInfo) => (
            <div className="p-1">
              <div className="flex items-center gap-1">
                {eventInfo.event.extendedProps.type === 'task' && (
                  eventInfo.event.backgroundColor === '#10B981' ? (
                    <FiCheckCircle size={14} />
                  ) : eventInfo.event.backgroundColor === '#EF4444' ? (
                    <FiAlertTriangle size={14} />
                  ) : null
                )}
                <span className="truncate">{eventInfo.event.title}</span>
              </div>
              {!eventInfo.event.allDay && (
                <div className="text-xs">
                  {eventInfo.timeText}
                </div>
              )}
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Legend</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <span>Upcoming Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <span>Completed Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            <span>Overdue Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
            <span>Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
            <span>Other Events</span>
          </div>
        </div>
      </div>
    </div>
  )
}