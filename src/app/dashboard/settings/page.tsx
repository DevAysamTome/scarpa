'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/protected-route';
import toast from 'react-hot-toast';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  currency: string;
  taxRate: number;
  shippingCost: number;
}

const DEFAULT_SETTINGS: Settings = {
  siteName: 'متجر الأحذية',
  siteDescription: 'متجر متخصص في بيع الأحذية الرياضية والكلاسيكية',
  contactEmail: 'info@shoes.com',
  contactPhone: '+966500000000',
  address: 'الرياض، المملكة العربية السعودية',
  socialMedia: {
    facebook: 'https://facebook.com/shoes',
    twitter: 'https://twitter.com/shoes',
    instagram: 'https://instagram.com/shoes',
  },
  currency: 'ريال',
  taxRate: 15,
  shippingCost: 30,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      } else {
        await setDoc(docRef, DEFAULT_SETTINGS);
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('حدث خطأ أثناء جلب الإعدادات');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">الإعدادات</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">معلومات الموقع</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">اسم الموقع</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">وصف الموقع</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">معلومات الاتصال</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">رقم الهاتف</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-secondary-900">العنوان</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">روابط التواصل الاجتماعي</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">فيسبوك</label>
                <input
                  type="url"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">تويتر</label>
                <input
                  type="url"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">انستغرام</label>
                <input
                  type="url"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                  })}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">إعدادات المبيعات</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">العملة</label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">نسبة الضريبة (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="input"
                  required
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-900">تكلفة الشحن</label>
                <input
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })}
                  className="input"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
} 