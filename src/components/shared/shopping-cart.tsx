'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full hover:bg-secondary-100"
      >
        <FiShoppingCart size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white shadow-xl z-[101] overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                  <h2 className="text-xl font-bold font-arabic">سلة التسوق</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-secondary-100"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-secondary-600 font-arabic">سلة التسوق فارغة</p>
                      <Link 
                        href="/products"
                        className="btn btn-primary mt-4 inline-block font-arabic"
                        onClick={() => setIsOpen(false)}
                      >
                        تصفح المنتجات
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div 
                          key={`${item.id}-${item.size}-${item.color}`} 
                          className="flex gap-4 p-4 bg-white rounded-lg border border-secondary-100"
                        >
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1 font-arabic truncate">{item.name}</h3>
                            <p className="text-secondary-600 mb-2 font-arabic text-sm">
                              المقاس: {item.size} | اللون: {item.color}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-primary-600 font-arabic">
                                {item.price} شيكل
                              </p>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-secondary-100"
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-arabic">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-secondary-100"
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.size, item.color)}
                              className="text-red-500 hover:text-red-600 mt-2"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t p-4 bg-white">
                    <div className="flex justify-between mb-4">
                      <span className="font-arabic">المجموع الكلي</span>
                      <span className="font-bold text-primary-600 font-arabic">{total} ₪</span>
                    </div>
                    <Link 
                      href="/cart"
                      className="btn btn-primary w-full h-10 font-arabic"
                      onClick={() => setIsOpen(false)}
                    >
                      إتمام الشراء
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 