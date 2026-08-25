'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';

export default function IntentRestorer() {
  const { addItem, openCart } = useCart();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const pendingItemStr = sessionStorage.getItem('pendingCartAdd');
    if (pendingItemStr) {
      try {
        const { product, variant, quantity, flavor } = JSON.parse(pendingItemStr);
        if (product && variant && quantity) {
          addItem(product, variant, quantity, flavor);
          openCart();
        }
      } catch (err) {
        console.error('Failed to parse pending cart intent', err);
      } finally {
        sessionStorage.removeItem('pendingCartAdd');
      }
    }
  }, [addItem, openCart]);

  return null;
}
