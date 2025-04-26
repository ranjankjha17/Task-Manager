// components/StatusBadge.tsx
import { FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi'

export default function StatusBadge({ 
  status,
  endDate
}: {
  status: string
  endDate: string
}) {
  const now = new Date()
  const end = new Date(endDate)
  
  const getStatusDetails = () => {
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

  const details = getStatusDetails()

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${details.color}`}>
      {details.icon}
      <span className="ml-1">{details.text}</span>
    </span>
  )
}