'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('تم إرسال رسالتك بنجاح');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark:bg-dark-card p-8 rounded-lg shadow-md">
      <h2 className="text-2xl dark:text-white font-bold mb-6 font-arabic">أرسل لنا رسالة</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium dark:text-white mb-2 font-arabic">
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
          <label htmlFor="email" className="block text-sm font-medium dark:text-white mb-2 font-arabic">
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
          <label htmlFor="phone" className="block text-sm font-medium dark:text-white mb-2 font-arabic">
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
          <label htmlFor="message" className="block text-sm font-medium dark:text-white mb-2 font-arabic">
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 