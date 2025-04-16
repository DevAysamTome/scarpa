'use client'

import { useState, useEffect } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { PolicyPage, FAQItem } from '@/types/policy'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFAQContent()
  }, [])

  const fetchFAQContent = async () => {
    try {
      const docRef = doc(db, 'policyPages', 'faq')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as PolicyPage
        if (data.faqItems && data.faqItems.length > 0) {
          setFaqItems(data.faqItems)
        }
      }
    } catch (error) {
      console.error('Error fetching FAQ content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
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