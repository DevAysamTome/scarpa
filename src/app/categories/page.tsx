'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { FiGrid } from 'react-icons/fi'

interface Category {
  id: string
  name: string
  image: string
  description: string
  active: boolean
  createdAt: string
  imageUrl: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'))
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[]
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <FiGrid className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold">الأقسام</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div className="relative h-48">
                <img
                  src={category.image || category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                <p className="text-secondary-600">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 