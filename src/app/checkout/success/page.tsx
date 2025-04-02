'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: number;
  color: string;
  image: string;
}

interface Order {
  id: string;
  customerInfo: {
    name: string;
    address: string;
    city: string;
    street: string;
    phone1: string;
    phone2?: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: Date;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      router.push('/');
      return;
    }

    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrder({
          id: orderDoc.id,
          ...orderDoc.data(),
          createdAt: orderDoc.data().createdAt.toDate()
        } as Order);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4 font-arabic">تم تأكيد طلبك بنجاح!</h1>
              <p className="text-secondary-600 mb-6 font-arabic">
                شكراً لك {order.customerInfo.name}، تم استلام طلبك وسيتم معالجته قريباً
              </p>
            </div>

            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-arabic">تفاصيل الطلب</h2>
                <span className="text-primary-600 font-bold font-arabic">
                  #{order.id.slice(-6)}
                </span>
              </div>
              <div className="space-y-4">
                {order.items.map((item: OrderItem) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-arabic">{item.name}</h3>
                      <p className="text-secondary-600 font-arabic">
                        المقاس: {item.size} | اللون: {item.color}
                      </p>
                      <p className="text-primary-600 font-bold font-arabic mt-1">
                        {item.price} ريال × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-secondary-50 border-t">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2 font-arabic">معلومات الشحن</h3>
                  <p className="text-secondary-600 font-arabic">{order.customerInfo.name}</p>
                  <p className="text-secondary-600 font-arabic">
                    {order.customerInfo.street}، {order.customerInfo.city}
                  </p>
                  <p className="text-secondary-600 font-arabic">{order.customerInfo.phone1}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold font-arabic">المجموع الكلي:</span>
                  <span className="text-xl font-bold text-primary-600 font-arabic">
                    {order.total} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/orders')}
              className="btn btn-primary font-arabic inline-flex items-center gap-2"
            >
              <FiShoppingBag />
              <span>عرض جميع الطلبات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 