'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('حدث خطأ أثناء جلب الفئات');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'categories'), newCategory);
      toast.success('تم إضافة الفئة بنجاح');
      setIsAddModalOpen(false);
      setNewCategory({
        name: '',
        description: '',
        status: 'active',
      });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('حدث خطأ أثناء إضافة الفئة');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        toast.success('تم حذف الفئة بنجاح');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('حدث خطأ أثناء حذف الفئة');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Category['status']) => {
    try {
      await updateDoc(doc(db, 'categories', id), {
        status: newStatus,
      });
      toast.success('تم تحديث حالة الفئة');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الفئة');
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">الفئات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            إضافة فئة جديدة
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد فئات حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              إضافة فئة جديدة
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-secondary-200">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الوصف</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{category.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{category.description}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(category.id, category.status === 'active' ? 'inactive' : 'active')}
                          className="btn btn-secondary btn-sm"
                        >
                          {category.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="btn btn-danger btn-sm"
                        >
                          حذف
                        </button>
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
              <h2 className="mb-4 text-xl font-bold">إضافة فئة جديدة</h2>
              <form onSubmit={handleAddCategory}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">الاسم</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-secondary-900">الوصف</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
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