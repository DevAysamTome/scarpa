'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

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
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    quantity: 1,
    size: 42,
    color: 'أسود',
    image: '',
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
      
      // Calculate total amount for each order based on items
      const ordersWithCalculatedAmount = ordersData.map(order => {
        const calculatedAmount = order.items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
        
        return {
          ...order,
          amount: calculatedAmount > 0 ? calculatedAmount : order.amount
        };
      });
      
      setOrders(ordersWithCalculatedAmount);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('حدث خطأ أثناء جلب الطلبات');
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      toast.error('يرجى إدخال اسم المنتج والسعر');
      return;
    }
    
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { ...newItem, id: Date.now().toString() }],
      amount: newOrder.amount + (newItem.price * newItem.quantity)
    });
    
    setNewItem({
      name: '',
      price: 0,
      quantity: 1,
      size: 42,
      color: 'أسود',
      image: '',
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...newOrder.items];
    const removedItem = updatedItems.splice(index, 1)[0];
    
    setNewOrder({
      ...newOrder,
      items: updatedItems,
      amount: newOrder.amount - (removedItem.price * removedItem.quantity)
    });
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newOrder.items.length === 0) {
      toast.error('يرجى إضافة منتج واحد على الأقل');
      return;
    }
    
    try {
      // Calculate final amount based on items
      const finalAmount = newOrder.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      const orderToAdd = {
        ...newOrder,
        amount: finalAmount
      };
      
      await addDoc(collection(db, 'orders'), orderToAdd);
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
      <div className="min-h-[calc(100vh-theme(space.16))] p-4 sm:p-6 pb-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto"
          >
            إضافة طلب جديد
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-6 sm:p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد طلبات حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary w-full sm:w-auto"
            >
              إضافة طلب جديد
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border border-secondary-200 p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-secondary-900">طلب #{order.orderNumber || order.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-secondary-600">العميل</p>
                        <p className="font-medium">{order.customerInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">التاريخ</p>
                        <p className="font-medium">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">المبلغ</p>
                        <p className="font-medium">{order.amount}₪</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">المنتجات</p>
                        <p className="font-medium truncate">{order.items.map(item => item.name).join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
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
                      
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-800"
                      >
                        <FiEye className="w-4 h-4" />
                        <span className="text-sm">عرض التفاصيل</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-lg border border-secondary-200">
              <div className="overflow-x-auto">
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
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.orderNumber || order.id}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.customerInfo.name}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900 max-w-xs truncate">{order.items.map(item => item.name).join(', ')}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{order.amount}₪</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}>
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
                              className="text-primary-600 hover:text-primary-800"
                            >
                              <FiEye className="w-5 h-5" />
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
            </div>
          </>
        )}

        {/* Add Order Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">إضافة طلب جديد</h2>
                <form onSubmit={handleAddOrder} className="space-y-4">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">رقم الطلب</label>
                    <input
                      type="text"
                      value={newOrder.orderNumber}
                      onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">اسم العميل</label>
                    <input
                      type="text"
                      value={newOrder.customerInfo.name}
                      onChange={(e) => setNewOrder({ ...newOrder, customerInfo: { ...newOrder.customerInfo, name: e.target.value } })}
                      className="input w-full"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">إضافة منتج</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="اسم المنتج"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="input w-full"
                      />
                      <input
                        type="number"
                        placeholder="السعر"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        className="input w-full"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="الكمية"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                        className="input w-full"
                      />
                      <input
                        type="number"
                        placeholder="المقاس"
                        value={newItem.size}
                        onChange={(e) => setNewItem({ ...newItem, size: Number(e.target.value) })}
                        className="input w-full"
                      />
                      <input
                        type="text"
                        placeholder="اللون"
                        value={newItem.color}
                        onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                        className="input w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="btn btn-secondary w-full"
                    >
                      إضافة المنتج
                    </button>
                  </div>
                  
                  {newOrder.items.length > 0 && (
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-secondary-900">المنتجات المضافة</label>
                      <div className="border border-secondary-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-secondary-200">
                          <thead className="bg-secondary-50">
                            <tr>
                              <th className="px-3 py-2 text-right text-xs font-medium text-secondary-900">المنتج</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-secondary-900">السعر</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-secondary-900">الكمية</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-secondary-900">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-secondary-200 bg-white">
                            {newOrder.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 text-sm text-secondary-900">{item.name}</td>
                                <td className="px-3 py-2 text-sm text-secondary-900">{item.price}₪</td>
                                <td className="px-3 py-2 text-sm text-secondary-900">{item.quantity}</td>
                                <td className="px-3 py-2 text-sm text-secondary-900">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="font-medium">المبلغ الإجمالي: {newOrder.amount}₪</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="btn btn-secondary"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={newOrder.items.length === 0}
                    >
                      إضافة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {isDetailsModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsDetailsModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-xl font-bold mb-4">تفاصيل الطلب #{selectedOrder.orderNumber || selectedOrder.id}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">معلومات العميل</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-secondary-600">الاسم:</span> {selectedOrder.customerInfo.name}</p>
                        <p><span className="text-secondary-600">العنوان:</span> {selectedOrder.customerInfo.address}</p>
                        <p><span className="text-secondary-600">المدينة:</span> {selectedOrder.customerInfo.city}</p>
                        <p><span className="text-secondary-600">الشارع:</span> {selectedOrder.customerInfo.street}</p>
                        <p><span className="text-secondary-600">الهاتف:</span> {selectedOrder.customerInfo.phone1}</p>
                        {selectedOrder.customerInfo.phone2 && (
                          <p><span className="text-secondary-600">هاتف بديل:</span> {selectedOrder.customerInfo.phone2}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">معلومات الطلب</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-secondary-600">التاريخ:</span> {selectedOrder.date}</p>
                        <p><span className="text-secondary-600">الحالة:</span> {getStatusText(selectedOrder.status)}</p>
                        <p><span className="text-secondary-600">المبلغ الإجمالي:</span> {selectedOrder.amount}₪</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">المنتجات</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                          <tr>
                            <th className="px-4 py-2 text-right text-xs font-medium text-secondary-900">المنتج</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-secondary-900">السعر</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-secondary-900">الكمية</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-secondary-900">المقاس</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-secondary-900">اللون</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-secondary-900">المجموع</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200 bg-white">
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-secondary-900">{item.name}</td>
                              <td className="px-4 py-2 text-sm text-secondary-900">{item.price}₪</td>
                              <td className="px-4 py-2 text-sm text-secondary-900">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-secondary-900">{item.size}</td>
                              <td className="px-4 py-2 text-sm text-secondary-900">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="h-4 w-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span>{item.color}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-secondary-900">{item.price * item.quantity}₪</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-secondary-50">
                          <tr>
                            <td colSpan={5} className="px-4 py-2 text-right text-sm font-medium text-secondary-900">المجموع الكلي</td>
                            <td className="px-4 py-2 text-sm font-medium text-secondary-900">{selectedOrder.amount}₪</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 