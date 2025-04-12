// app/admin/layout.tsx
import Footer from '@/components/custom/Footer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Navbar if needed */}
      <main className="flex-grow">{children}</main>
      <Footer footerClasses="bottom-0 w-full py-1 text-right px-4 text-xs text-gray-600 bg-white border-t border-gray-200 overflow-hidden" linkClasses="text-red-600 hover:underline" />
    </div>
  )
}
