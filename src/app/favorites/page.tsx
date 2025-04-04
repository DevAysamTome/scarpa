'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ProductCard } from '@/components/shared/product-card'
import { FiHeart } from 'react-icons/fi'
import Link from 'next/link'
import { useFavorites } from '@/contexts/favorites-context'
import { Product } from '@/types/product'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        if (favorites.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        const productsData: Product[] = []
        for (const id of favorites) {
          const productDoc = await getDoc(doc(db, 'products', id))
          if (productDoc.exists()) {
            productsData.push({
              id: productDoc.id,
              ...productDoc.data()
            } as Product)
          }
        }
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching favorite products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteProducts()
  }, [favorites])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <FiHeart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4 font-arabic">لا توجد منتجات في المفضلة</h1>
          <Link href="/products" className="btn btn-primary font-arabic">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-arabic">المفضلة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
} 