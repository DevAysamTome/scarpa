'use client'

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, 'customers'));
      const customers = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Calculate stats
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
      const totalCustomers = customers.length;
      const totalProducts = products.length;

      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setStats({
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts,
        recentOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('حدث خطأ أثناء جلب بيانات لوحة التحكم');
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
        <h1 className="mb-6 text-2xl font-bold">لوحة التحكم</h1>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">إجمالي الطلبات</p>
                <p className="mt-1 text-2xl font-semibold text-secondary-900">{stats.totalOrders}</p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">إجمالي الإيرادات</p>
                <p className="mt-1 text-2xl font-semibold text-secondary-900">{stats.totalRevenue} ₪</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">إجمالي العملاء</p>
                <p className="mt-1 text-2xl font-semibold text-secondary-900">{stats.totalCustomers}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">إجمالي المنتجات</p>
                <p className="mt-1 text-2xl font-semibold text-secondary-900">{stats.totalProducts}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">آخر الطلبات</h2>
              <Link href="/dashboard/orders" className="text-sm text-primary-600 hover:text-primary-900">
                عرض الكل
              </Link>
            </div>
            <div className="overflow-x-auto">
              {stats.recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-12">
                  <p className="mb-4 text-lg text-secondary-600">لا توجد طلبات حالياً</p>
                  <Link href="/dashboard/orders" className="btn btn-primary">
                    إضافة طلب جديد
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-right text-sm font-medium text-secondary-900">رقم الطلب</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-secondary-900">العميل</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-secondary-900">المبلغ</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-secondary-900">الحالة</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-secondary-900">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap px-4 py-2 text-sm text-secondary-900">{order.orderNumber}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm text-secondary-900">{order.customerName}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm text-secondary-900">{order.amount} ₪</td>
                        <td className="whitespace-nowrap px-4 py-2">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm text-secondary-900">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">روابط سريعة</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/orders"
                className="flex items-center justify-center rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50"
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-secondary-900">الطلبات</span>
                </div>
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center justify-center rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50"
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-secondary-900">المنتجات</span>
                </div>
              </Link>
              <Link
                href="/dashboard/customers"
                className="flex items-center justify-center rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50"
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-secondary-900">العملاء</span>
                </div>
              </Link>
              <Link
                href="/dashboard/categories"
                className="flex items-center justify-center rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50"
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-secondary-900">الفئات</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 