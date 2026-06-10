import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      {/* pt-14 na mobilnom zbog fiksnog top bara, lg:ml-64 za desktop sidebar */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}
