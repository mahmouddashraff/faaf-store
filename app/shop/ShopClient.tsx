'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '../../lib/products';
import ProductCard from '../../components/ProductCard';
import CategoryInquiryBanner from '../../components/CategoryInquiry';
import { CategoryConfig } from '@/lib/config';

function ShopContent({ products, categories }: { products: Product[], categories: CategoryConfig[] }) {
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
        // Use the is_featured flag if available
        result.sort((a: any, b: any) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return a.id - b.id;
        });
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

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
        <span className="section-subtitle-tag">FAAF FITNESS MAGIC STORE</span>
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
        <button
          role="tab"
          aria-selected={selectedCategory === 'ALL'}
          className={`category-filter-chip ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('ALL')}
        >
          All Products
        </button>
        {categories.map(cat => (
          <button
            key={cat.slug}
            role="tab"
            aria-selected={selectedCategory === cat.slug}
            className={`category-filter-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Active Filter Summary Bar */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <div>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedCategory !== 'ALL' && ` in ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
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

      {/* Integrated In-Category Inquiry Section */}
      <div style={{ maxWidth: '1200px', margin: '60px auto 0' }}>
        <CategoryInquiryBanner
          category={selectedCategory}
          title={
            selectedCategory === 'Supplements'
              ? 'NEED HELP CHOOSING SUPPLEMENTS OR CREATINE?'
              : selectedCategory === 'Bars'
              ? 'QUESTIONS ABOUT PROTEIN CRUNCH BARS & SNACKS?'
              : selectedCategory === 'Bundles'
              ? 'UNSURE WHICH TRANSFORMATION BUNDLE FITS YOU?'
              : selectedCategory === 'Powder'
              ? 'QUESTIONS ABOUT 100% PURE WHEY ISOLATE & FLAVORS?'
              : 'HAVE QUESTIONS ABOUT OUR ATHLETIC PRODUCTS?'
          }
          subtitle="Talk directly with a FAAF certified nutrition specialist for personalized guidance, macro advice, or stack recommendations. Fast response within 2 hours."
          buttonText={
            selectedCategory === 'Supplements'
              ? 'ASK A SUPPLEMENT SPECIALIST →'
              : selectedCategory === 'Bars'
              ? 'ASK ABOUT BARS & SNACKS →'
              : selectedCategory === 'Bundles'
              ? 'ASK ABOUT BUNDLE SAVINGS →'
              : 'ASK AN ATHLETE SPECIALIST →'
          }
          icon={
            selectedCategory === 'Supplements'
              ? '💊'
              : selectedCategory === 'Bars'
              ? '🍫'
              : selectedCategory === 'Bundles'
              ? '🔥'
              : '⚡'
          }
        />
      </div>
    </main>
  );
}

export default function ShopClient({ products, categories }: { products: Product[], categories: CategoryConfig[] }) {
  return (
    <Suspense fallback={<div style={{ padding: '80px 24px', textAlign: 'center' }}>Loading Shop...</div>}>
      <ShopContent products={products} categories={categories} />
    </Suspense>
  );
}
