import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FirebaseProvider } from '@/contexts/firebase-context'
import { CartProvider } from '@/contexts/cart-context'
import { FavoritesProvider } from '@/contexts/favorites-context'
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "سكاربا - متجر الأحذية",
  description: "متجر متخصص في بيع الأحذية الرياضية والكلاسيكية",
  keywords: "shoes, footwear, premium shoes, Scarpa Shoes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <FirebaseProvider>
              <CartProvider>
                <FavoritesProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      {children}
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </div>
                  <Toaster position="top-center" />
                </FavoritesProvider>
              </CartProvider>
            </FirebaseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
