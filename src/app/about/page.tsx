'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { AboutContent } from '@/types/about'
import { FiCheck } from 'react-icons/fi'

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutContent() {
      try {
        const querySnapshot = await getDocs(collection(db, 'about'))
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          setAboutContent({
            id: doc.id,
            ...doc.data()
          } as AboutContent)
        }
      } catch (error) {
        console.error('Error fetching about content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!aboutContent) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">لا يوجد محتوى متاح</h1>
        <p className="text-secondary-600">يرجى المحاولة مرة أخرى لاحقاً</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={aboutContent.image}
              alt={aboutContent.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-6 font-arabic">{aboutContent.title}</h1>
            <p className="text-lg text-secondary-600 mb-8 font-arabic leading-relaxed">
              {aboutContent.description}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 font-arabic">مهمتنا</h2>
            <p className="text-secondary-600 font-arabic leading-relaxed">
              {aboutContent.mission}
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 font-arabic">رؤيتنا</h2>
            <p className="text-secondary-600 font-arabic leading-relaxed">
              {aboutContent.vision}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6 font-arabic">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutContent.values.map((value, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1">
                  <FiCheck className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-secondary-600 font-arabic">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 