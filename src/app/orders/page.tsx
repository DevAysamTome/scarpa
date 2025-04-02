'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiShoppingBag, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: number;
  color: string;
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      case 'shipped':
        return 'text-purple-500';
      case 'delivered':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5" />;
      case 'processing':
        return <FiShoppingBag className="w-5 h-5" />;
      case 'shipped':
        return <FiShoppingBag className="w-5 h-5" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-arabic">لا توجد طلبات</h1>
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
        <h1 className="text-3xl font-bold mb-8 text-center font-arabic">طلباتي</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold font-arabic">طلب #{order.id.slice(-6)}</h2>
                    <p className="text-secondary-600 font-arabic">
                      {order.createdAt.toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-arabic">{getStatusText(order.status)}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
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
                          {item.price} ريال × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="p-6 bg-secondary-50 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold font-arabic">معلومات الشحن</h3>
                    <p className="text-secondary-600 font-arabic">{order.customerInfo.name}</p>
                    <p className="text-secondary-600 font-arabic">
                      {order.customerInfo.street}، {order.customerInfo.city}
                    </p>
                    <p className="text-secondary-600 font-arabic">{order.customerInfo.phone1}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-600 font-arabic">
                      {order.total} ريال
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 