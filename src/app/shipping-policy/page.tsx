'use client'

import { FiTruck, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi'

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">سياسة الشحن والتوصيل</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiTruck className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">خدمات الشحن</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>نقدم خدمة شحن لجميع مناطق الوطن</li>
            <li>الشحن مجاني للطلبات التي تتجاوز قيمتها 200 شيكل</li>
            <li>رسوم الشحن للطلبات أقل من 200 شيكل هي 30 شيكل</li>
            <li>نستخدم شركات شحن موثوقة لضمان وصول منتجاتك بأمان</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiClock className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">مدة التوصيل</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>يتم معالجة الطلبات خلال 24-48 ساعة</li>
            <li>مدة التوصيل 2-5 أيام عمل</li>
            <li>يمكن تتبع حالة الطلب من خلال رقم التتبع</li>
            <li>سيتم إرسال رقم التتبع عبر البريد الإلكتروني والرسائل النصية</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiMapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">مناطق التوصيل</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary-600">
            <div>
              <h3 className="font-bold mb-2">المناطق الرئيسية</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>جنين</li>
                <li>طولكرم</li>
                <li>نابلس</li>
                <li>رام الله</li>
                <li>الخليل</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">المناطق الأخرى</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>جميع المدن الرئيسية</li>
                <li>المناطق الصناعية</li>
                <li>المناطق السكنية</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiDollarSign className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">رسوم الشحن الإضافية</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>لا توجد رسوم إضافية للشحن داخل المدن الرئيسية</li>
            <li>قد تتطلب بعض المناطق النائية رسوماً إضافية</li>
            <li>سيتم إخطارك بأي رسوم إضافية قبل تأكيد الطلب</li>
            <li>يمكنك التواصل مع خدمة العملاء للاستفسار عن رسوم الشحن لمنطقتك</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-secondary-600 text-center">
            إذا كان لديك أي استفسارات حول سياسة الشحن والتوصيل، يرجى التواصل مع خدمة العملاء
          </p>
        </div>
      </div>
    </div>
  )
} 