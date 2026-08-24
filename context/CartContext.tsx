'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '../lib/products';

export interface CartItem {
  cartItemId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
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
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  setExactQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'faaf_cart_items_v2';
const FREE_SHIPPING_THRESHOLD = 99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAddedItem, setLastAddedItem] = useState<{ product: Product; variant: ProductVariant } | null>(null);
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

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1) => {
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
    const cartItemId = `${product.id}-${selectedVariant.id}`;

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
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        freeShippingProgress,
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
