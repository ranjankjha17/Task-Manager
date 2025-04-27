// components/reports/TaskStatusChart.tsx
'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function TaskStatusChart({ data }: { data: any[] }) {
  const statusData = data.reduce((acc, task) => {
    const existing = acc.find((item) => item.name === task.status)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: task.status, value: 1 })
    }
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} tasks`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}