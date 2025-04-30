'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiHome, 
  FiList, 
  FiCalendar,
  FiUsers,
  FiSettings,
  FiFileText,
  FiPieChart,
  FiClipboard
} from 'react-icons/fi'

const Sidebar = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { name: 'Tasks', href: '/dashboard/tasks', icon: <FiList /> },
    { name: 'Tasks Boards', href: '/dashboard/task', icon: <FiClipboard /> },
    { name: 'Projects', href: '/dashboard/projects', icon: <FiFileText /> },
    { name: 'Calendar', href: '/dashboard/calendar', icon: <FiCalendar /> },
    { name: 'Team', href: '/dashboard/teams', icon: <FiUsers /> },
    { name: 'Reports', href: '/dashboard/reports', icon: <FiPieChart /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings /> }
  ]

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 fixed left-0 top-0 p-4">
      <div className="mb-8 p-2">
        <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar