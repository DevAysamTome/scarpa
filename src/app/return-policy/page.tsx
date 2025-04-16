'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { PolicyPage } from '@/types/policy'

export default function ReturnPolicyPage() {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReturnPolicyContent()
  }, [])

  const fetchReturnPolicyContent = async () => {
    try {
      const docRef = doc(db, 'policyPages', 'return-policy')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as PolicyPage
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error fetching return policy content:', error)
    } finally {
      setIsLoading(false)
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">سياسة الإرجاع</h1>
      
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
} 