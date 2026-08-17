import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SearchModal from '../components/SearchModal';
import { CartProvider } from '../context/CartContext';

export const metadata: Metadata = {
  title: 'FAAF Fitness Magic | Premium Athletic Nutrition & Supplements',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <CartDrawer />
          <SearchModal />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
