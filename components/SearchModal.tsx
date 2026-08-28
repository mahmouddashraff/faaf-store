'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { products, formatPrice } from '../lib/products';

export default function SearchModal() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery, addItem } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          (p.category?.toLowerCase().includes(query) ?? false) ||
          (p.shortDescription?.toLowerCase().includes(query) ?? false) ||
          (p.nutritionHighlights?.some(n => n.toLowerCase().includes(query)) ?? false)
      )
    : products.slice(0, 4);

  return (
    <div className="search-modal-overlay" onClick={closeSearch} role="dialog" aria-modal="true" aria-label="Search Catalog">
      <div className="search-modal-container" onClick={e => e.stopPropagation()}>
        {/* Search Header Bar */}
        <div className="search-input-wrap">
          <svg className="search-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search meal plans, supplements, powders, shakes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input-field"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search input">
              ✕
            </button>
          )}
          <button className="close-search-btn" onClick={closeSearch} aria-label="Close search modal">
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="quick-tags">
          <span className="tags-label">Popular:</span>
          {['Meal Plans', 'Whey Isolate', 'Creatine', 'Pre-Workout', 'Bundles'].map(tag => (
            <button
              key={tag}
              className="quick-tag-pill"
              onClick={() => setSearchQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="search-results-list">
          <div className="results-header">
            <h4>{query ? `Results for "${searchQuery}" (${filteredProducts.length})` : 'Featured Products'}</h4>
            {query && (
              <Link href={`/shop?search=${encodeURIComponent(query)}`} onClick={closeSearch} className="view-all-link">
                View all in shop →
              </Link>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-search-results">
              <p>No products found matching &ldquo;{searchQuery}&rdquo;</p>
              <small>Try searching for &quot;Whey&quot;, &quot;Bar&quot;, &quot;Creatine&quot;, or &quot;Shake&quot;.</small>
            </div>
          ) : (
            <div className="search-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="search-result-item">
                  <div className={`search-thumb ${product.accent}`}>
                    <span>FAAF</span>
                  </div>
                  <div className="search-result-info">
                    <div className="search-item-cat">{product.category}</div>
                    <h5>{product.name}</h5>
                    <div className="search-item-meta">
                      <span className="search-price">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="search-orig-price">{formatPrice(product.originalPrice)}</span>
                      )}
                      <span className="search-rating">★ {product.rating}</span>
                    </div>
                  </div>
                  <button
                    className="search-quick-add"
                    onClick={() => {
                      addItem(product);
                      closeSearch();
                    }}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    ADD +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
