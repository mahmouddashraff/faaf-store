'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant, formatPrice } from '../lib/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
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
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = product.variants.find(v => v.id === e.target.value);
    if (found) {
      setSelectedVariant(found);
    }
  };

  return (
    <article className="premium-product-card">
      {/* Product Image / Art Showcase */}
      <Link href={`/shop/${product.slug}`} className={`product-visual-container ${product.accent}`}>
        {/* Floating Badges */}
        <div className="product-badges-row">
          {product.tag && (
            <span className={`product-chip-badge ${product.tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              {product.tag}
            </span>
          )}
          {product.originalPrice && (
            <span className="product-chip-badge discount">
              SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Artwork / Render Graphic or Real Image */}
        <div className="product-artwork">
          <div className="art-glow"></div>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-real-img"
              loading="lazy"
              onError={(e) => {
                // If image not found, hide img and fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="art-cylinder">
              <span className="art-brand-text">FAAF</span>
              <span className="art-cat-text">{product.category.toUpperCase()}</span>
              <div className="art-accent-line"></div>
            </div>
          )}
        </div>

        {/* Nutrition Fast-Facts Overlay */}
        <div className="product-nutrition-pills">
          {product.nutritionHighlights.slice(0, 2).map((fact, idx) => (
            <span key={idx} className="nutrition-pill">
              {fact}
            </span>
          ))}
        </div>
      </Link>

      {/* Product Information Body */}
      <div className="product-card-body">
        {/* Category & Rating */}
        <div className="product-header-meta">
          <span className="product-category-label">{product.category}</span>
          <div className="product-rating-wrap" title={`${product.rating} out of 5 stars`}>
            <span className="rating-stars">★★★★★</span>
            <span className="rating-score">{product.rating}</span>
            <span className="rating-count">({product.reviews})</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>

        {/* Short Description */}
        <p className="product-short-desc">{product.shortDescription}</p>

        {/* Price Display */}
        <div className="product-price-row">
          <span className="current-price">{formatPrice(activePrice)}</span>
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Variant Selector */}
        {product.variants.filter(v => v.name.toLowerCase() !== 'default' && v.name.toLowerCase() !== 'standard').length > 0 && (
          <div className="product-variant-picker">
            <label htmlFor={`variant-${product.id}`} className="sr-only">
              Select Option
            </label>
            <select
              id={`variant-${product.id}`}
              value={selectedVariant.id}
              onChange={handleVariantChange}
              className="variant-select-dropdown"
            >
              {product.variants.filter(v => v.name.toLowerCase() !== 'default' && v.name.toLowerCase() !== 'standard').map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.price ? `(${formatPrice(v.price)})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Flavor Selector */}
        {product.flavors && product.flavors.length > 1 && (
          <div className="product-variant-picker" style={{ marginTop: '10px' }}>
            <label htmlFor={`flavor-${product.id}`} className="sr-only">
              Select Flavor
            </label>
            <select
              id={`flavor-${product.id}`}
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              className="variant-select-dropdown"
            >
              <option disabled value="">Select Flavor</option>
              {product.flavors.map((f, idx) => (
                <option key={idx} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {product.flavors && product.flavors.length === 1 && (
          <div className="product-flavor-single" style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--silver-400)' }}>
            Flavor: <strong>{product.flavors[0]}</strong>
          </div>
        )}

        {/* Action Row: Quantity + Add to Cart */}
        <div className="product-action-row">
          <div className="quantity-stepper">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>ADDED!</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
