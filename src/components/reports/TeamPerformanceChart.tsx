// components/reports/TeamPerformanceChart.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TeamPerformanceChart({ data }: { data: any[] }) {
  const performanceData = data.map(member => ({
    name: member.full_name || `User ${member.id.slice(0, 6)}`,
    completed: member.completed_tasks || 0,
    pending: (member.total_tasks || 0) - (member.completed_tasks || 0)
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={performanceData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#82ca9d" name="Completed Tasks" />
        <Bar dataKey="pending" fill="#8884d8" name="Pending Tasks" />
      </BarChart>
    </ResponsiveContainer>
  )
}