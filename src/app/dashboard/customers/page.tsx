'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    totalOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customers'));
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('حدث خطأ أثناء جلب العملاء');
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'customers'), newCustomer);
      toast.success('تم إضافة العميل بنجاح');
      setIsAddModalOpen(false);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('حدث خطأ أثناء إضافة العميل');
    }
  };

  const handleStatusChange = async (id: string, newStatus: Customer['status']) => {
    try {
      await updateDoc(doc(db, 'customers', id), {
        status: newStatus,
      });
      toast.success('تم تحديث حالة العميل');
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة العميل');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">العملاء</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            إضافة عميل جديد
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="البحث عن عميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>

        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-12">
            <p className="mb-4 text-lg text-secondary-600">لا يوجد عملاء حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              إضافة عميل جديد
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-secondary-200">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الهاتف</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">العنوان</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">تاريخ الانضمام</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">عدد الطلبات</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">إجمالي المشتريات</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.phone}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.address}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.joinDate}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.totalOrders}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{customer.totalSpent} ريال</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                      <button
                        onClick={() => handleStatusChange(customer.id, customer.status === 'active' ? 'inactive' : 'active')}
                        className="btn btn-secondary btn-sm"
                      >
                        {customer.status === 'active' ? 'تعطيل' : 'تفعيل'}
                      </button>
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
              <h2 className="mb-4 text-xl font-bold">إضافة عميل جديد</h2>
              <form onSubmit={handleAddCustomer}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">الاسم</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">الهاتف</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">العنوان</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
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
      </div>
    </ProtectedRoute>
  );
} 