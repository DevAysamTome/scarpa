'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

interface CheckoutForm {
  name: string;
  address: string;
  city: string;
  street: string;
  phone1: string;
  phone2: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    address: '',
    city: '',
    street: '',
    phone1: '',
    phone2: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in Firestore
      const orderData = {
        customerInfo: formData,
        items,
        total,
        status: 'pending',
        createdAt: new Date(),
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      // Clear cart and show success message
      clearCart();
      toast.success('تم تأكيد طلبك بنجاح!');
      
      // Redirect to success page with order ID
      router.push(`/checkout/success?orderId=${orderRef.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('حدث خطأ أثناء تأكيد الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        <h1 className="text-3xl font-bold mb-8 text-center font-arabic">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4 font-arabic">ملخص الطلب</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
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
                        {item.price} شيكل × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-secondary-50 border-t">
              <div className="flex justify-between items-center">
                <span className="font-bold font-arabic">المجموع الكلي:</span>
                <span className="text-xl font-bold text-primary-600 font-arabic">{total} شيكل</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4 font-arabic">معلومات الشحن</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 font-arabic">الاسم الكامل</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 font-arabic">العنوان</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="أدخل عنوانك"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-arabic">المدينة</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="المدينة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-arabic">الشارع</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="الشارع"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-arabic">رقم الهاتف 1</label>
                  <input
                    type="tel"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="رقم الهاتف الرئيسي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-arabic">رقم الهاتف 2</label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="رقم هاتف بديل (اختياري)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary h-12 font-arabic mt-4"
              >
                {loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 