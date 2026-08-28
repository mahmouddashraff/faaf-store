'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import type { Metadata } from 'next';
import CategoryInquiryBanner from '../../components/CategoryInquiry';
import { useCart } from '../../context/CartContext';

// Removed metadata export as this is now a client component

export default function LifestylePage() {
  const [pillars, setPillars] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, openCart } = useCart();

  const handleAddPillar = (pillar: any) => {
    const product: any = {
      isCMSItem: true,
      cmsType: 'lifestyle_pillar',
      id: pillar.id,
      name: pillar.title,
      slug: pillar.id,
      price: pillar.price || 0,
      category: 'Lifestyle',
      variants: [{ id: 'digital-access', name: 'Digital Access', price: pillar.price || 0, inStock: true, stockQuantity: 999999 }]
    };
    addItem(product, product.variants[0]);
    openCart();
  };

  const handleAddTip = (tip: any) => {
    const product: any = {
      isCMSItem: true,
      cmsType: 'lifestyle_tip',
      id: tip.id,
      name: tip.title,
      slug: tip.id,
      price: tip.price || 0,
      category: 'Lifestyle',
      variants: [{ id: 'digital-access', name: 'Digital Access', price: tip.price || 0, inStock: true, stockQuantity: 999999 }]
    };
    addItem(product, product.variants[0]);
    openCart();
  };

  useEffect(() => {
    async function loadLifestyle() {
      const supabase = createClient();
      
      const [pillarsRes, tipsRes] = await Promise.all([
        supabase.from('lifestyle_pillars').select('*').eq('is_archived', false).order('sort_order', { ascending: true }),
        supabase.from('lifestyle_tips').select('*').eq('is_archived', false).order('sort_order', { ascending: true })
      ]);
      
      if (pillarsRes.data) setPillars(pillarsRes.data);
      if (tipsRes.data) setTips(tipsRes.data);
      
      setIsLoading(false);
    }
    loadLifestyle();
  }, []);

  return (
    <main className="lifestyle-page-view">
      {isLoading ? (
        <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading lifestyle content...
        </div>
      ) : (
        <>
      {/* A. HERO SECTION */}
      <section className="lifestyle-hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="lifestyle-hero-inner">
          <div className="lifestyle-pill-tag">
            <span>🌿</span> THE FAAF WAY OF LIVING
          </div>
          <h1 className="lifestyle-hero-title">
            LIVE STRONG.<br />
            <span className="hero-highlight">LIVE BETTER.</span>
          </h1>
          <p className="lifestyle-hero-desc">
            FAAF is more than supplements and sets in the gym—it is a conscious commitment to feeling energized, performing with purpose, and building daily habits that sustain lifelong strength.
          </p>
          <div className="lifestyle-hero-ctas">
            <a href="#lifestyle-pillars" className="primary-btn">
              EXPLORE LIFESTYLE ↓
            </a>
            <Link href="/shop" className="secondary-btn light">
              SHOP FITNESS FUEL →
            </Link>
          </div>

          <div className="lifestyle-stats-bar">
            <div className="l-stat">
              <strong>100%</strong>
              <span>Clean Mindset</span>
            </div>
            <div className="l-stat">
              <strong>365</strong>
              <span>Days of Consistency</span>
            </div>
            <div className="l-stat">
              <strong>5 Pillars</strong>
              <span>Holistic Performance</span>
            </div>
          </div>
        </div>
      </section>

      {/* B. 4 LIFESTYLE PILLARS */}
      <section className="lifestyle-pillars-section" id="lifestyle-pillars">
        <div className="section-header-block">
          <span className="section-subtitle-tag">FOUNDATIONAL ELEMENTS</span>
          <h2 className="section-main-title">THE 4 PILLARS OF FAAF</h2>
          <p className="section-desc">
            True transformation happens when training, nutrition, recovery, and daily mindset work in harmonious synergy.
          </p>
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="pillar-card">
              <div className={`pillar-icon-box ${pillar.css_class}`} dangerouslySetInnerHTML={{ __html: pillar.icon_svg }}>
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
              <ul className="pillar-bullets">
                {pillar.bullets.map((bullet: string, idx: number) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link href={pillar.link_url} className="pillar-link">
                  {pillar.link_text}
                </Link>
                <button 
                  onClick={() => handleAddPillar(pillar)} 
                  style={{ background: 'none', border: '1px solid var(--gold-500)', color: 'var(--gold-400)', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }}
                >
                  {(pillar.price || 0) > 0 ? `ADD TO BAG ($${(pillar.price || 0).toFixed(2)})` : 'ADD TO BAG (FREE)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* C. BUILD YOUR BETTER ROUTINE (6 TIPS) */}
      <section className="lifestyle-routine-section" id="tips">
        <div className="routine-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">DAILY PROTOCOLS</span>
            <h2 className="section-main-title">BUILD YOUR BETTER ROUTINE</h2>
            <p className="section-desc">
              Six simple, non-negotiable daily habits to elevate your physical energy, mental clarity, and athletic performance.
            </p>
          </div>

          <div className="routine-cards-grid">
            {tips.map((tip) => (
              <div key={tip.id} className="routine-tile">
                <div className="routine-num">{tip.number_label}</div>
                <div className="routine-badge">{tip.badge}</div>
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
                <button 
                  onClick={() => handleAddTip(tip)} 
                  style={{ background: 'none', border: '1px solid var(--text-muted)', color: 'var(--text-light)', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px', marginTop: '12px' }}
                >
                  {(tip.price || 0) > 0 ? `ADD TO BAG ($${(tip.price || 0).toFixed(2)})` : 'ADD TO BAG (FREE)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. FAAF LIFESTYLE PHILOSOPHY */}
      <section className="lifestyle-philosophy-section">
        <div className="philosophy-inner">
          <div className="philosophy-content">
            <span className="section-subtitle-tag">OUR MANIFESTO</span>
            <h2>MORE THAN FITNESS</h2>
            <p>
              We founded FAAF on the belief that fitness is not a seasonal chore or a 30-day punishment—it is the bedrock of your confidence, mental clarity, and long-term vitality.
            </p>
            <p>
              When you train hard, eat clean, recover deeply, and fuel your body with science-backed formulas, every other area of your life elevates. Your focus at work sharpens, your energy with your family increases, and you carry yourself with unstoppable strength.
            </p>
            <div className="manifesto-quotes">
              <blockquote>
                &ldquo;We don&apos;t just build bodies. We build resilient humans capable of conquering anything life demands.&rdquo;
              </blockquote>
            </div>
          </div>
          <div className="philosophy-visual-box">
            <div className="philosophy-badge-card">
              <span className="magical-bolt">⚡</span>
              <h3>THE FAAF CODE</h3>
              <ul>
                <li>✓ Train with uncompromised focus</li>
                <li>✓ Eat with nutritional respect</li>
                <li>✓ Respect the power of sleep</li>
                <li>✓ Demand 100% clean ingredients</li>
                <li>✓ Elevate everyone in your tribe</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* E. LIFESTYLE ADVICE INQUIRY SECTION */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category="Lifestyle & Routine"
            title="WANT PERSONALIZED GUIDANCE ON BUILDING YOUR DAILY ROUTINE?"
            subtitle="Connect directly with a FAAF performance coach for mindset, sleep optimization, and sustainable fitness habit stacking."
            buttonText="ASK A COACH ABOUT LIFESTYLE HABITS →"
            badge="LIFESTYLE COACHING"
            icon="🌿"
            pageName="/lifestyle"
          />
        </div>
      </section>

      {/* F. CTA */}
      <section className="lifestyle-cta-banner">
        <div className="lifestyle-cta-inner">
          <h2>READY TO LEVEL UP YOUR LIFESTYLE?</h2>
          <p>
            Choose your starting point today. Browse clean performance fuels or begin a free structured workout plan.
          </p>
          <div className="lifestyle-cta-btns">
            <Link href="/shop" className="primary-btn">
              SHOP FAAF FUELS →
            </Link>
            <Link href="/workout-plans" className="secondary-btn light">
              VIEW WORKOUT PLANS →
            </Link>
          </div>
        </div>
      </section>
        </>
      )}
    </main>
  );
}
