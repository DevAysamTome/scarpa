'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  active: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    imageUrl: '',
    slug: '',
    active: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
      toast.error('حدث خطأ أثناء جلب التصنيفات');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        const storageRef = ref(storage, `categories/${Date.now()}-${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const categoryData = {
        ...newCategory,
        imageUrl: imageUrl || newCategory.imageUrl,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'categories'), categoryData);
      toast.success('تم إضافة التصنيف بنجاح');
      setIsAddModalOpen(false);
      setNewCategory({
        name: '',
        description: '',
        imageUrl: '',
        slug: '',
        active: true,
      });
      setSelectedImage(null);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('حدث خطأ أثناء إضافة التصنيف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        toast.success('تم حذف التصنيف بنجاح');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('حدث خطأ أثناء حذف التصنيف');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'categories', id), {
        active: newStatus,
      });
      toast.success('تم تحديث حالة التصنيف');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة التصنيف');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-theme(space.16))] p-4 sm:p-6 pb-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">التصنيفات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto"
          >
            إضافة تصنيف جديد
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-6 sm:p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد تصنيفات حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary w-full sm:w-auto"
            >
              إضافة تصنيف جديد
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg border border-secondary-200 p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-secondary-900">{category.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.active ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                    
                    {category.imageUrl && (
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-secondary-600 line-clamp-2">{category.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
                      <button
                        onClick={() => handleStatusChange(category.id, !category.active)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          category.active 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {category.active ? 'تعطيل' : 'تفعيل'}
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
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
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الصورة</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الاسم</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الوصف</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الرابط</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الحالة</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 bg-white">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {category.imageUrl && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="h-12 w-20 rounded-lg object-cover"
                            />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{category.name}</td>
                        <td className="px-6 py-4 text-sm text-secondary-900 max-w-xs truncate">{category.description}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900 max-w-xs truncate">
                          <a href={`/categories/${category.slug}`} className="text-primary-600 hover:text-primary-800">
                            {category.slug}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs ${
                            category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {category.active ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(category.id, !category.active)}
                              className={`p-2 ${
                                category.active 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {category.active ? <FiEye className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
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

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">إضافة تصنيف جديد</h2>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الاسم</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الوصف</label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="input w-full"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الرابط</label>
                    <input
                      type="text"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الصورة</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      className="input w-full"
                      accept="image/*"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCategory.active}
                        onChange={(e) => setNewCategory({ ...newCategory, active: e.target.checked })}
                        className="ml-2"
                      />
                      <span className="text-sm font-medium text-secondary-900">نشط</span>
                    </label>
                  </div>
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
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 