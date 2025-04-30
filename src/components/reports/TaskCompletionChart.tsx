'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export default function TaskCompletionChart({ data }: { data: any[] }) {
  const chartData = data.reduce((acc, task) => {
    const date = format(new Date(task.created_at), 'yyyy-MM-dd')
    const existing = acc.find((item) => item.date === date)
    
    if (existing) {
      existing.total += 1
      if (task.status === 'completed') existing.completed += 1
    } else {
      acc.push({
        date,
        total: 1,
        completed: task.status === 'completed' ? 1 : 0
      })
    }
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" name="Total Tasks" />
        <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
      </BarChart>
    </ResponsiveContainer>
  )
}