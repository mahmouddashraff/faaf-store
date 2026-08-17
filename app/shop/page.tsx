'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, Product } from '../../lib/products';
import ProductCard from '../../components/ProductCard';

const categories = [
  { id: 'ALL', label: 'All Products' },
  { id: 'Powder', label: 'Protein Powders' },
  { id: 'Supplements', label: 'Supplements & Creatine' },
  { id: 'Bars', label: 'Protein Bars' },
  { id: 'Snacks', label: 'Snack Bites' },
  { id: 'Shakes', label: 'RTD Shakes' },
  { id: 'Drinks', label: 'Hydration Drinks' },
  { id: 'Bundles', label: 'Stacks & Bundles' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search term filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.nutritionHighlights.some(n => n.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'featured':
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  const hasActiveFilters = selectedCategory !== 'ALL' || searchTerm.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchTerm('');
    setSortBy('featured');
  };

  return (
    <main className="shop-view-page">
      {/* Banner Header */}
      <div className="shop-banner-header">
        <span className="section-subtitle-tag" style={{ color: '#38bdf8' }}>FAAF FITNESS MAGIC STORE</span>
        <h1>SHOP ALL PRODUCTS</h1>
        <p>Pure performance formulas, high-protein snacks, and essential stacks engineered for your goals.</p>
      </div>

      {/* Toolbar: Search & Sort */}
      <div className="shop-toolbar">
        {/* Search Input Box */}
        <div className="shop-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            placeholder="Search products, protein, flavors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Filter products by search"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ color: '#94a3b8', fontSize: '0.875rem' }}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="shop-controls-right">
          <div className="sort-dropdown-wrap">
            <label htmlFor="shop-sort-select">Sort by:</label>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="shop-category-pills" role="tablist" aria-label="Category filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            className={`category-filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Filter Summary Bar */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <div>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedCategory !== 'ALL' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          <button className="clear-filters-btn" onClick={handleResetFilters}>
            Reset Filters ✕
          </button>
        </div>
      )}

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="shop-empty-state">
          <h3>NO MATCHING PRODUCTS FOUND</h3>
          <p>We couldn&apos;t find any supplements or fuels matching your filter criteria.</p>
          <button className="primary-btn" onClick={handleResetFilters}>
            VIEW ALL PRODUCTS
          </button>
        </div>
      ) : (
        <div className="products-display-grid">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 24px', textAlign: 'center' }}>Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
