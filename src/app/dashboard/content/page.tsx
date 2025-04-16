'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';
import { PolicyPage, FAQItem } from '@/types/policy';
import { FiEdit2, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { initializePolicyPages } from '@/lib/init-policy-pages';

export default function ContentManagement() {
  const [policyPages, setPolicyPages] = useState<PolicyPage[]>([]);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingFAQItems, setEditingFAQItems] = useState<FAQItem[]>([]);
  const [newFAQItem, setNewFAQItem] = useState<FAQItem>({ question: '', answer: '' });

  useEffect(() => {
    setupPolicyPages();
  }, []);

  const setupPolicyPages = async () => {
    try {
      setIsLoading(true);
      await initializePolicyPages();
      await fetchPolicyPages();
    } catch (error) {
      console.error('Error setting up policy pages:', error);
      toast.error('Failed to initialize policy pages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPolicyPages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'policyPages'));
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PolicyPage[];
      setPolicyPages(pages);
    } catch (error) {
      console.error('Error fetching policy pages:', error);
      toast.error('Failed to load policy pages');
    }
  };

  const handleEdit = (page: PolicyPage) => {
    setEditingPage(page.id);
    setEditContent(page.content);
    if (page.faqItems) {
      setEditingFAQItems([...page.faqItems]);
    }
  };

  const handleSave = async (pageId: string) => {
    try {
      const pageRef = doc(db, 'policyPages', pageId);
      const page = policyPages.find(p => p.id === pageId);
      
      if (page?.slug === 'faq') {
        await setDoc(pageRef, {
          content: editContent,
          faqItems: editingFAQItems,
          lastUpdated: new Date()
        }, { merge: true });
      } else {
        await setDoc(pageRef, {
          content: editContent,
          lastUpdated: new Date()
        }, { merge: true });
      }
      
      setEditingPage(null);
      toast.success('Content updated successfully');
      fetchPolicyPages();
    } catch (error) {
      console.error('Error updating policy page:', error);
      toast.error('Failed to update content');
    }
  };

  const handleAddFAQItem = () => {
    if (newFAQItem.question && newFAQItem.answer) {
      setEditingFAQItems([...editingFAQItems, { ...newFAQItem }]);
      setNewFAQItem({ question: '', answer: '' });
    }
  };

  const handleRemoveFAQItem = (index: number) => {
    const updatedItems = [...editingFAQItems];
    updatedItems.splice(index, 1);
    setEditingFAQItems(updatedItems);
  };

  const handleUpdateFAQItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedItems = [...editingFAQItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditingFAQItems(updatedItems);
  };

  const getPageTitle = (slug: string) => {
    switch (slug) {
      case 'faq':
        return 'الأسئلة الشائعة';
      case 'privacy-policy':
        return 'سياسة الخصوصية';
      case 'shipping-policy':
        return 'سياسة الشحن والتوصيل';
      case 'return-policy':
        return 'سياسة الإرجاع';
      default:
        return slug;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">إدارة المحتوى</h1>
        
        <div className="grid gap-6">
          {policyPages.map((page) => (
            <div key={page.id} className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{getPageTitle(page.slug)}</h2>
                <div className="flex gap-2">
                  {editingPage === page.id ? (
                    <button
                      onClick={() => handleSave(page.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      <FiSave /> حفظ
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(page)}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary-200 dark:bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300"
                    >
                      <FiEdit2 /> تعديل
                    </button>
                  )}
                </div>
              </div>
              
              {editingPage === page.id ? (
                page.slug === 'faq' ? (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {editingFAQItems.map((item, index) => (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">سؤال {index + 1}</h3>
                            <button 
                              onClick={() => handleRemoveFAQItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => handleUpdateFAQItem(index, 'question', e.target.value)}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="السؤال"
                          />
                          <textarea
                            value={item.answer}
                            onChange={(e) => handleUpdateFAQItem(index, 'answer', e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={3}
                            placeholder="الإجابة"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="border p-4 rounded-lg bg-gray-50">
                      <h3 className="font-semibold mb-2">إضافة سؤال جديد</h3>
                      <input
                        type="text"
                        value={newFAQItem.question}
                        onChange={(e) => setNewFAQItem({ ...newFAQItem, question: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="السؤال"
                      />
                      <textarea
                        value={newFAQItem.answer}
                        onChange={(e) => setNewFAQItem({ ...newFAQItem, answer: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                        placeholder="الإجابة"
                      />
                      <button
                        onClick={handleAddFAQItem}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        <FiPlus /> إضافة
                      </button>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                )
              ) : (
                page.slug === 'faq' ? (
                  <div className="space-y-4">
                    {page.faqItems?.map((item, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">{item.question}</h3>
                        <p className="text-secondary-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    {page.content}
                  </div>
                )
              )}
              
              <div className="mt-4 text-sm text-secondary-500">
                آخر تحديث: {new Date(page.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
} 