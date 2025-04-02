import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FirebaseProvider } from '@/contexts/firebase-context'
import { CartProvider } from '@/contexts/cart-context'

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
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="top-center" />
            </CartProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
