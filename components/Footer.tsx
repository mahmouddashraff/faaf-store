import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Top Value Assurance Bar */}
      <div className="footer-top-strip">
        <div className="assurance-grid">
          <div className="assurance-item">
            <span className="assurance-icon">⚡</span>
            <div>
              <strong>FREE EXPRESS DELIVERY</strong>
              <p>On all qualifying orders over $99</p>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
                </svg>
              </div>
              <div className="brand-text">
                <span className="brand-name">FAAF</span>
                <span className="brand-sub">FITNESS MAGIC</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Engineering pure, science-backed athletic fuel and functional nutrition to empower your strongest self every single day.
            </p>
            <div className="footer-socials">
              <span className="social-pill" title="Instagram">Instagram</span>
              <span className="social-pill" title="YouTube">YouTube</span>
              <span className="social-pill" title="TikTok">TikTok</span>
              <span className="social-pill" title="Twitter/X">X</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="footer-col">
            <h4 className="footer-heading">SHOP CATEGORIES</h4>
            <ul className="footer-links-list">
              <li><Link href="/shop?category=Powder">100% Pure Whey Isolate</Link></li>
              <li><Link href="/shop?category=Supplements">Creatine &amp; Pre-Workout</Link></li>
              <li><Link href="/shop?category=Bars">Protein Crunch Bars</Link></li>
              <li><Link href="/shop?category=Shakes">Ready-to-Drink Shakes</Link></li>
              <li><Link href="/shop?category=Snacks">Protein Snack Bites</Link></li>
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
              <li><Link href="/shop">Frequently Asked Questions</Link></li>
              <li><Link href="/shop">Contact Athlete Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} FAAF Fitness Magic. All rights reserved. Built for champions.
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
