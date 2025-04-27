// app/dashboard/reports/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { FiBarChart2, FiPieChart, FiCalendar, FiUsers, FiCheckCircle, FiFolder } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TaskCompletionChart from '@/components/reports/TaskCompletionChart'
import ProjectStatusChart from '@/components/reports/ProjectStatusChart'
import TeamPerformanceChart from '@/components/reports/TeamPerformanceChart'
import TaskStatusChart from '@/components/reports/TaskStatusChart'

export default function ReportsPage() {
    const supabase = createClientComponentClient()
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)))
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [reportType, setReportType] = useState<'tasks' | 'projects' | 'team'>('tasks')
    const [loading, setLoading] = useState(false)
    const [reportData, setReportData] = useState<any>(null)

    const fetchReportData = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from(reportType === 'team' ? 'profiles' : reportType)
                .select('*', { count: 'exact' })

            // Add date filtering for time-based reports
            if (reportType !== 'team') {
                query = query.gte('created_at', startDate.toISOString())
                    .lte('created_at', endDate.toISOString())
            }

            const { data, error, count } = await query

            if (error) throw error
            setReportData({ data, count })
        } catch (error) {
            console.error('Error fetching report data:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FiBarChart2 size={24} />
                    Reports
                </h1>
            </div>

            {/* Report Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as any)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="tasks">Tasks</option>
                            <option value="projects">Projects</option>
                            <option value="team">Team</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date)}
                            className="w-full p-2 border rounded-md"
                            minDate={startDate}
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={fetchReportData}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Display */}
            {reportData && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    {/* <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        {reportType === 'tasks' && <FiCheckCircle />}
                        {reportType === 'projects' && <FiFolder />}
                        {reportType === 'team' && <FiUsers />}
                        {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                    </h2>

                    <div className="mb-4">
                        <p className="text-sm text-gray-500">
                            Period: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            Total Records: {reportData.count}
                        </p>
                    </div> */}


          {/* // Replace the placeholder div with this chart section */}
                    {reportData && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                {reportType === 'tasks' && <FiCheckCircle />}
                                {reportType === 'projects' && <FiFolder />}
                                {reportType === 'team' && <FiUsers />}
                                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                            </h2>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">
                                    Period: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Total Records: {reportData.count}
                                </p>
                            </div>

                            {/* Dynamic Chart Display */}
                            <div className="h-96 space-y-8">
                                {reportType === 'tasks' && (
                                    <>
                                        <div className="h-80">
                                            <h3 className="text-lg font-medium mb-2">Task Completion Over Time</h3>
                                            <TaskCompletionChart data={reportData.data} />
                                        </div>
                                        <div className="h-80">
                                            <h3 className="text-lg font-medium mb-2">Task Status Distribution</h3>
                                            <TaskStatusChart data={reportData.data} />
                                        </div>
                                    </>
                                )}

                                {reportType === 'projects' && (
                                    <div className="h-80">
                                        <h3 className="text-lg font-medium mb-2">Project Status Breakdown</h3>
                                        <ProjectStatusChart data={reportData.data} />
                                    </div>
                                )}

                                {reportType === 'team' && (
                                    <div className="h-80">
                                        <h3 className="text-lg font-medium mb-2">Team Performance Metrics</h3>
                                        <TeamPerformanceChart data={reportData.data} />
                                    </div>
                                )}
                            </div>

                            {/* Data Table remains the same */}
                            <div className="mt-6 overflow-x-auto">
                                {/* ... existing table code ... */}
                            </div>
                        </div>
                    )}

                    {/* Data Table (simplified) */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.data.slice(0, 5).map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.name || item.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.status}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}