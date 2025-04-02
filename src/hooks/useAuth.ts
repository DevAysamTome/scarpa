import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // Set auth cookie when user is logged in
        Cookies.set('auth', 'true', { expires: 7 }); // Cookie expires in 7 days
      } else {
        // Remove auth cookie when user is logged out
        Cookies.remove('auth');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, loading };
} 