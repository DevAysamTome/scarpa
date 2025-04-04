'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiSun, FiMoon, FiHeart } from 'react-icons/fi'
import { ShoppingCart } from '@/components/shared/shopping-cart'
import { usePathname } from 'next/navigation'
import { useFavorites } from '@/contexts/favorites-context'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { favoritesCount } = useFavorites()
  const isDark = theme === 'dark'

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b",
      isDark 
        ? "bg-dark-card/80 border-dark-border" 
        : "dark:bg-dark-card dark:border-dark-border"
    )}>
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
              className={cn(
                "font-arabic",
                pathname === '/products' 
                  ? "text-primary-600" 
                  : isDark 
                    ? "text-dark-foreground hover:text-primary-600" 
                    : "text-secondary-600 hover:text-primary-600"
              )}
            >
              المنتجات
            </Link>
            <Link 
              href="/categories"
              className={cn(
                "font-arabic",
                pathname === '/categories' 
                  ? "text-primary-600" 
                  : isDark 
                    ? "text-dark-foreground hover:text-primary-600" 
                    : "text-secondary-600 hover:text-primary-600"
              )}
            >
              الفئات
            </Link>
            <Link 
              href="/about"
              className={cn(
                "font-arabic",
                pathname === '/about' 
                  ? "text-primary-600" 
                  : isDark 
                    ? "text-dark-foreground hover:text-primary-600" 
                    : "text-secondary-600 hover:text-primary-600"
              )}
            >
              عن الشركة
            </Link>
            <Link 
              href="/contact"
              className={cn(
                "font-arabic",
                pathname === '/contact' 
                  ? "text-primary-600" 
                  : isDark 
                    ? "text-dark-foreground hover:text-primary-600" 
                    : "text-secondary-600 hover:text-primary-600"
              )}
            >
              اتصل بنا
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/favorites"
              className={cn(
                "relative p-2 transition-colors",
                isDark ? "hover:text-primary-400" : "hover:text-primary-600"
              )}
            >
              <FiHeart className="w-6 h-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <ShoppingCart />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2 rounded-full",
                isDark 
                  ? "hover:bg-dark-secondary-100" 
                  : "hover:bg-secondary-100"
              )}
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-full",
                isDark 
                  ? "hover:bg-dark-secondary-100" 
                  : "hover:bg-secondary-100"
              )}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={cn(
            "md:hidden py-4",
            isDark ? "border-t border-dark-border" : "border-t border-secondary-200"
          )}>
            <div className="flex flex-col space-y-4">
              <Link
                href="/products"
                className={cn(
                  "font-arabic",
                  isDark 
                    ? "text-dark-foreground hover:text-primary-400" 
                    : "text-secondary-700 hover:text-primary-600"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link
                href="/categories"
                className={cn(
                  "font-arabic",
                  isDark 
                    ? "text-dark-foreground hover:text-primary-400" 
                    : "text-secondary-700 hover:text-primary-600"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                الفئات
              </Link>
              <Link
                href="/about"
                className={cn(
                  "font-arabic",
                  isDark 
                    ? "text-dark-foreground hover:text-primary-400" 
                    : "text-secondary-700 hover:text-primary-600"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                عن الشركة
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "font-arabic",
                  isDark 
                    ? "text-dark-foreground hover:text-primary-400" 
                    : "text-secondary-700 hover:text-primary-600"
                )}
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