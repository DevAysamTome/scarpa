'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import ProtectedRoute from '@/components/auth/protected-route'
import toast from 'react-hot-toast'
import { AboutContent } from '@/types/about'

const initialContent: Omit<AboutContent, 'id'> = {
  title: '',
  description: '',
  image: '',
  mission: '',
  vision: '',
  values: [],
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'about'))
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        setAboutContent({
          id: doc.id,
          ...doc.data()
        } as AboutContent)
      } else {
        // If no content exists, create initial content
        const aboutRef = doc(db, 'about', 'about')
        await setDoc(aboutRef, initialContent)
        setAboutContent({
          id: 'about',
          ...initialContent
        })
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
      toast.error('حدث خطأ أثناء جلب محتوى الصفحة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      let imageUrl = aboutContent?.image
      if (selectedImage) {
        const storageRef = ref(storage, `about/${Date.now()}-${selectedImage.name}`)
        await uploadBytes(storageRef, selectedImage)
        imageUrl = await getDownloadURL(storageRef)
      }

      const aboutRef = doc(db, 'about', 'about')
      await setDoc(aboutRef, {
        ...aboutContent,
        image: imageUrl,
        updatedAt: new Date()
      })

      toast.success('تم تحديث المحتوى بنجاح')
      fetchAboutContent()
    } catch (error) {
      console.error('Error updating about content:', error)
      toast.error('حدث خطأ أثناء تحديث المحتوى')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-theme(space.16))] p-4 sm:p-6 pb-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">إدارة محتوى صفحة من نحن</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={aboutContent?.title || ''}
                  onChange={(e) => setAboutContent(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  الصورة
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="input w-full"
                  accept="image/*"
                />
                {aboutContent?.image && (
                  <img
                    src={aboutContent.image}
                    alt="About"
                    className="mt-2 h-32 w-32 object-cover rounded"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  الوصف
                </label>
                <textarea
                  value={aboutContent?.description || ''}
                  onChange={(e) => setAboutContent(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="input w-full"
                  rows={4}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  المهمة
                </label>
                <textarea
                  value={aboutContent?.mission || ''}
                  onChange={(e) => setAboutContent(prev => prev ? {...prev, mission: e.target.value} : null)}
                  className="input w-full"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  الرؤية
                </label>
                <textarea
                  value={aboutContent?.vision || ''}
                  onChange={(e) => setAboutContent(prev => prev ? {...prev, vision: e.target.value} : null)}
                  className="input w-full"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  القيم (كل قيمة في سطر جديد)
                </label>
                <textarea
                  value={aboutContent?.values?.join('\n') || ''}
                  onChange={(e) => setAboutContent(prev => prev ? {...prev, values: e.target.value.split('\n').filter(v => v.trim())} : null)}
                  className="input w-full"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
} 