'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon, FiHeart } from 'react-icons/fi'
import { ShoppingCart } from '@/components/shared/shopping-cart'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600 font-arabic">
            سكاربا
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link 
              href="/products"
              className={`font-arabic ${
                pathname === '/products' ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              المنتجات
            </Link>
            <Link 
              href="/categories"
              className={`font-arabic ${
                pathname === '/categories' ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              الفئات
            </Link>
            <Link 
              href="/about"
              className={`font-arabic ${
                pathname === '/about' ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              عن الشركة
            </Link>
            <Link 
              href="/contact"
              className={`font-arabic ${
                pathname === '/contact' ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              اتصل بنا
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/favorites"
              className="p-2 rounded-full hover:bg-secondary-100 relative"
            >
              <FiHeart size={20} />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <ShoppingCart />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-secondary-100"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-secondary-100"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-secondary-700 hover:text-primary-600 font-arabic"
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link
                href="/categories"
                className="text-secondary-700 hover:text-primary-600 font-arabic"
                onClick={() => setIsMenuOpen(false)}
              >
                الفئات
              </Link>
              <Link
                href="/about"
                className="text-secondary-700 hover:text-primary-600 font-arabic"
                onClick={() => setIsMenuOpen(false)}
              >
                عن الشركة
              </Link>
              <Link
                href="/contact"
                className="text-secondary-700 hover:text-primary-600 font-arabic"
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 