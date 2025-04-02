'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import ProtectedRoute from '@/components/auth/protected-route'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  status: 'active' | 'inactive'
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  image?: string
  description?: string
  createdAt: string
  sizes: number[]
  colors: string[]
  categoryName?: string
}

const AVAILABLE_SIZES = [36, 37, 38, 39, 40, 41, 42, 43]
const AVAILABLE_COLORS = ['red', 'black', 'white', 'blue', 'brown']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    description: '',
    sizes: [],
    colors: [],
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'))
      const categoriesData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[]
      setCategories(categoriesData.filter(cat => cat.status === 'active'))
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('حدث خطأ أثناء جلب الفئات')
    }
  }

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      
      // Add category names to products
      const productsWithCategories = productsData.map(product => {
        const category = categories.find(cat => cat.id === product.category)
        return {
          ...product,
          categoryName: category?.name
        }
      })
      
      setProducts(productsWithCategories)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('حدث خطأ أثناء جلب المنتجات')
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newProduct.sizes.length === 0) {
      toast.error('الرجاء اختيار مقاس واحد على الأقل')
      return
    }
    if (newProduct.colors.length === 0) {
      toast.error('الرجاء اختيار لون واحد على الأقل')
      return
    }
    setIsLoading(true)

    try {
      let imageUrl = ''
      if (selectedImage) {
        const storageRef = ref(storage, `products/${Date.now()}-${selectedImage.name}`)
        await uploadBytes(storageRef, selectedImage)
        imageUrl = await getDownloadURL(storageRef)
      }

      const productData = {
        ...newProduct,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, 'products'), productData)
      toast.success('تم إضافة المنتج بنجاح')
      setIsAddModalOpen(false)
      setNewProduct({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        status: 'active',
        description: '',
        sizes: [],
        colors: [],
      })
      setSelectedImage(null)
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('حدث خطأ أثناء إضافة المنتج')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSizeToggle = (size: number) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b)
    }))
  }

  const handleColorToggle = (color: string) => {
    setNewProduct(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteDoc(doc(db, 'products', id))
        toast.success('تم حذف المنتج بنجاح')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('حدث خطأ أثناء حذف المنتج')
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: Product['status']) => {
    try {
      await updateDoc(doc(db, 'products', id), {
        status: newStatus,
      })
      toast.success('تم تحديث حالة المنتج')
      fetchProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      toast.error('حدث خطأ أثناء تحديث حالة المنتج')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-theme(space.16))] p-6 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            إضافة منتج جديد
          </button>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد منتجات حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              إضافة منتج جديد
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-secondary-200">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الصورة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الفئة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">السعر</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">المقاسات</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الألوان</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">المخزون</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{product.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{product.categoryName}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{product.price} ₪</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                      {product.sizes?.join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                      <div className="flex gap-1">
                        {product.colors?.map(color => (
                          <div
                            key={color}
                            className="h-4 w-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{product.stock}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(product.id, product.status === 'active' ? 'inactive' : 'active')}
                          className="btn btn-secondary btn-sm"
                        >
                          {product.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-white">
              <div className="max-h-[90vh] overflow-y-auto p-6">
                <h2 className="sticky top-0 mb-4 bg-white pb-4 text-xl font-bold">إضافة منتج جديد</h2>
                <form onSubmit={handleAddProduct}>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الصورة</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الاسم</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الفئة</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">المقاسات المتوفرة</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`rounded-full px-3 py-1 text-sm ${
                            newProduct.sizes.includes(size)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الألوان المتوفرة</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          className={`h-8 w-8 rounded-full border-2 ${
                            newProduct.colors.includes(color)
                              ? 'border-primary-600'
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">السعر</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="input"
                      required
                      min="0"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">المخزون</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="input"
                      required
                      min="0"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الوصف</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="input"
                      rows={3}
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
  )
} 