import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { FAQItem } from '@/types/policy';

const defaultFAQItems: FAQItem[] = [
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
];

const defaultPolicyPages = [
  {
    slug: 'faq',
    title: 'الأسئلة الشائعة',
    content: '',
    faqItems: defaultFAQItems
  },
  {
    slug: 'privacy-policy',
    title: 'سياسة الخصوصية',
    content: 'هذه سياسة الخصوصية تصف كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام موقعنا.',
  },
  {
    slug: 'shipping-policy',
    title: 'سياسة الشحن والتوصيل',
    content: 'تعرف على طرق الشحن وأوقات التوصيل ومعلومات التتبع.',
  },
  {
    slug: 'return-policy',
    title: 'سياسة الإرجاع',
    content: 'سياسة الإرجاع لدينا تحدد الشروط والأحكام لإرجاع المنتجات.',
  },
];

export async function initializePolicyPages() {
  try {
    const policyPagesRef = collection(db, 'policyPages');
    const snapshot = await getDocs(policyPagesRef);
    
    if (snapshot.empty) {
      // Initialize policy pages if they don't exist
      for (const page of defaultPolicyPages) {
        const docRef = doc(policyPagesRef, page.slug);
        await setDoc(docRef, {
          ...page,
          lastUpdated: new Date(),
        });
      }
      console.log('Policy pages initialized successfully');
    } else {
      console.log('Policy pages already exist');
    }
  } catch (error) {
    console.error('Error initializing policy pages:', error);
  }
} 