'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '../lib/products';

export interface CartItem {
  cartItemId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  flavor?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  grandTotal: number;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  lastAddedItem: { product: Product; variant: ProductVariant } | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number, flavor?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  setExactQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'faaf_cart_items_v2';

export function CartProvider({ children, threshold = 99 }: { children: React.ReactNode, threshold?: number }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAddedItem, setLastAddedItem] = useState<{ product: Product; variant: ProductVariant } | null>(null);
  const [appliedCoupon, setAppliedCouponState] = useState<Coupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedItems: CartItem[] = JSON.parse(saved);
        // Rule 7: Capping persistence
        const cappedItems = parsedItems.map(item => {
          const maxQty = item.variant.stockQuantity ?? Infinity;
          if (item.quantity > maxQty) {
            return { ...item, quantity: maxQty };
          }
          return item;
        }).filter(item => item.quantity > 0 && item.variant.inStock !== false);
        setItems(cappedItems);
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
    try {
      const savedCoupon = localStorage.getItem('faaf_cart_coupon');
      if (savedCoupon) {
        setAppliedCouponState(JSON.parse(savedCoupon));
      }
    } catch (e) {}
    setIsHydrated(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [items, isHydrated]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const openSearch = (initialQuery = '') => {
    setSearchQuery(initialQuery);
    setIsSearchOpen(true);
  };
  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1, flavor?: string) => {
    const selectedVariant = variant || product.variants[0];
    
    // Check stock globally
    if (selectedVariant.stockQuantity !== undefined && selectedVariant.stockQuantity <= 0) {
      alert("This item is out of stock.");
      return;
    }
    if (selectedVariant.inStock === false) {
      alert("This item is out of stock.");
      return;
    }

    const unitPrice = selectedVariant.price ?? product.price;
    const flavorSuffix = flavor ? `-${flavor}` : '';
    const cartItemId = `${product.id}-${selectedVariant.id}${flavorSuffix}`;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const currentQty = updated[existingIndex].quantity;
        const maxQty = selectedVariant.stockQuantity ?? Infinity;
        
        let newQty = currentQty + quantity;
        if (newQty > maxQty) {
          alert(`Only ${maxQty} available. You cannot add more to your cart.`);
          newQty = maxQty;
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const maxQty = selectedVariant.stockQuantity ?? Infinity;
        let initialQty = quantity;
        if (initialQty > maxQty) {
          alert(`Only ${maxQty} available.`);
          initialQty = maxQty;
        }
        return [
          ...prevItems,
          {
            cartItemId,
            product,
            variant: selectedVariant,
            quantity: initialQty,
            unitPrice,
            flavor,
          },
        ];
      }
    });

    setLastAddedItem({ product, variant: selectedVariant });
    setIsCartOpen(true);

    setTimeout(() => {
      setLastAddedItem(null);
    }, 4000);
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const maxQty = item.variant.stockQuantity ?? Infinity;
            let newQty = item.quantity + delta;
            
            if (newQty > maxQty) {
              newQty = maxQty;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const setExactQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const maxQty = item.variant.stockQuantity ?? Infinity;
          let newQty = quantity;
          if (newQty > maxQty) {
            newQty = maxQty;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.min_order_amount) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = subtotal * (appliedCoupon.discount_value / 100);
    } else if (appliedCoupon.discount_type === 'fixed') {
      discountAmount = appliedCoupon.discount_value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  } else if (appliedCoupon && subtotal < appliedCoupon.min_order_amount) {
    // Subtotal dropped below min order value
    setAppliedCouponState(null);
    localStorage.removeItem('faaf_cart_coupon');
  }

  const freeShippingRemaining = Math.max(0, threshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const shippingCost = freeShippingRemaining === 0 ? 0 : 9.99;
  const grandTotal = items.length > 0 ? (subtotal - discountAmount + shippingCost) : 0;

  const setAppliedCoupon = (coupon: Coupon | null) => {
    setAppliedCouponState(coupon);
    if (coupon) {
      localStorage.setItem('faaf_cart_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('faaf_cart_coupon');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        freeShippingThreshold: threshold,
        freeShippingRemaining,
        freeShippingProgress,
        appliedCoupon,
        discountAmount,
        grandTotal,
        isCartOpen,
        isSearchOpen,
        searchQuery,
        lastAddedItem,
        openCart,
        closeCart,
        toggleCart,
        openSearch,
        closeSearch,
        setSearchQuery,
        addItem,
        removeItem,
        updateQuantity,
        setExactQuantity,
        clearCart,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
