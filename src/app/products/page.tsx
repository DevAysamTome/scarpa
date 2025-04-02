'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, query, where, orderBy, limit, startAfter, DocumentSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ProductCard } from '@/components/shared/product-card'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
  createdAt: string
  status: 'active' | 'inactive'
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const productsPerPage = 12

  const fetchCategories = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'))
      const categoriesData = querySnapshot.docs
        .map(doc => doc.data().name)
        .filter(Boolean)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('حدث خطأ أثناء تحميل الأقسام')
    }
  }, [])

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true)
      let productsQuery = query(
        collection(db, 'products'),
        where('status', '==', 'active'),
        limit(productsPerPage)
      )

      // Apply category filter
      if (selectedCategory) {
        productsQuery = query(productsQuery, where('category', '==', selectedCategory))
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          productsQuery = query(productsQuery, orderBy('price', 'asc'))
          break
        case 'price-desc':
          productsQuery = query(productsQuery, orderBy('price', 'desc'))
          break
        case 'newest':
          productsQuery = query(productsQuery, orderBy('createdAt', 'desc'))
          break
        case 'popular':
          productsQuery = query(productsQuery, orderBy('stock', 'desc'))
          break
      }

      // Apply pagination
      if (isLoadMore && lastVisible) {
        productsQuery = query(productsQuery, startAfter(lastVisible))
      }

      const querySnapshot = await getDocs(productsQuery)
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      setHasMore(querySnapshot.docs.length === productsPerPage)
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...productsData])
      } else {
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('حدث خطأ أثناء تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, sortBy, lastVisible])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [fetchCategories, fetchProducts])

  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case 'category':
        setSelectedCategory(value)
        break
      case 'size':
        setSelectedSize(value)
        break
      case 'sort':
        setSortBy(value)
        break
    }
    setLastVisible(null)
    fetchProducts()
  }

  const handleLoadMore = () => {
    fetchProducts(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-arabic">المنتجات</h1>
        <p className="text-secondary-600 font-arabic">
          اكتشف مجموعتنا المميزة من الأحذية
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-4">
          <select 
            className="input w-48 font-arabic"
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">جميع الأقسام</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select 
            className="input w-48 font-arabic"
            value={selectedSize}
            onChange={(e) => handleFilterChange('size', e.target.value)}
          >
            <option value="">جميع الأحجام</option>
            {[36, 37, 38, 39, 40, 41, 42, 43].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <select 
          className="input w-48 font-arabic"
          value={sortBy}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
          <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
          <option value="popular">الأكثر مبيعاً</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary px-6 py-2 font-arabic"
                disabled={loading}
              >
                {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
              </button>
            </div>
          )}

          {/* No Products Message */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-secondary-600 font-arabic">لا توجد منتجات متاحة حالياً</p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 