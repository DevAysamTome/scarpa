'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiImage,
  FiGrid,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiInfo
} from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { AiFillProduct } from 'react-icons/ai'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: <FiHome className="w-5 h-5" />
  },
  {
    href: '/dashboard/products',
    label: 'المنتجات',
    icon: <AiFillProduct className="w-5 h-5" />
  },
  {
    href: '/dashboard/orders',
    label: 'الطلبات',
    icon: <FiShoppingBag className="w-5 h-5" />
  },
  {
    href: '/dashboard/customers',
    label: 'العملاء',
    icon: <FiUsers className="w-5 h-5" />
  },
  {
    href: '/dashboard/carousels',
    label: 'البانر',
    icon: <FiImage className="w-5 h-5" />
  },
  {
    href: '/dashboard/categories',
    label: 'الفئات',
    icon: <FiGrid className="w-5 h-5" />
  },
  {
    href: '/dashboard/about',
    label: 'من نحن',
    icon: <FiInfo className="w-5 h-5" />
  },
  {
    href: '/dashboard/content',
    label: 'إدارة المحتوى',
    icon: <FiFileText className="w-5 h-5" />
  },
  {
    href: '/dashboard/settings',
    label: 'الإعدادات',
    icon: <FiSettings className="w-5 h-5" />
  }
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen dark:bg-dark-card  ">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 w-64 h-screen transition-transform dark:bg-dark-card bg-white ",
          !isSidebarOpen && "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 ">
          <h1 className="text-xl font-bold text-primary-600 font-arabic">لوحة التحكم</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:dark:bg-dark-card lg:hidden"
          >
            <FiX className="w-5 h-5 dark:text-dark-foreground" />
          </button>
        </div>
        <div className="py-4 overflow-y-auto">
          <nav className="space-y-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-gray-100 hover:text-secondary-900"
                )}
              >
                {item.icon}
                <span className="font-arabic">{item.label}</span>
              </Link>
            ))}
            <button 
              className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
              onClick={() => {/* Add logout logic */}}
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-arabic">تسجيل الخروج</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:mr-64" : ""
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 dark:bg-dark-card border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 dark:bg-dark-card lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
} 