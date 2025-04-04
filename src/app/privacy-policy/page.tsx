'use client'

import { FiShield, FiLock, FiUser, FiGlobe } from 'react-icons/fi'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">سياسة الخصوصية</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">مقدمة</h2>
          </div>
          <p className="text-secondary-600">
            نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية. تشرح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام موقعنا.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiUser className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">المعلومات التي نجمعها</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>الاسم الكامل</li>
            <li>عنوان البريد الإلكتروني</li>
            <li>رقم الجوال</li>
            <li>العنوان</li>
            <li>معلومات الدفع</li>
            <li>بيانات الطلبات</li>
            <li>معلومات التصفح</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiLock className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">كيف نستخدم معلوماتك</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>معالجة طلباتك وإتمام عمليات الشراء</li>
            <li>التواصل معك بخصوص طلباتك</li>
            <li>إرسال تحديثات عن المنتجات والعروض</li>
            <li>تحسين تجربة التسوق لديك</li>
            <li>تحليل استخدام الموقع</li>
            <li>حماية أمن حسابك</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiGlobe className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">حماية معلوماتك</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>نستخدم تقنيات تشفير متقدمة لحماية بياناتك</li>
            <li>نلتزم بمعايير أمان البيانات العالمية</li>
            <li>نقوم بتحديث إجراءات الأمان بشكل دوري</li>
            <li>نوفر حماية لبيانات الدفع</li>
            <li>نحتفظ ببياناتك فقط للفترة اللازمة</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">حقوقك</h2>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>الحق في الوصول إلى بياناتك الشخصية</li>
            <li>الحق في تصحيح بياناتك</li>
            <li>الحق في حذف بياناتك</li>
            <li>الحق في الاعتراض على معالجة بياناتك</li>
            <li>الحق في نقل بياناتك</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-secondary-600 text-center">
            إذا كان لديك أي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف
          </p>
        </div>
      </div>
    </div>
  )
} 