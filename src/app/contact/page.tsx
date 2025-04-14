'use client'

import React from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-arabic">اتصل بنا</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="dark:bg-dark-card p-8 rounded-lg shadow-md">
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
        <ContactForm />
      </div>
    </div>
  );
} 