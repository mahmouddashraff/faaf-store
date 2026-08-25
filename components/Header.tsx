'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../components/AuthProvider';
import { StoreSettings } from '@/lib/config';

export default function Header({ settings }: { settings?: StoreSettings | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, openCart, openSearch } = useCart();
  const pathname = usePathname();
  const { user, loading } = useAuth();

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

  const threshold = settings?.freeShippingThreshold || 99;

  return (
    <>
      {/* Announcement Bar */}
      {settings?.announcementActive && (
        <div className="announcement-bar">
          <div className="announcement-content">
            <span className="announcement-badge">LIMITED TIME</span>
            <span>{settings.announcementText}</span>
          </div>
        </div>
      )}

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
              <Image
                src="/logo.png"
                alt="FAAF Fitness Magic"
                width={42}
                height={42}
                className="brand-logo-img"
                priority
              />
            </div>
            <div className="brand-text">
              <span className="brand-name">{settings?.storeName?.split(' ')[0] || 'FAAF'}</span>
              <span className="brand-sub">{settings?.storeName?.split(' ').slice(1).join(' ') || 'FITNESS MAGIC'}</span>
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
            <Link href="/meal-plans" className={`nav-link ${pathname === '/meal-plans' ? 'active' : ''}`}>
              Meal Plans
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
            <Link href="/manual-therapy" className={`nav-link ${pathname === '/manual-therapy' ? 'active' : ''}`}>
              Manual Therapy
            </Link>
            <Link href="/download-app" className="nav-link nav-highlight">
              DOWNLOAD APP
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Account Trigger */}
            <Link
              href={user ? "/account" : "/login"}
              className="action-icon-btn"
              aria-label={user ? "My Account" : "Login"}
              title={user ? "My Account" : "Login"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

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
            <span>Search meal plans, supplements, shakes...</span>
          </div>

          <nav className="mobile-links-list">
            <Link href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <span>🏠 Home</span>
            </Link>
            
            {user ? (
              <Link href="/account" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <span>👤 My Account</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <span>👤 Login</span>
                </Link>
                <Link href="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <span>✨ Create Account</span>
                </Link>
              </>
            )}

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
            <Link href="/manual-therapy" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>💆 Manual Therapy</span>
            </Link>
            <Link href="/download-app" className="mobile-link sub highlight" onClick={() => setMenuOpen(false)}>
              <span>DOWNLOAD APP</span>
            </Link>

            <div className="mobile-nav-group-title">STORE &amp; NUTRITION</div>
            <Link href="/meal-plans" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🥗 Meal Plans</span>
            </Link>
            <Link href="/shop?category=Supplements" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>💊 Supplements &amp; Creatine</span>
            </Link>
            <Link href="/shop?category=Bars" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🍫 Crunch Bars &amp; Snacks</span>
            </Link>
            <Link href="/shop?category=Shakes" className="mobile-link sub" onClick={() => setMenuOpen(false)}>
              <span>🥛 RTD Shakes &amp; Drinks</span>
            </Link>
            <Link href="/shop?category=Bundles" className="mobile-link sub highlight" onClick={() => setMenuOpen(false)}>
              <span>🔥 Stacks &amp; Bundles (Save 20%)</span>
            </Link>
          </nav>

          <div className="mobile-nav-footer">
            <p>⚡ FREE Express Shipping Over ${threshold}</p>
            <button className="primary-btn full-width" onClick={() => { setMenuOpen(false); openCart(); }}>
              VIEW CART ({totalCount})
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
