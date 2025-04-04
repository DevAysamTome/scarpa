'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiHome, FiShoppingBag, FiUsers, FiBox, FiTag, FiImage, FiSettings, FiLogOut } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const navigation = [
    { name: 'الرئيسية', href: '/dashboard', icon: FiHome },
    { name: 'الطلبات', href: '/dashboard/orders', icon: FiShoppingBag },
    { name: 'العملاء', href: '/dashboard/customers', icon: FiUsers },
    { name: 'المنتجات', href: '/dashboard/products', icon: FiBox },
    { name: 'التصنيفات', href: '/dashboard/categories', icon: FiTag },
    { name: 'الكراسل', href: '/dashboard/carousels', icon: FiImage },
    { name: 'الإعدادات', href: '/dashboard/settings', icon: FiSettings },
  ]

  return (
    <div className={cn("min-h-screen", isDark ? "bg-dark-background" : "bg-gray-50")}>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className={cn("fixed inset-0 z-40 lg:hidden", isDark ? "bg-gray-900 bg-opacity-75" : "bg-gray-600 bg-opacity-75")}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 shadow-lg transform transition-transform duration-200 ease-in-out",
        isDark ? "bg-dark-card border-l dark:border-dark-border" : "bg-white border-l border-secondary-200",
        isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className={cn("flex items-center justify-between h-16 px-4", isDark ? "border-b border-dark-border" : "border-b border-secondary-200")}>
            <h2 className={cn("text-xl font-bold", isDark ? "text-dark-foreground" : "text-gray-800")}>لوحة التحكم</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={cn("lg:hidden p-2 rounded-md", isDark ? "text-gray-400 hover:text-gray-300 hover:bg-dark-secondary-100" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100")}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-600 text-white"
                      : isDark 
                        ? "text-gray-300 hover:bg-dark-secondary-100" 
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5 ml-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className={cn("p-4", isDark ? "border-t border-dark-border" : "border-t border-secondary-200")}>
            <button
              onClick={() => {/* Add logout logic */}}
              className={cn("flex items-center w-full px-4 py-2 text-sm font-medium rounded-md", isDark ? "text-red-400 hover:bg-dark-secondary-100" : "text-red-600 hover:bg-red-50")}
            >
              <FiLogOut className="w-5 h-5 ml-3" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className={cn("sticky top-0 z-30 flex items-center h-16 px-4 shadow-sm", isDark ? "bg-dark-card border-b border-dark-border" : "bg-white border-b border-secondary-200")}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={cn("p-2 rounded-md lg:hidden", isDark ? "text-gray-400 hover:text-gray-300 hover:bg-dark-secondary-100" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100")}
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </header>

        {/* Page content */}
        <main className={cn("flex-1 p-4 overflow-x-hidden", isDark ? "bg-dark-background" : "bg-gray-50")}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 