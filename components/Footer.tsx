import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoreSettings } from '@/lib/config';

export default function Footer({ settings }: { settings?: StoreSettings | null }) {
  const threshold = settings?.freeShippingThreshold || 99;
  
  return (
    <footer className="site-footer">
      {/* Top Value Assurance Bar */}
      <div className="footer-top-strip">
        <div className="assurance-grid">
          <div className="assurance-item">
            <span className="assurance-icon">⚡</span>
            <div>
              <strong>FREE EXPRESS DELIVERY</strong>
              <p>On all qualifying orders over ${threshold}</p>
            </div>
          </div>
          <div className="assurance-item">
            <span className="assurance-icon">🛡️</span>
            <div>
              <strong>30-DAY SATISFACTION</strong>
              <p>Love your results or money back</p>
            </div>
          </div>
          <div className="assurance-item">
            <span className="assurance-icon">🧪</span>
            <div>
              <strong>LAB-TESTED PURITY</strong>
              <p>Zero banned substances or cheap fillers</p>
            </div>
          </div>
          <div className="assurance-item">
            <span className="assurance-icon">💬</span>
            <div>
              <strong>ATHLETE SUPPORT</strong>
              <p>24/7 nutrition &amp; training guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main-container">
        <div className="footer-cols-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link href="/" className="footer-brand-logo">
              <div className="brand-symbol">
                <Image
                  src="/logo.png"
                  alt="FAAF Fitness Magic"
                  width={40}
                  height={40}
                  className="brand-logo-img"
                />
              </div>
              <div className="brand-text">
                <span className="brand-name">{settings?.storeName?.split(' ')[0] || 'FAAF'}</span>
                <span className="brand-sub">{settings?.storeName?.split(' ').slice(1).join(' ') || 'FITNESS MAGIC'}</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Engineering pure, science-backed athletic fuel and functional nutrition to empower your strongest self every single day.
            </p>
            <div className="footer-socials">
              {settings?.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="social-pill" title="Instagram">Instagram</a>
              )}
              {settings?.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="social-pill" title="Facebook">Facebook</a>
              )}
              <span className="social-pill" title="YouTube">YouTube</span>
              <span className="social-pill" title="TikTok">TikTok</span>
              <span className="social-pill" title="Twitter/X">X</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="footer-col">
            <h4 className="footer-heading">SHOP &amp; NUTRITION</h4>
            <ul className="footer-links-list">
              <li><Link href="/meal-plans" style={{ color: '#dfb76c', fontWeight: 'bold' }}>🥗 Structured Meal Plans</Link></li>
              <li><Link href="/shop?category=Powder">100% Pure Whey Isolate</Link></li>
              <li><Link href="/shop?category=Supplements">Creatine &amp; Pre-Workout</Link></li>
              <li><Link href="/shop?category=Bars">Crunch &amp; Energy Bars</Link></li>
              <li><Link href="/shop?category=Shakes">Ready-to-Drink Shakes</Link></li>
              <li><Link href="/shop?category=Snacks">Healthy Snack Bites</Link></li>
              <li><Link href="/shop?category=Bundles">Stacks &amp; Bundles (Save 20%)</Link></li>
            </ul>
          </div>

          {/* Training & Lifestyle Column */}
          <div className="footer-col">
            <h4 className="footer-heading">FITNESS &amp; TRAINING</h4>
            <ul className="footer-links-list">
              <li><Link href="/lifestyle">Life Style Philosophy</Link></li>
              <li><Link href="/workout-plans">Free Workout Plans</Link></li>
              <li><Link href="/programs">90-Day Transformation</Link></li>
              <li><Link href="/manual-therapy">Manual Therapy Studio</Link></li>
              <li><Link href="/programs/lean-and-strong">Lean &amp; Strong Protocol</Link></li>
              <li><Link href="/programs/performance">Athletic Performance</Link></li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="footer-col">
            <h4 className="footer-heading">HELP &amp; SUPPORT</h4>
            <ul className="footer-links-list">
              <li><Link href="/shop">Track My Order</Link></li>
              <li><Link href="/shop">Shipping Information</Link></li>
              <li><Link href="/shop">30-Day Returns Policy</Link></li>
              <li><Link href="/contact#faq">Frequently Asked Questions</Link></li>
              <li><Link href="/contact">Contact Athlete Support {settings?.contactEmail ? `(${settings.contactEmail})` : ''}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} {settings?.storeName || 'FAAF Fitness Magic'}. All rights reserved. Built for champions.
          </div>
          <div className="footer-payments">
            <span className="payment-chip">VISA</span>
            <span className="payment-chip">MASTERCARD</span>
            <span className="payment-chip">AMEX</span>
            <span className="payment-chip">APPLE PAY</span>
            <span className="payment-chip">PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
