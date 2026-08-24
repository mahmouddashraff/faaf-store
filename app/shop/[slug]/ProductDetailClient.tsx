'use client';

import React, { useState } from 'react';
import { Product, ProductVariant, formatPrice } from '../../../lib/products';
import { useCart } from '../../../context/CartContext';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'default', name: 'Standard' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const activePrice = selectedVariant.price ?? product.price;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
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
        <div className="form-input-group">
          <label htmlFor="variant-select">Select Option / Flavor</label>
          <select
            id="variant-select"
            className="contact-select-field"
            value={selectedVariant.id}
            onChange={(e) => {
              const v = product.variants.find(v => v.id === e.target.value);
              if (v) setSelectedVariant(v);
            }}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={v.inStock === false}>
                {v.name} {v.inStock === false ? '(Out of Stock)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input-group" style={{ marginTop: '15px' }}>
          <label>Quantity</label>
          <div className="qty-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>
      </div>

      <button
        className={`primary-btn full-width add-to-cart-hero ${isAdded ? 'added' : ''}`}
        onClick={handleAddToCart}
        disabled={selectedVariant.inStock === false}
      >
        {isAdded ? '✓ ADDED TO BAG' : selectedVariant.inStock === false ? 'OUT OF STOCK' : 'ADD TO BAG'}
      </button>
      
      <div className="product-trust-badges">
        <span>⚡ Free Express Delivery over $99</span>
        <span>🛡️ 30-Day Results Guarantee</span>
      </div>
    </div>
  );
}
