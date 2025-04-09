/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCart } from '@/contexts/cart-context'
import { Product } from '@/types/product'
import { useFavorites } from '@/contexts/favorites-context'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    
    try {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id)
        toast.success('تمت إزالة المنتج من المفضلة')
      } else {
        addToFavorites(product.id)
        toast.success('تمت إضافة المنتج إلى المفضلة')
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast.error('حدث خطأ أثناء تحديث المفضلة')
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (product.stock === 0) {
      toast.error('عذراً، هذا المنتج غير متوفر حالياً')
      return
    }
    
    setIsLoading(true)
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image ?? product.imageUrl,
        quantity: 1,
        size: 42, // Default size
        color: 'أسود' // Default color
      });
      toast.success('تمت إضافة المنتج إلى السلة')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('حدث خطأ أثناء إضافة المنتج إلى السلة')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card group overflow-hidden relative">
      <button
        onClick={handleFavorite}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        <FiHeart 
          className={`w-5 h-5 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
        />
      </button> 
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.image ?? product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold font-arabic">غير متوفر</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 font-arabic">{product.category}</span>
            <span className="text-lg font-bold text-primary-600 font-arabic">{product.price} ₪</span>
          </div>
          <h3 className="text-lg font-semibold mb-4 font-arabic">{product.name}</h3>
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary w-full h-10 flex items-center justify-center gap-2 font-arabic"
            disabled={isLoading || product.stock === 0}
          >
            <FiShoppingCart />
            {isLoading ? 'جاري الإضافة...' : product.stock === 0 ? 'غير متوفر' : 'إضافة إلى السلة'}
          </button>
        </div>
      </Link>
    </div>
  )
} 