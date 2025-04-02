'use client'

import Image from 'next/image'
import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { useCart } from '@/contexts/cart-context'

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  category: string
  sizes: number[]
  colors: string[]
  stock: number
  specifications?: {
    material: string
    sole: string
    closure: string
  }
  reviews?: {
    rating: number
    count: number
  }
}

const DEFAULT_IMAGE = '/images/placeholder.jpg'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const productRef = doc(db, 'products', resolvedParams.id)
      const productSnap = await getDoc(productRef)

      if (productSnap.exists()) {
        const data = productSnap.data()
        // Convert single image to array or use existing images array
        const images = Array.isArray(data.images) 
          ? data.images 
          : data.image 
            ? [data.image]
            : [DEFAULT_IMAGE]

        setProduct({ 
          id: productSnap.id, 
          ...data,
          images 
        } as Product)
      } else {
        toast.error('المنتج غير موجود')
        // You might want to redirect to 404 page here
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('حدث خطأ أثناء تحميل المنتج')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    if (!selectedSize) {
      toast.error('الرجاء اختيار المقاس')
      return
    }

    if (!selectedColor) {
      toast.error('الرجاء اختيار اللون')
      return
    }

    if (product.stock === 0) {
      toast.error('عذراً، هذا المنتج غير متوفر حالياً')
      return
    }

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      })
      toast.success('تمت إضافة المنتج إلى السلة')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('حدث خطأ أثناء إضافة المنتج إلى السلة')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4 font-arabic">المنتج غير موجود</h2>
          <p className="text-secondary-600 font-arabic">عذراً، المنتج الذي تبحث عنه غير متوفر حالياً.</p>
        </div>
      </div>
    )
  }

  const currentImage = product.images[selectedImage] || DEFAULT_IMAGE

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-[500px] mb-4">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <span className="text-white font-bold font-arabic">غير متوفر</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-24 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary-600' : ''
                }`}
              >
                <Image
                  src={image || DEFAULT_IMAGE}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-secondary-500 font-arabic">رمز المنتج:</span>
            <span className="font-mono font-semibold">PROD#{product.id}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 font-arabic">{product.name}</h1>
          <p className="text-2xl font-bold text-primary-600 mb-6 font-arabic">
            {product.price} ₪
          </p>
          <p className="text-secondary-600 mb-8 font-arabic">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 font-arabic">اختر المقاس</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-arabic ${
                    selectedSize === size
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-secondary-200 hover:border-primary-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 font-arabic">اختر اللون</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-primary-600' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2 font-arabic"
              disabled={product.stock === 0}
            >
              <FiShoppingCart />
              {product.stock === 0 ? 'غير متوفر' : 'إضافة إلى السلة'}
            </button>
            <button className="btn btn-secondary p-4">
              <FiHeart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-secondary-200">
          <nav className="flex gap-8">
            <button 
              onClick={() => setActiveTab('description')}
              className={`py-4 px-2 border-b-2 font-arabic ${
                activeTab === 'description'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-primary-600'
              }`}
            >
              الوصف
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-2 border-b-2 font-arabic ${
                activeTab === 'specifications'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-primary-600'
              }`}
            >
              المواصفات
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-2 border-b-2 font-arabic ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-primary-600'
              }`}
            >
              التقييمات
            </button>
          </nav>
        </div>
        <div className="py-8">
          {activeTab === 'description' && (
            <p className="text-secondary-600 font-arabic">{product.description}</p>
          )}
          {activeTab === 'specifications' && product.specifications && (
            <div className="space-y-4 font-arabic">
              <div>
                <h4 className="font-semibold mb-2">المادة</h4>
                <p className="text-secondary-600">{product.specifications.material}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">النعل</h4>
                <p className="text-secondary-600">{product.specifications.sole}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الإغلاق</h4>
                <p className="text-secondary-600">{product.specifications.closure}</p>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && product.reviews && (
            <div className="space-y-4 font-arabic">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < product.reviews!.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-secondary-600">
                  ({product.reviews.count} تقييمات)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 