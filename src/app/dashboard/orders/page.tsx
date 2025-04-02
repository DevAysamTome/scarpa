'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    address: string;
    city: string;
    street: string;
    phone1: string;
    phone2?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: number;
    color: string;
    image: string;
  }>;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id'>>({
    orderNumber: '',
    customerInfo: {
      name: '',
      address: '',
      city: '',
      street: '',
      phone1: '',
    },
    items: [],
    amount: 0,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('حدث خطأ أثناء جلب الطلبات');
    }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orders'), newOrder);
      toast.success('تم إضافة الطلب بنجاح');
      setIsAddModalOpen(false);
      setNewOrder({
        orderNumber: '',
        customerInfo: {
          name: '',
          address: '',
          city: '',
          street: '',
          phone1: '',
        },
        items: [],
        amount: 0,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      });
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('حدث خطأ أثناء إضافة الطلب');
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: newStatus,
      });
      toast.success('تم تحديث حالة الطلب');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            إضافة طلب جديد
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد طلبات حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              إضافة طلب جديد
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-secondary-200">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">رقم الطلب</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">العميل</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">المنتج</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">المبلغ</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">التاريخ</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.customerInfo.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.items.map(item => item.name).join(', ')}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.amount}₪</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.date}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          عرض التفاصيل
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          className="rounded border border-secondary-300 px-2 py-1 text-sm"
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="processing">قيد المعالجة</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">إضافة طلب جديد</h2>
              <form onSubmit={handleAddOrder}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">رقم الطلب</label>
                  <input
                    type="text"
                    value={newOrder.orderNumber}
                    onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">اسم العميل</label>
                  <input
                    type="text"
                    value={newOrder.customerInfo.name}
                    onChange={(e) => setNewOrder({ ...newOrder, customerInfo: { ...newOrder.customerInfo, name: e.target.value } })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">المنتجات</label>
                  <input
                    type="text"
                    value={newOrder.items[0]?.name || ''}
                    onChange={(e) => setNewOrder({ 
                      ...newOrder, 
                      items: [{ 
                        id: '', 
                        name: e.target.value, 
                        price: 0, 
                        quantity: 1, 
                        size: 42, 
                        color: 'أسود',
                        image: ''
                      }] 
                    })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">المبلغ</label>
                  <input
                    type="number"
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder({ ...newOrder, amount: Number(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-primary">
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDetailsModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">تفاصيل الطلب #{selectedOrder.id}</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">معلومات العميل</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-secondary-600">الاسم</p>
                      <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-secondary-600">رقم الهاتف</p>
                      <p className="font-medium">{selectedOrder.customerInfo.phone1}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-secondary-600">العنوان</p>
                      <p className="font-medium">
                        {selectedOrder.customerInfo.street}، {selectedOrder.customerInfo.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">المنتجات</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
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

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-secondary-600">حالة الطلب</p>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary-600">المجموع الكلي</p>
                    <p className="text-xl font-bold text-primary-600">{selectedOrder.amount} ريال</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 