/* eslint-disable */
'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import ProtectedRoute from '@/components/auth/protected-route'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { HexColorPicker } from 'react-colorful'

interface Category {
  id: string
  name: string
  status: 'active' | 'inactive'
  active: boolean
}

interface ColorQuantity {
  color: string
  quantity: number
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
  colors: ColorQuantity[]
  categoryName?: string
  active: boolean
  customColors?: ColorQuantity[]
}

const AVAILABLE_SIZES = [36, 37, 38, 39, 40, 41, 42, 43]
const AVAILABLE_COLORS = ['red', 'black', 'white', 'blue', 'brown']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    description: '',
    sizes: [],
    colors: [],
    customColors: [],
    active: true,
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [customColor, setCustomColor] = useState('#000000')
  const [showColorPicker, setShowColorPicker] = useState(false)

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
      setCategories(categoriesData.filter(cat => cat.status === 'active' || cat.active))
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
        customColors: [],
        active: true,
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

  const calculateTotalQuantity = (colors: ColorQuantity[], customColors?: ColorQuantity[]) => {
    const standardColorsTotal = colors.reduce((sum, c) => sum + (c.quantity || 0), 0)
    const customColorsTotal = customColors?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0
    return standardColorsTotal + customColorsTotal
  }

  const handleColorToggle = (color: string) => {
    setNewProduct(prev => {
      const newColors = prev.colors.some(c => c.color === color)
        ? prev.colors.filter(c => c.color !== color)
        : [...prev.colors, { color, quantity: 0 }]
      const totalQuantity = calculateTotalQuantity(newColors, prev.customColors)
      return {
        ...prev,
        colors: newColors,
        stock: totalQuantity
      }
    })
  }

  const handleColorQuantityChange = (color: string, quantity: number) => {
    setNewProduct(prev => {
      const newColors = prev.colors.map(c => 
        c.color === color ? { ...c, quantity } : c
      )
      const totalQuantity = calculateTotalQuantity(newColors, prev.customColors)
      return {
        ...prev,
        colors: newColors,
        stock: totalQuantity
      }
    })
  }

  const handleCustomColorQuantityChange = (color: string, quantity: number) => {
    setNewProduct(prev => {
      const newCustomColors = prev.customColors?.map(c => 
        c.color === color ? { ...c, quantity } : c
      ) || []
      const totalQuantity = calculateTotalQuantity(prev.colors, newCustomColors)
      return {
        ...prev,
        customColors: newCustomColors,
        stock: totalQuantity
      }
    })
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

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setIsLoading(true)
    try {
      let imageUrl = selectedProduct.image
      if (selectedImage) {
        const storageRef = ref(storage, `products/${Date.now()}-${selectedImage.name}`)
        await uploadBytes(storageRef, selectedImage)
        imageUrl = await getDownloadURL(storageRef)
      }

      // Create a new object without the categoryName field
      const { categoryName, ...productData } = selectedProduct

      await updateDoc(doc(db, 'products', selectedProduct.id), {
        ...productData,
        image: imageUrl,
      })
      toast.success('تم تحديث المنتج بنجاح')
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      setSelectedImage(null)
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('حدث خطأ أثناء تحديث المنتج')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCustomColor = () => {
    if (!selectedProduct) return
    if (!selectedProduct.customColors) {
      selectedProduct.customColors = []
    }
    if (!selectedProduct.customColors.some(c => c.color === customColor)) {
      selectedProduct.customColors.push({ color: customColor, quantity: 0 })
      setSelectedProduct({ ...selectedProduct })
    }
    setShowColorPicker(false)
  }

  const handleRemoveCustomColor = (color: string) => {
    if (!selectedProduct) return
    if (selectedProduct.customColors) {
      selectedProduct.customColors = selectedProduct.customColors.filter(c => c.color !== color)
      setSelectedProduct({ ...selectedProduct })
    }
  }

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-theme(space.16))] p-4 sm:p-6 pb-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto"
          >
            إضافة منتج جديد
          </button>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary-200 p-6 sm:p-12">
            <p className="mb-4 text-lg text-secondary-600">لا توجد منتجات حالياً</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary w-full sm:w-auto"
            >
              إضافة منتج جديد
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-secondary-200 p-4">
                  <div className="flex items-start gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-secondary-900 truncate">{product.name}</h3>
                      <p className="text-sm text-secondary-600">{product.categoryName}</p>
                      <p className="text-lg font-medium text-primary-600 mt-1">{product.price} ₪</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-sm text-secondary-600">المقاسات: {product.sizes?.join(', ')}</span>
                        <div className="flex gap-1">
                          {product.colors?.map(({ color }) => (
                            <div
                              key={`${product.id}-${color}`}
                              className="h-4 w-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          {product.customColors?.map(({ color }) => (
                            <div
                              key={`${product.id}-custom-${color}`}
                              className="h-4 w-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'active' ? 'نشط' : 'غير نشط'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-secondary-600 hover:text-primary-600"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(product.id, product.status === 'active' ? 'inactive' : 'active')}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
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
                            {product.colors?.map(({ color }) => (
                              <div
                                key={`${product.id}-${color}`}
                                className="h-4 w-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            {product.customColors?.map(({ color }) => (
                              <div
                                key={`${product.id}-custom-${color}`}
                                className="h-4 w-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">{calculateTotalQuantity(product.colors, product.customColors)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status === 'active' ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-900">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="text-secondary-600 hover:text-primary-600"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(product.id, product.status === 'active' ? 'inactive' : 'active')}
                              className="text-secondary-600 hover:text-primary-600"
                            >
                              <FiEye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
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

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {AVAILABLE_COLORS.map((color) => (
                        <div key={`add-${color}`} className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleColorToggle(color)}
                            className={`h-8 w-8 rounded-full border-2 ${
                              newProduct.colors.some(c => c.color === color)
                                ? 'border-primary-600'
                                : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                          {newProduct.colors.some(c => c.color === color) && (
                            <input
                              type="number"
                              min="0"
                              value={newProduct.colors.find(c => c.color === color)?.quantity || 0}
                              onChange={(e) => handleColorQuantityChange(color, Number(e.target.value))}
                              className="w-16 text-center input"
                              placeholder="الكمية"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="btn btn-secondary mb-2"
                      >
                        إضافة لون مخصص
                      </button>
                      {showColorPicker && (
                        <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg">
                          <HexColorPicker color={customColor} onChange={setCustomColor} />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!newProduct.customColors) {
                                  newProduct.customColors = []
                                }
                                if (!newProduct.customColors.some(c => c.color === customColor)) {
                                  newProduct.customColors.push({ color: customColor, quantity: 0 })
                                  setNewProduct({ ...newProduct })
                                }
                                setShowColorPicker(false)
                              }}
                              className="btn btn-primary"
                            >
                              إضافة
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowColorPicker(false)}
                              className="btn btn-secondary"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      )}
                      {newProduct.customColors && newProduct.customColors.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-2">
                          {newProduct.customColors.map(({ color, quantity }) => (
                            <div key={`add-custom-${color}`} className="flex flex-col items-center gap-2">
                              <div className="relative group">
                                <div
                                  className="h-8 w-8 rounded-full border-2 border-primary-600"
                                  style={{ backgroundColor: color }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    newProduct.customColors = newProduct.customColors?.filter(c => c.color !== color)
                                    const totalQuantity = [...newProduct.colors, ...(newProduct.customColors || [])].reduce((sum, c) => sum + c.quantity, 0)
                                    setNewProduct({ ...newProduct, stock: totalQuantity })
                                  }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => handleCustomColorQuantityChange(color, Number(e.target.value))}
                                className="w-16 text-center input"
                                placeholder="الكمية"
                              />
                            </div>
                          ))}
                        </div>
                      )}
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
                      value={Number(
                        (newProduct.colors?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0) + 
                          (newProduct.customColors?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0)
                      )}
                      readOnly
                      className="input bg-gray-100"
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

        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsEditModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-xl font-bold mb-4">تعديل المنتج</h2>
                <form onSubmit={handleEditProduct} className="space-y-4">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الصورة</label>
                    {selectedProduct.image && (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="h-20 w-20 rounded-lg object-cover mb-2"
                      />
                    )}
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
                      value={selectedProduct.name}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الفئة</label>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
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
                          onClick={() => {
                            const newSizes = selectedProduct.sizes.includes(size)
                              ? selectedProduct.sizes.filter(s => s !== size)
                              : [...selectedProduct.sizes, size].sort((a, b) => a - b)
                            setSelectedProduct({ ...selectedProduct, sizes: newSizes })
                          }}
                          className={`rounded-full px-3 py-1 text-sm ${
                            selectedProduct.sizes.includes(size)
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {AVAILABLE_COLORS.map((color: string) => (
                        <div key={`edit-${selectedProduct.id}-${color}`} className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = selectedProduct.colors.some(c => c.color === color)
                                ? selectedProduct.colors.filter(c => c.color !== color)
                                : [...selectedProduct.colors, { color, quantity: 0 }]
                              const totalQuantity = calculateTotalQuantity(newColors, selectedProduct.customColors)
                              setSelectedProduct({ ...selectedProduct, colors: newColors, stock: totalQuantity })
                            }}
                            className={`h-8 w-8 rounded-full border-2 ${
                              selectedProduct.colors.some(c => c.color === color)
                                ? 'border-primary-600'
                                : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                          {selectedProduct.colors.some(c => c.color === color) && (
                            <input
                              type="number"
                              min="0"
                              value={selectedProduct.colors.find(c => c.color === color)?.quantity || 0}
                              onChange={(e) => {
                                const newColors = selectedProduct.colors.map(c => 
                                  c.color === color ? { ...c, quantity: Number(e.target.value) } : c
                                )
                                const totalQuantity = calculateTotalQuantity(newColors, selectedProduct.customColors)
                                setSelectedProduct({ ...selectedProduct, colors: newColors, stock: totalQuantity })
                              }}
                              className="w-16 text-center input"
                              placeholder="الكمية"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="btn btn-secondary mb-2"
                      >
                        إضافة لون مخصص
                      </button>
                      {showColorPicker && (
                        <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg">
                          <HexColorPicker color={customColor} onChange={setCustomColor} />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedProduct.customColors) {
                                  selectedProduct.customColors = []
                                }
                                if (!selectedProduct.customColors.some(c => c.color === customColor)) {
                                  selectedProduct.customColors.push({ color: customColor, quantity: 0 })
                                  setSelectedProduct({ ...selectedProduct })
                                }
                                setShowColorPicker(false)
                              }}
                              className="btn btn-primary"
                            >
                              إضافة
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowColorPicker(false)}
                              className="btn btn-secondary"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      )}
                      {selectedProduct.customColors && selectedProduct.customColors.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-2">
                          {selectedProduct.customColors.map(({ color, quantity }) => (
                            <div key={`edit-custom-${selectedProduct.id}-${color}`} className="flex flex-col items-center gap-2">
                              <div className="relative group">
                                <div
                                  className="h-8 w-8 rounded-full border-2 border-primary-600"
                                  style={{ backgroundColor: color }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCustomColors = selectedProduct.customColors?.filter(c => c.color !== color) || []
                                    const totalQuantity = calculateTotalQuantity(selectedProduct.colors, newCustomColors)
                                    setSelectedProduct({ 
                                      ...selectedProduct, 
                                      customColors: newCustomColors,
                                      stock: totalQuantity 
                                    })
                                  }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => {
                                  const newCustomColors = selectedProduct.customColors?.map(c => 
                                    c.color === color ? { ...c, quantity: Number(e.target.value) } : c
                                  ) || []
                                  const totalQuantity = calculateTotalQuantity(selectedProduct.colors, newCustomColors)
                                  setSelectedProduct({ 
                                    ...selectedProduct, 
                                    customColors: newCustomColors,
                                    stock: totalQuantity 
                                  })
                                }}
                                className="w-16 text-center input"
                                placeholder="الكمية"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">السعر</label>
                    <input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                      className="input"
                      required
                      min="0"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">المخزون</label>
                    <input
                      type="number"
                      value={Number(
                        (selectedProduct.colors?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0) + 
                          (selectedProduct.customColors?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0)
                      )}
                      readOnly
                      className="input bg-gray-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-secondary-900">الوصف</label>
                    <textarea
                      value={selectedProduct.description}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                      className="input"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="btn btn-secondary"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري التحديث...' : 'تحديث'}
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