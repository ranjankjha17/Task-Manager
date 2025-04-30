import Sidebar from '@/components/Sidebar/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-64 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  )
}