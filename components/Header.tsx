'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, openCart, openSearch } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-badge">LIMITED TIME</span>
          <span>⚡ FREE Express Delivery on orders over $99</span>
          <span className="announcement-divider">•</span>
          <span className="promo-code">Use Code <strong>MAGIC15</strong> for 15% Off</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          {/* Mobile Hamburger Button */}
          <button
            className={`mobile-toggle-btn ${menuOpen ? 'active' : ''}`}
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* FAAF Brand Logo */}
          <Link href="/" className="brand-logo" aria-label="FAAF Fitness Magic Home">
            <div className="brand-symbol">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">FAAF</span>
              <span className="brand-sub">FITNESS MAGIC</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-navigation">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/shop" className={`nav-link ${pathname === '/shop' ? 'active' : ''}`}>
              Shop All
            </Link>
            <Link href="/shop?category=Powder" className="nav-link">
              Protein
            </Link>
            <Link href="/shop?category=Supplements" className="nav-link">
              Supplements
            </Link>
            <Link href="/shop?category=Bars" className="nav-link">
              Bars &amp; Snacks
            </Link>
            <Link href="/shop?category=Bundles" className="nav-link nav-highlight">
              Bundles <span className="nav-tag">SAVE 20%</span>
            </Link>
            <Link href="/lifestyle" className={`nav-link ${pathname === '/lifestyle' ? 'active' : ''}`}>
              Life Style
            </Link>
            <Link href="/workout-plans" className={`nav-link ${pathname === '/workout-plans' ? 'active' : ''}`}>
              Workout Plans
            </Link>
            <Link href="/programs" className={`nav-link ${pathname.startsWith('/programs') ? 'active' : ''}`}>
              Programs
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Search Trigger */}
            <button
              className="action-icon-btn"
              onClick={() => openSearch()}
              aria-label="Search products"
              title="Search products"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="search-pill-label">Search...</span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              className="action-icon-btn cart-trigger-btn"
              onClick={openCart}
              aria-label={`View Cart (${totalCount} items)`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className={`cart-count-badge ${totalCount > 0 ? 'has-items' : ''}`}>
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-search-bar" onClick={() => { setMenuOpen(false); openSearch(); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search supplements, bars, shakes...</span>
          </div>

          <nav className="mobile-links-list">
            <Link href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <span>🏠 Home</span>
            </Link>
            <Link href="/shop" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <span>⚡ Shop All Products</span>
            </Link>

            <div className="mobile-nav-group-title">FITNESS &amp; TRAINING</div>
            <Link href="/lifestyle" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🌿 Life Style &amp; Routine</span>
            </Link>
            <Link href="/workout-plans" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>📋 Workout Plans</span>
            </Link>
            <Link href="/programs" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🏆 Guided Programs</span>
            </Link>

            <div className="mobile-nav-group-title">STORE CATEGORIES</div>
            <Link href="/shop?category=Powder" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🥤 Protein Powders</span>
            </Link>
            <Link href="/shop?category=Supplements" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>💊 Supplements &amp; Creatine</span>
            </Link>
            <Link href="/shop?category=Bars" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🍫 Protein Bars &amp; Snacks</span>
            </Link>
            <Link href="/shop?category=Shakes" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🥛 RTD Shakes &amp; Drinks</span>
            </Link>
            <Link href="/shop?category=Bundles" className="mobile-link sub highlight" onClick={() => setMenuOpen(false)}>
              <span>🔥 Stacks &amp; Bundles (Save 20%)</span>
            </Link>
          </nav>

          <div className="mobile-nav-footer">
            <p>⚡ FREE Express Shipping Over $99</p>
            <button className="primary-btn full-width" onClick={() => { setMenuOpen(false); openCart(); }}>
              VIEW CART ({totalCount})
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
