'use client';

import { useCart } from '@/contexts/cart-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-arabic">السلة فارغة</h1>
          <button 
            onClick={() => router.push('/products')}
            className="btn btn-primary font-arabic"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-secondary-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center font-arabic">سلة المشتريات</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4 border-b pb-4 last:border-0">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-arabic">{item.name}</h3>
                      <p className="text-secondary-600 font-arabic">
                        المقاس: {item.size} | اللون: {item.color}
                      </p>
                      <p className="text-primary-600 font-bold font-arabic mt-2">
                        {item.price} ريال
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-secondary-100 rounded-full"
                      >
                        <FiMinus />
                      </button>
                      <span className="w-8 text-center font-arabic">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="p-2 hover:bg-secondary-100 rounded-full"
                      >
                        <FiPlus />
                      </button>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 font-arabic">ملخص الطلب</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-arabic">عدد المنتجات:</span>
                  <span className="font-arabic">{items.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-arabic">المجموع الكلي:</span>
                  <span className="text-xl font-bold text-primary-600 font-arabic">{total} ريال</span>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full btn btn-primary h-12 font-arabic mt-4"
                >
                  إتمام الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 