'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { ProductCard } from '@/components/shared/product-card'
import { use } from 'react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  categoryId: string
  sizes: string[]
  colors: string[]
  stock: number
  image: string
  category: string
  imageUrl: string
  active: boolean
}

interface Category {
  id: string
  name: string
  description: string
  image: string
  imageUrl: string
  active: boolean
}

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // Fetch category details
        const categoryDoc = await getDoc(doc(db, 'categories', id))
        if (categoryDoc.exists()) {
          setCategory({ id: categoryDoc.id, ...categoryDoc.data() } as Category)
        }

        // Fetch products for this category
        const productsQuery = query(
          collection(db, 'products'),
          where('category', '==', id)
        )
        const querySnapshot = await getDocs(productsQuery)
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching category and products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">القسم غير موجود</h1>
          <Link href="/categories" className="text-primary-600 hover:text-primary-700">
            العودة إلى الأقسام
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative h-64 rounded-lg overflow-hidden mb-4">
          <img
            src={category.image || category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{category.name}</h1>
          </div>
        </div>
        <p className="text-secondary-600 text-center max-w-2xl mx-auto">
          {category.description}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">المنتجات</h2>
          <Link
            href="/categories"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <span>جميع الأقسام</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-secondary-600">لا توجد منتجات في هذا القسم حالياً</p>
        </div>
      )}
    </div>
  )
} 