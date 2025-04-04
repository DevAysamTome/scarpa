import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`dark:bg-dark-card  py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-arabic">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="dark:dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="dark:dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  الأقسام
                </Link>
              </li>
              <li>
                <Link href="/about" className="dark:dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  عن الشركة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="dark:dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-arabic">خدمة العملاء</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="dark:text-secondary-300 hover:text-primary-400 font-arabic">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-arabic">معلومات الاتصال</h3>
            <ul className="space-y-2 dark:text-secondary-300">
              <li className="flex items-center gap-2 font-arabic">
                <FiMapPin className="text-primary-400" />
                <span>العنوان: شارع الرئيسي، المدينة</span>
              </li>
              <li className="flex items-center gap-2 font-arabic">
                <FiPhone className="text-primary-400" />
                <span>الهاتف: +123 456 789</span>
              </li>
              <li className="flex items-center gap-2 font-arabic">
                <FiMail className="text-primary-400" />
                <span>البريد الإلكتروني: info@scarpashoes.com</span>
              </li>
              <li className="font-arabic">ساعات العمل: 9 ص - 10 م</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center dark:text-secondary-300">
          <p className="font-arabic">
            © جميع الحقوق محفوظة لدى شركة تكنو كور {new Date().getFullYear()} 
          </p>
        </div>
      </div>
    </footer>
  )
} 