'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

interface Carousel {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  isActive: boolean;
  createdAt: string;
}

export default function CarouselsPage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCarousel, setNewCarousel] = useState<Omit<Carousel, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    image: '',
    link: '',
    isActive: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carousel'));
      const carouselsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Carousel[];
      setCarousels(carouselsData);
    } catch (error) {
      console.error('Error fetching carousels:', error);
      toast.error('حدث خطأ أثناء جلب الكراسل');
    }
  };

  const handleAddCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        const storageRef = ref(storage, `carousel/${Date.now()}-${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const carouselData = {
        ...newCarousel,
        imageUrl: imageUrl || newCarousel.image,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'carousel'), carouselData);
      toast.success('تم إضافة الكاروسيل بنجاح');
      setIsAddModalOpen(false);
      setNewCarousel({
        title: '',
        description: '',
        image: '',
        link: '',
        isActive: true,
      });
      setSelectedImage(null);
      fetchCarousels();
    } catch (error) {
      console.error('Error adding carousel:', error);
      toast.error('حدث خطأ أثناء إضافة الكاروسيل');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCarousel = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكاروسيل؟')) {
      try {
        await deleteDoc(doc(db, 'carousel', id));
        toast.success('تم حذف الكاروسيل بنجاح');
        fetchCarousels();
      } catch (error) {
        console.error('Error deleting carousel:', error);
        toast.error('حدث خطأ أثناء حذف الكاروسيل');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'carousel', id), {
        isActive: newStatus,
      });
      toast.success('تم تحديث حالة الكاروسيل');
      fetchCarousels();
    } catch (error) {
      console.error('Error updating carousel status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الكاروسيل');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-theme(space.16))] p-4 sm:p-6 pb-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">الكراسل</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto"
          >
            إضافة كاروسيل جديد
          </button>
        </div>

        {carousels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-6 sm:p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد كراسل حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary w-full sm:w-auto"
            >
              إضافة كاروسيل جديد
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {carousels.map((carousel) => (
                <div key={carousel.id} className="bg-white rounded-lg border border-secondary-200 p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-secondary-900">{carousel.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        carousel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {carousel.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                    
                    {carousel.image && (
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        <img
                          src={carousel.image}
                          alt={carousel.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-secondary-600 line-clamp-2">{carousel.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
                      <button
                        onClick={() => handleStatusChange(carousel.id, !carousel.isActive)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          carousel.isActive 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {carousel.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteCarousel(carousel.id)}
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
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">العنوان</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الوصف</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الرابط</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الحالة</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 bg-white">
                    {carousels.map((carousel) => (
                      <tr key={carousel.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {carousel.image && (
                            <img
                              src={carousel.image}
                              alt={carousel.title}
                              className="h-12 w-20 rounded-lg object-cover"
                            />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{carousel.title}</td>
                        <td className="px-6 py-4 text-sm text-secondary-900 max-w-xs truncate">{carousel.description}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900 max-w-xs truncate">
                          <a href={carousel.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                            {carousel.link}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs ${
                            carousel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {carousel.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(carousel.id, !carousel.isActive)}
                              className={`p-2 ${
                                carousel.isActive 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {carousel.isActive ? <FiEye className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteCarousel(carousel.id)}
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

        {/* Add Carousel Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">إضافة كاروسيل جديد</h2>
                <form onSubmit={handleAddCarousel} className="space-y-4">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">العنوان</label>
                    <input
                      type="text"
                      value={newCarousel.title}
                      onChange={(e) => setNewCarousel({ ...newCarousel, title: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الوصف</label>
                    <textarea
                      value={newCarousel.description}
                      onChange={(e) => setNewCarousel({ ...newCarousel, description: e.target.value })}
                      className="input w-full"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الرابط</label>
                    <input
                      type="url"
                      value={newCarousel.link}
                      onChange={(e) => setNewCarousel({ ...newCarousel, link: e.target.value })}
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
                        checked={newCarousel.isActive}
                        onChange={(e) => setNewCarousel({ ...newCarousel, isActive: e.target.checked })}
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