'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiShoppingBag, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { signOut } = useAuth()

  const menuItems = [
    { href: '/dashboard', label: 'لوحة التحكم', icon: FiHome },
    { href: '/dashboard/orders', label: 'الطلبات', icon: FiShoppingBag },
    { href: '/dashboard/customers', label: 'العملاء', icon: FiUsers },
    { href: '/dashboard/settings', label: 'الإعدادات', icon: FiSettings },
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white border-l border-secondary-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>
              لوحة التحكم
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-secondary-100 rounded-lg"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={signOut}
            className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg mt-8 w-full"
          >
            <FiLogOut className="w-5 h-5" />
            {isSidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'mr-64' : 'mr-20'
        }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
} 