import React from 'react';
import { fetchProductBySlug } from '@/lib/supabaseProducts';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';
import ReviewsSection from '@/components/ReviewsSection';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-main product-detail-page">
      <div className="product-detail-container">
        
        {/* Left Column: Visuals */}
        <div className={`product-gallery-section bg-gradient-${product.accent}`}>
          <div className="product-main-visual">
            <span className="product-hero-logo">FAAF</span>
            <div className="product-glow"></div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="product-info-section">
          <div className="product-meta">
            <span className="product-category-tag">{product.category}</span>
            <div className="product-rating-box">
              <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="rating-number">{product.rating}</span>
              <span className="review-count">({product.reviews} reviews)</span>
            </div>
          </div>

          <h1 className="product-title">{product.name}</h1>
          
          <p className="product-description">{product.description}</p>

          <div className="product-nutrition-highlights">
            {product.nutritionHighlights?.map((highlight, idx) => (
              <span key={idx} className="highlight-pill">
                ✓ {highlight}
              </span>
            ))}
          </div>

          <ProductDetailClient product={product} />

        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '60px auto' }}>
        <ReviewsSection productId={product.id.toString()} />
      </div>
    </main>
  );
}
