'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FiArrowLeft, FiShoppingBag, FiStar } from 'react-icons/fi'
import Carousel from '@/components/Carousel'
import { CarouselSlide } from '@/types/carousel'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface Category {
  id: string
  name: string
  image: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch carousel slides
        const slidesQuery = query(
          collection(db, 'carousel'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        )
        const slidesSnapshot = await getDocs(slidesQuery)
        const slidesData = slidesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as CarouselSlide[]
        setCarouselSlides(slidesData)

        // Fetch featured products
        const productsQuery = query(
          collection(db, 'products'),
          limit(4)
        )
        const productsSnapshot = await getDocs(productsQuery)
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]
        setFeaturedProducts(productsData)

        // Fetch categories
        const categoriesQuery = query(collection(db, 'categories'), limit(6))
        const categoriesSnapshot = await getDocs(categoriesQuery)
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[]
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh]">
        <Carousel slides={carouselSlides} />
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-arabic">منتجات مميزة</h2>
            <Link 
              href="/products" 
              className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2 font-arabic"
            >
              عرض الكل
              <FiArrowLeft />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary-100 h-64 rounded-lg mb-4" />
                  <div className="h-4 bg-secondary-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary-100 rounded w-1/2" />
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <Link 
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group"
                >
                  <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold mb-2 font-arabic">{product.name}</h3>
                  <p className="text-primary-600 font-bold font-arabic">{product.price} ₪</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-arabic">تسوق حسب الفئة</h2>
            <Link 
              href="/categories" 
              className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2 font-arabic"
            >
              عرض الكل
              <FiArrowLeft />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white h-32 rounded-lg mb-4" />
                  <div className="h-4 bg-white rounded w-3/4" />
                </div>
              ))
            ) : (
              categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group"
                >
                  <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-center font-semibold font-arabic">{category.name}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <FiStar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold mb-2 font-arabic">جودة عالية</h3>
              <p className="text-secondary-600 font-arabic">
                نقدم أفضل المنتجات من أشهر العلامات التجارية
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <FiShoppingBag className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold mb-2 font-arabic">تسوق آمن</h3>
              <p className="text-secondary-600 font-arabic">
                دفع آمن وشحن سريع لجميع المنتجات
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <FiStar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold mb-2 font-arabic">خدمة عملاء</h3>
              <p className="text-secondary-600 font-arabic">
                فريق دعم متخصص لمساعدتك على مدار الساعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-900 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 font-arabic">اشترك في نشرتنا البريدية</h2>
          <p className="mb-8 font-arabic">احصل على آخر العروض والتخفيضات مباشرة إلى بريدك</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 h-12 px-4 rounded-lg bg-primary-900/10  border-white/20 text-black placeholder-black/60"
            />
            <button type="submit" className="btn btn-primary h-12 w-40 font-arabic">
              اشتراك
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
