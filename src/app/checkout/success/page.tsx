/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiCheckCircle, FiShoppingBag, FiPhone } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

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

function OrderDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        toast.error('لم يتم العثور على الطلب');
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (!orderDoc.exists()) {
          toast.error('لم يتم العثور على الطلب');
          return;
        }
        setOrder({
          id: orderDoc.id,
          ...orderDoc.data(),
          createdAt: orderDoc.data().createdAt.toDate()
        } as Order);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('حدث خطأ أثناء جلب تفاصيل الطلب');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-secondary-600 mb-4">لم يتم العثور على الطلب</p>
        <Link href="/" className="btn btn-primary">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FiCheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">تم استلام طلبك بنجاح!</h1>
          <p className="text-secondary-600">
            شكراً لك، تم استلام طلبك وسيتم معالجته قريباً
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">تفاصيل الطلب</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">رقم الطلب</span>
              <span className="font-medium">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">تاريخ الطلب</span>
              <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">المنتجات</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-secondary-600">
                    المقاس: {item.size} | اللون: {item.color}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.price} ريال</p>
                  <p className="text-sm text-secondary-600">الكمية: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">معلومات الشحن</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiShoppingBag className="w-5 h-5 text-primary-600 mt-1" />
              <div>
                <p className="font-medium">{order.customerInfo.name}</p>
                <p className="text-secondary-600">
                  {order.customerInfo.street}، {order.customerInfo.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-primary-600" />
              <p className="text-secondary-600">{order.customerInfo.phone1}</p>
            </div>
            {order.customerInfo.phone2 && (
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-600" />
                <p className="text-secondary-600">{order.customerInfo.phone2}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">المجموع الكلي</span>
            <span className="text-2xl font-bold text-primary-600">{order.total} ريال</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/orders" className="btn btn-primary">
            عرض جميع الطلبات
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    }>
      <OrderDetails />
    </Suspense>
  );
} 