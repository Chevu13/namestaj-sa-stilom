import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">{children}</main>
    </div>
  )
}
