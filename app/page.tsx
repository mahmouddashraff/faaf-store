'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { products, formatPrice } from '../lib/products';
import { mealPlans } from '../lib/mealPlans';
import ProductCard from '../components/ProductCard';
import MealPlanCard from '../components/MealPlanCard';
import Newsletter from '../components/Newsletter';
import CategoryInquiryBanner from '../components/CategoryInquiry';
import { useCart } from '../context/CartContext';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';

const categoriesList = [
  { name: 'Meal Plans', slug: 'meal-plans', count: '5 Custom Plans', accentClass: 'mealplans', href: '/meal-plans' },
  { name: 'Supplements & Creatine', slug: 'Supplements', count: '3 Products', accentClass: 'supplements' },
  { name: 'Crunch & Snack Bars', slug: 'Bars', count: '2 Products', accentClass: 'bars' },
  { name: 'Ready-to-Drink Shakes', slug: 'Shakes', count: '1 Product', accentClass: 'shakes' },
  { name: 'Performance Snacks', slug: 'Snacks', count: '2 Products', accentClass: 'snacks' },
  { name: 'Stacks & Bundles', slug: 'Bundles', count: '2 Bundles (Save 20%)', accentClass: 'bundles' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BESTSELLER' | 'Powder' | 'Supplements' | 'Bundles'>('ALL');
  const { addItem } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const heroProduct = products[0]; // Pure Whey Isolate

  const handleHeroQuickAdd = () => {
    if (loading) return;
    if (!user) {
      const intent = { product: heroProduct, variant: heroProduct.variants[0], quantity: 1 };
      sessionStorage.setItem('pendingCartAdd', JSON.stringify(intent));
      router.push('/login');
      return;
    }
    addItem(heroProduct);
  };

  const filteredFeaturedProducts = products.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'BESTSELLER') return p.tag === 'BESTSELLER';
    return p.category === activeTab;
  });

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-pill-tag">
              <span>⚡</span> NEW GENERATION ATHLETIC FUEL
            </div>
            <h1 className="hero-heading">
              UNLOCK YOUR<br />
              <span className="hero-highlight">FITNESS</span>{' '}
              <span className="hero-accent-text">MAGIC.</span>
            </h1>
            <p className="hero-subtext">
              Clinically formulated performance nutrition, ultra-filtered whey isolate, and science-backed supplements engineered to help you conquer every workout.
            </p>

            <div className="hero-cta-group">
              <Link href="/shop" className="primary-btn">
                EXPLORE CATALOG →
              </Link>
              <a href="#featured" className="secondary-btn light">
                VIEW BEST SELLERS
              </a>
            </div>

            <div className="hero-stats-strip">
              <div className="hero-stat-item">
                <strong>50,000+</strong>
                <span>Active Athletes</span>
              </div>
              <div className="hero-stat-item">
                <strong>4.9 / 5.0</strong>
                <span>Over 2,200+ Reviews</span>
              </div>
              <div className="hero-stat-item">
                <strong>100%</strong>
                <span>Purity Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Product Card */}
          <div className="hero-visual-col">
            <div className="hero-featured-card">
              <div className="hero-card-header">
                <span className="hero-card-badge">★ TOP RATED PRODUCT</span>
                <span className="hero-card-rating">★★★★★ 4.9 (582)</span>
              </div>

              <div className="hero-canister-graphic">
                <div className="canister-body">
                  <div className="canister-lid"></div>
                  <span className="canister-logo">FAAF</span>
                  <span className="canister-sub">WHEY ISOLATE</span>
                </div>
              </div>

              <div className="hero-card-info">
                <h3>{heroProduct.name}</h3>
                <p>27g Cold-Filtered Protein • 0g Sugar • 5.8g BCAAs</p>
              </div>

              <div className="hero-card-footer">
                <div className="hero-card-price">
                  <strong>{formatPrice(heroProduct.price)}</strong>
                  <span>{formatPrice(heroProduct.originalPrice || 42.99)}</span>
                </div>
                <button
                  className="quick-shop-btn"
                  onClick={handleHeroQuickAdd}
                >
                  QUICK ADD +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS STRIP */}
      <section className="value-props-strip">
        <div className="value-props-container">
          <div className="value-prop-card">
            <div className="value-prop-icon">⚡</div>
            <div className="value-prop-text">
              <h4>FREE EXPRESS SHIPPING</h4>
              <p>On all orders over $99</p>
            </div>
          </div>
          <div className="value-prop-card">
            <div className="value-prop-icon">🧪</div>
            <div className="value-prop-text">
              <h4>100% CLEAN FORMULAS</h4>
              <p>Third-party lab tested for purity</p>
            </div>
          </div>
          <div className="value-prop-card">
            <div className="value-prop-icon">🛡️</div>
            <div className="value-prop-text">
              <h4>30-DAY GUARANTEE</h4>
              <p>100% money-back satisfaction</p>
            </div>
          </div>
          <div className="value-prop-card">
            <div className="value-prop-icon">💬</div>
            <div className="value-prop-text">
              <h4>EXPERT ATHLETE SUPPORT</h4>
              <p>Real nutritionists available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SHOWCASE */}
      <section className="categories-section" id="categories">
        <div className="section-header-block">
          <span className="section-subtitle-tag">CURATED COLLECTIONS</span>
          <h2 className="section-main-title">SHOP BY CATEGORY</h2>
          <p className="section-desc">
            Explore our specialized categories designed for meal planning, muscle building, endurance, and high-energy routines.
          </p>
        </div>

        <div className="categories-masonry-grid">
          {categoriesList.map(cat => (
            <Link
              key={cat.slug}
              href={cat.href || `/shop?category=${encodeURIComponent(cat.slug)}`}
              className="category-showcase-tile"
            >
              <div className={`category-tile-bg ${cat.accentClass}`} />
              <div className="category-tile-content">
                <div>
                  <h3>{cat.name}</h3>
                  <span>{cat.count}</span>
                </div>
                <div className="category-tile-arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED MEAL PLANS SHOWCASE */}
      <section className="categories-section" id="meal-plans-preview" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        <div className="section-header-block">
          <span className="section-subtitle-tag">CUSTOMIZED NUTRITION BLUEPRINTS</span>
          <h2 className="section-main-title">FEATURED MEAL PLANS</h2>
          <p className="section-desc">
            Precision daily nutrition blueprints calculated for fat loss, clean hypertrophy, and metabolic longevity.
          </p>
        </div>

        <div className="meal-plans-cards-grid">
          {mealPlans.slice(0, 3).map(plan => (
            <MealPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/meal-plans" className="primary-btn">
            EXPLORE ALL MEAL PLANS ({mealPlans.length} BLUEPRINTS) →
          </Link>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS & BEST SELLERS */}
      <section className="featured-section" id="featured">
        <div className="featured-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">ENGINEERED FOR RESULTS</span>
            <h2 className="section-main-title">BEST SELLING FORMULAS</h2>
            <p className="section-desc">
              Discover the most popular daily essentials trusted by athletes, bodybuilders, and fitness enthusiasts.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="featured-filter-tabs">
            <button
              className={`filter-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Products
            </button>
            <button
              className={`filter-tab-btn ${activeTab === 'BESTSELLER' ? 'active' : ''}`}
              onClick={() => setActiveTab('BESTSELLER')}
            >
              🔥 Best Sellers
            </button>
            <button
              className={`filter-tab-btn ${activeTab === 'Powder' ? 'active' : ''}`}
              onClick={() => setActiveTab('Powder')}
            >
              Performance Powders
            </button>
            <button
              className={`filter-tab-btn ${activeTab === 'Supplements' ? 'active' : ''}`}
              onClick={() => setActiveTab('Supplements')}
            >
              Supplements
            </button>
            <button
              className={`filter-tab-btn ${activeTab === 'Bundles' ? 'active' : ''}`}
              onClick={() => setActiveTab('Bundles')}
            >
              Stacks &amp; Bundles
            </button>
          </div>

          {/* Product Grid */}
          <div className="products-display-grid">
            {filteredFeaturedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/shop" className="primary-btn">
              VIEW FULL SHOP CATALOG ({products.length} PRODUCTS) →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE FAAF SCIENCE SECTION */}
      <section className="why-faaf-section" id="why-faaf">
        <div className="why-faaf-container">
          <div className="why-faaf-header">
            <span className="section-subtitle-tag">THE FAAF ADVANTAGE</span>
            <h2>WHY ATHLETES CHOOSE FAAF</h2>
            <p>
              We believe in honest labeling, clinically effective dosages, and zero unnecessary fillers.
            </p>
          </div>

          <div className="why-faaf-grid">
            <div className="why-card">
              <div className="why-icon">🧬</div>
              <h3>Cold Micro-Filtered</h3>
              <p>
                Our protein isolates undergo multi-stage ceramic micro-filtration preserving natural amino peptide fractions.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">🌿</div>
              <h3>Zero Artificial Fillers</h3>
              <p>
                No maltodextrin spikes, no cheap amino acid spiking, and no artificial dyes. Just pure bio-active nutrition.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">🔬</div>
              <h3>3rd Party Lab Tested</h3>
              <p>
                Every single batch is certified for purity, label accuracy, and heavy metal clearance by independent laboratories.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">⚡</div>
              <h3>Instant Bioavailability</h3>
              <p>
                Formulated with natural digestive enzyme complexes (DigeZyme®) for maximum gastric comfort and fast absorption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSFORMATION LIFESTYLE BANNER */}
      <section className="transformation-banner">
        <div className="transformation-inner">
          <div className="transformation-text">
            <span>FUEL YOUR ROUTINE</span>
            <h2>Simple Products.<br />Serious Progress.</h2>
            <p>
              Whether you are preparing for competition or building a sustainable daily routine, FAAF gives you the edge you need.
            </p>
          </div>
          <Link href="/shop" className="primary-btn">
            SHOP PERFORMANCE FUEL →
          </Link>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <div className="testimonials-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">REAL ATHLETES. REAL RESULTS.</span>
            <h2 className="section-main-title">TRUSTED BY OVER 50,000+ ATHLETES</h2>
            <p className="section-desc">
              Here is what fitness enthusiasts and competitive athletes have to say about FAAF Fitness Magic.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;The Pure Whey Isolate mixes completely smooth with water. No clumps, no stomach bloating, and 27g protein per scoop is unbeatable.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div className="author-info">
                  <strong>Marcus Reynolds</strong>
                  <span>✓ Verified Athlete Buyer</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;FAAF Crunch Bars are hands down the best tasting protein bars on the market. Real crunch, great macros, and no chemical aftertaste.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div className="author-info">
                  <strong>Sarah Jenkins</strong>
                  <span>✓ Verified Athlete Buyer</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;The Ultimate Transformation bundle saved me serious money and has everything I need for my prep. Delivery arrived in less than 48 hours!&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">DL</div>
                <div className="author-info">
                  <strong>David Levinson</strong>
                  <span>✓ Verified Athlete Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EXPERT GUIDANCE INQUIRY BANNER */}
      <section style={{ padding: '40px 24px 0', background: 'var(--bg-surface-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category="General Inquiry"
            title="HAVE QUESTIONS ABOUT PRODUCTS, MEAL PLANS, OR TRAINING?"
            subtitle="Connect with our athlete support team and nutritionists for personalized answers. Fast response within 2 hours."
            buttonText="ASK AN ATHLETE SPECIALIST →"
            badge="EXPERT ASSISTANCE"
            icon="💬"
            pageName="/"
          />
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION */}
      <Newsletter />
    </main>
  );
}
