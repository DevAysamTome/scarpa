'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  FiHome,
  FiShoppingBag,
  FiGrid,
  FiUsers,
  FiShoppingCart,
  FiSettings,
  FiMenu,
  FiX,
} from 'react-icons/fi'

const navigation = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: FiHome },
  { name: 'المنتجات', href: '/dashboard/products', icon: FiShoppingBag },
  { name: 'الأقسام', href: '/dashboard/categories', icon: FiGrid },
  { name: 'الطلبات', href: '/dashboard/orders', icon: FiShoppingCart },
  { name: 'العملاء', href: '/dashboard/customers', icon: FiUsers },
  { name: 'الإعدادات', href: '/dashboard/settings', icon: FiSettings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="!flex !min-h-screen !pt-0 !flex-row bg-secondary-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white border-l border-secondary-200 transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`font-bold text-xl text-primary-600 ${!isSidebarOpen && 'hidden'}`}>
            سكاربا
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary-100"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-600 hover:bg-secondary-100'
                    }`}
                  >
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="font-arabic">{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarOpen ? 'mr-64' : 'mr-20'
        }`}
      >
        {children}
      </main>
    </div>
  )
} 