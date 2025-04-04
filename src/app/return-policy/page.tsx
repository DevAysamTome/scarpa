'use client'

import { FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi'

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">سياسة الإرجاع والاستبدال</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiPackage className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">شروط الإرجاع</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>يمكن إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام</li>
            <li>يجب أن يكون المنتج بحالته الأصلية وغير مستخدم</li>
            <li>يجب إرجاع جميع الملحقات والتغليف الأصلي</li>
            <li>يجب أن يكون المنتج في العبوة الأصلية</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiClock className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">خطوات الإرجاع</h2>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-secondary-600">
            <li>تواصل مع خدمة العملاء عبر البريد الإلكتروني أو الهاتف</li>
            <li>قدم رقم الطلب وسبب الإرجاع</li>
            <li>سيتم إرسال تعليمات الإرجاع إليك</li>
            <li>قم بتغليف المنتج بشكل آمن</li>
            <li>أرسل المنتج إلى العنوان المحدد</li>
            <li>سيتم مراجعة المنتج وإتمام عملية الإرجاع خلال 5-7 أيام عمل</li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiCheckCircle className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">سياسة الاسترداد</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-secondary-600">
            <li>سيتم استرداد المبلغ خلال 14 يوماً من استلام المنتج</li>
            <li>يمكن استرداد المبلغ بنفس طريقة الدفع الأصلية</li>
            <li>في حالة الدفع بالبطاقة الائتمانية، قد تستغرق عملية الاسترداد 5-10 أيام عمل</li>
            <li>سيتم خصم رسوم الشحن من مبلغ الاسترداد في حالة الإرجاع</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-secondary-600 text-center">
            إذا كان لديك أي استفسارات حول سياسة الإرجاع والاستبدال، يرجى التواصل مع خدمة العملاء
          </p>
        </div>
      </div>
    </div>
  )
} 