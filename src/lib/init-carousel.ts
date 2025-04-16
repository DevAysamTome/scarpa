import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const defaultCarouselItems = [
  {
    title: 'أحذية عصرية',
    description: 'اكتشف مجموعتنا المميزة من الأحذية العصرية بأحدث التصاميم',
    image: 'https://images.unsplash.com/photo-1549298916-b41d0d673796?q=80&w=2070&auto=format&fit=crop',
    link: '/products',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'عروض خاصة',
    description: 'خصومات تصل إلى 50% على مجموعة مختارة من الأحذية',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
    link: '/products',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'أحذية رياضية',
    description: 'أحذية رياضية عالية الجودة للراحة والأداء المثالي',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop',
    link: '/products',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function initializeCarousel() {
  try {
    const carouselRef = collection(db, 'carousel');
    const snapshot = await getDocs(carouselRef);
    
    if (snapshot.empty) {
      console.log('Initializing carousel items...');
      for (const item of defaultCarouselItems) {
        await addDoc(carouselRef, item);
      }
      console.log('Carousel items initialized successfully');
    } else {
      console.log('Carousel items already exist');
    }
  } catch (error) {
    console.error('Error initializing carousel items:', error);
  }
} 