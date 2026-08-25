import type { Metadata } from 'next';
import './globals.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SearchModal from '../components/SearchModal';
import Chatbot from '../components/Chatbot';

import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../components/AuthProvider';
import { createClient } from '@/utils/supabase/server';
import { fetchAppConfig, StoreSettings } from '@/lib/config';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'FAAF Fitness Magic | Premium Athletic Nutrition & Supplements',
  appleWebApp: {
    capable: true,
    title: 'FAAF Store',
    statusBarStyle: 'black-translucent',
  },

  description:
    'Discover pure, science-backed athletic supplements, 100% whey isolate, performance creatine, and protein snacks engineered for peak fitness performance.',

  keywords: [
    'fitness supplements',
    'whey protein isolate',
    'creatine monohydrate',
    'protein bars',
    'pre-workout',
    'FAAF fitness',
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const initialUser = session?.user ?? null;
  
  // Fetch global store settings for Header and Footer
  const storeSettings = await fetchAppConfig<StoreSettings>('store_settings');

  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={initialUser}>
          <CartProvider threshold={storeSettings?.freeShippingThreshold || 99}>

            {/* Website Header */}
            <Header settings={storeSettings} />

            {/* Shopping Cart */}
            <CartDrawer />

            {/* Search */}
            <SearchModal />

            {/* Main Website Content */}
            {children}

            {/* Footer */}
            <Footer settings={storeSettings} />

            {/* FAAF AI Chatbot */}
            <Chatbot />

          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}