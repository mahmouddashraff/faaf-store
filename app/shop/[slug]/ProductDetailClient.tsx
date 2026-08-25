'use client';

import React, { useState } from 'react';
import { Product, ProductVariant, formatPrice } from '../../../lib/products';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'default', name: 'Standard' }
  );
  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.flavors && product.flavors.length > 0 ? product.flavors[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  const activePrice = selectedVariant.price ?? product.price;
  const maxQty = selectedVariant.stockQuantity ?? Infinity;
  const isOutOfStock = selectedVariant.inStock === false || (selectedVariant.stockQuantity !== undefined && selectedVariant.stockQuantity <= 0);

  const handleAddToCart = () => {
    if (loading) return; // wait for auth
    
    if (!user) {
      // Unauthenticated, save intent and redirect
      const intent = { product, variant: selectedVariant, quantity, flavor: selectedFlavor || undefined };
      sessionStorage.setItem('pendingCartAdd', JSON.stringify(intent));
      router.push('/login');
      return;
    }

    // Authenticated, add to cart
    addItem(product, selectedVariant, quantity, selectedFlavor || undefined);
    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="product-purchase-module">
      <div className="product-price-box">
        <span className="product-price-current">{formatPrice(activePrice)}</span>
        {product.originalPrice && (
          <span className="product-price-original">{formatPrice(product.originalPrice)}</span>
        )}
      </div>

      <div className="product-options">
        {product.variants.filter(v => v.name.toLowerCase() !== 'default' && v.name.toLowerCase() !== 'standard').length > 0 && (
          <div className="form-input-group">
            <label htmlFor="variant-select">Select Option</label>
            <select
              id="variant-select"
              className="contact-select-field"
              value={selectedVariant.id}
              onChange={(e) => {
                const v = product.variants.find(v => v.id === e.target.value);
                if (v) setSelectedVariant(v);
              }}
            >
              {product.variants.filter(v => v.name.toLowerCase() !== 'default' && v.name.toLowerCase() !== 'standard').map((v) => (
                <option key={v.id} value={v.id} disabled={v.inStock === false || (v.stockQuantity !== undefined && v.stockQuantity <= 0)}>
                  {v.name} {(v.inStock === false || (v.stockQuantity !== undefined && v.stockQuantity <= 0)) ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {product.flavors && product.flavors.length > 1 && (
          <div className="form-input-group" style={{ marginTop: '15px' }}>
            <label htmlFor="flavor-select">Select Flavor</label>
            <select
              id="flavor-select"
              className="contact-select-field"
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
            >
              {product.flavors.map((f, idx) => (
                <option key={idx} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {product.flavors && product.flavors.length === 1 && (
          <div className="form-input-group" style={{ marginTop: '15px' }}>
            <div style={{ padding: '12px 15px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white' }}>
               Flavor: <strong>{product.flavors[0]}</strong>
            </div>
          </div>
        )}

        <div className="form-input-group" style={{ marginTop: '15px' }}>
          <label>Quantity</label>
          <div className="qty-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity >= maxQty ? maxQty : quantity + 1)}>+</button>
          </div>
        </div>
      </div>

      <button
        className={`primary-btn full-width add-to-cart-hero ${isAdded ? 'added' : ''}`}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isAdded ? '✓ ADDED TO BAG' : isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
      </button>
      
      <div className="product-trust-badges">
        <span>⚡ Free Express Delivery over $99</span>
        <span>🛡️ 30-Day Results Guarantee</span>
      </div>
    </div>
  );
}
