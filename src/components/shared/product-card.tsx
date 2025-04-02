'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCart } from '@/contexts/cart-context'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  stock: number
}

export function ProductCard({ id, name, price, image, category, stock }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState(42)
  const [selectedColor, setSelectedColor] = useState('أسود')
  const { addItem } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (stock === 0) {
      toast.error('عذراً، هذا المنتج غير متوفر حالياً')
      return
    }
    
    setIsLoading(true)
    try {
      // TODO: Implement add to cart functionality
      addItem({
        id,
        name,
        price,
        image,
        quantity: 1,
        size: selectedSize, // Default size
        color: selectedColor // Default color
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group overflow-hidden"
    >
      <Link href={`/products/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold font-arabic">غير متوفر</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 font-arabic">{category}</span>
            <span className="text-lg font-bold text-primary-600 font-arabic">{price} ₪</span>
          </div>
          <h3 className="text-lg font-semibold mb-4 font-arabic">{name}</h3>
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary w-full h-10 flex items-center justify-center gap-2 font-arabic"
            disabled={isLoading || stock === 0}
          >
            <FiShoppingCart />
            {isLoading ? 'جاري الإضافة...' : stock === 0 ? 'غير متوفر' : 'إضافة إلى السلة'}
          </button>
        </div>
      </Link>
    </motion.div>
  )
} 