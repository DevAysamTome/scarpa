'use client'

import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'

interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date().toISOString(),
      })
      
      toast.success('تم إرسال رسالتك بنجاح')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('حدث خطأ أثناء إرسال الرسالة')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-arabic">اتصل بنا</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 font-arabic">معلومات الاتصال</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <FiMapPin className="text-primary-600 mt-1 ml-3" size={20} />
              <div>
                <h3 className="font-semibold mb-1 font-arabic">العنوان</h3>
                <p className="text-secondary-600 font-arabic">شارع الرئيسي، المدينة</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiPhone className="text-primary-600 mt-1 ml-3" size={20} />
              <div>
                <h3 className="font-semibold mb-1 font-arabic">الهاتف</h3>
                <p className="text-secondary-600 font-arabic">+123 456 789</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMail className="text-primary-600 mt-1 ml-3" size={20} />
              <div>
                <h3 className="font-semibold mb-1 font-arabic">البريد الإلكتروني</h3>
                <p className="text-secondary-600">info@scarpashoes.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiClock className="text-primary-600 mt-1 ml-3" size={20} />
              <div>
                <h3 className="font-semibold mb-1 font-arabic">ساعات العمل</h3>
                <p className="text-secondary-600 font-arabic">9 ص - 10 م</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 h-[200px] bg-secondary-100 rounded-lg">
            {/* Add your map component here */}
            <div className="w-full h-full flex items-center justify-center text-secondary-400 font-arabic">
              خريطة الموقع
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 font-arabic">أرسل لنا رسالة</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-900 mb-2 font-arabic">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-900 mb-2 font-arabic">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-900 mb-2 font-arabic">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary-900 mb-2 font-arabic">
                الرسالة
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-10"
              disabled={loading}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 