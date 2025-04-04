'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'كيف يمكنني إرجاع منتج؟',
    answer: 'يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام. يجب أن يكون المنتج بحالته الأصلية مع جميع الملحقات والتغليف. يرجى التواصل مع خدمة العملاء لبدء عملية الإرجاع.'
  },
  {
    question: 'ما هي سياسة الشحن؟',
    answer: 'نقدم خدمة شحن مجانية للطلبات التي تتجاوز قيمتها 200 ريال. يتم الشحن خلال 2-5 أيام عمل. يمكنك تتبع طلبك من خلال رقم التتبع الذي يتم إرساله عبر البريد الإلكتروني.'
  },
  {
    question: 'هل يمكنني تغيير حجم المنتج بعد الشراء؟',
    answer: 'نعم، يمكنك تغيير حجم المنتج خلال فترة الإرجاع (14 يوماً). يرجى التواصل مع خدمة العملاء لتنسيق عملية الاستبدال.'
  },
  {
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نقبل جميع البطاقات الائتمانية الرئيسية، والمدى، والدفع عند الاستلام. جميع المعاملات تتم بشكل آمن ومشفر.'
  },
  {
    question: 'كيف يمكنني تتبع طلبي؟',
    answer: 'بعد إتمام عملية الشراء، سيتم إرسال رقم تتبع الطلب إلى بريدك الإلكتروني. يمكنك استخدام هذا الرقم لتتبع حالة طلبك على موقعنا.'
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">الأسئلة الشائعة</h1>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => toggleAccordion(index)}
            >
              <span className="text-xl">{item.question}</span>
              {openIndex === index ? (
                <FiChevronUp className="w-5 h-5 text-primary-600" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-primary-600" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-secondary-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 