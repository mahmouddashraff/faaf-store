import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Style | FAAF Fitness Magic',
  description:
    'Discover the FAAF lifestyle: high-performance daily habits, clean nutrition, recovery protocols, and mindset guidance for lasting transformation.',
};

export default function LifestylePage() {
  return (
    <main className="lifestyle-page-view">
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
          {/* 1. Nutrition */}
          <div className="pillar-card">
            <div className="pillar-icon-box nutrition">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            <h3>Pure Nutrition</h3>
            <p>
              Fuel your cells with whole unprocessed foods, balanced macronutrients, clean whey isolate, and zero artificial shortcuts.
            </p>
            <ul className="pillar-bullets">
              <li>1.6g - 2.2g Protein per kg bodyweight</li>
              <li>Focus on micronutrient-dense meals</li>
              <li>Hydrate with natural electrolytes</li>
            </ul>
            <Link href="/shop?category=Powder" className="pillar-link">
              Explore Nutrition →
            </Link>
          </div>

          {/* 2. Training */}
          <div className="pillar-card">
            <div className="pillar-icon-box training">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 5v14"></path>
                <path d="M18 5v14"></path>
                <path d="M2 9h4v6H2z"></path>
                <path d="M18 9h4v6h-4z"></path>
                <path d="M6 12h12"></path>
              </svg>
            </div>
            <h3>Purposeful Training</h3>
            <p>
              Move with intention. Progressive overload, functional movement patterns, and cardiovascular conditioning that prepares you for life.
            </p>
            <ul className="pillar-bullets">
              <li>Master compound movements</li>
              <li>Track progressive overload weekly</li>
              <li>Incorporate Zone 2 aerobic base work</li>
            </ul>
            <Link href="/workout-plans" className="pillar-link">
              View Workout Plans →
            </Link>
          </div>

          {/* 3. Recovery */}
          <div className="pillar-card">
            <div className="pillar-icon-box recovery">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
              </svg>
            </div>
            <h3>Active Recovery</h3>
            <p>
              Muscle and mental resilience are built during rest. Prioritize deep restorative sleep, mobility flows, and cellular repair.
            </p>
            <ul className="pillar-bullets">
              <li>7-9 hours uninterrupted sleep</li>
              <li>Daily 10-minute mobility routines</li>
              <li>Post-workout BCAA &amp; magnesium support</li>
            </ul>
            <Link href="/shop?category=Supplements" className="pillar-link">
              Recovery Fuels →
            </Link>
          </div>

          {/* 4. Healthy Habits */}
          <div className="pillar-card">
            <div className="pillar-icon-box habits">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Habit Stacking</h3>
            <p>
              Consistency beats motivation every single day. Micro-habits stacked over weeks create massive compounding transformations.
            </p>
            <ul className="pillar-bullets">
              <li>Morning hydration and sunlight priming</li>
              <li>Structured evening wind-down routine</li>
              <li>Weekly progress and macro review</li>
            </ul>
            <Link href="/programs" className="pillar-link">
              Guided Programs →
            </Link>
          </div>
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
            <div className="routine-tile">
              <div className="routine-num">01</div>
              <div className="routine-badge">HYDRATION</div>
              <h4>Stay Hydrated</h4>
              <p>
                Drink 3-4 liters of water daily. Add a pinch of sea salt or FAAF Electrolytes during intense training sessions to maintain optimal cellular osmotic balance.
              </p>
            </div>

            <div className="routine-tile">
              <div className="routine-num">02</div>
              <div className="routine-badge">PROTEIN</div>
              <h4>Prioritize Protein</h4>
              <p>
                Anchor every meal around 25-35g of bioavailable protein. Spread your intake across 3-4 feedings to continuously stimulate muscle protein synthesis (MPS).
              </p>
            </div>

            <div className="routine-tile">
              <div className="routine-num">03</div>
              <div className="routine-badge">MOVEMENT</div>
              <h4>Move Every Day</h4>
              <p>
                Aim for 8,000 - 10,000 steps daily outside your workouts. Low-intensity walking increases blood circulation, aids recovery, and manages cortisol levels.
              </p>
            </div>

            <div className="routine-tile">
              <div className="routine-num">04</div>
              <div className="routine-badge">SLEEP</div>
              <h4>Sleep &amp; Recover</h4>
              <p>
                Keep your bedroom cold and dark. Limit blue light 60 minutes before bed to allow growth hormone and testosterone release during deep slow-wave sleep.
              </p>
            </div>

            <div className="routine-tile">
              <div className="routine-num">05</div>
              <div className="routine-badge">MINDSET</div>
              <h4>Stay Consistent</h4>
              <p>
                A 70% workout executed with consistency outperforms a 100% workout done occasionally. Show up on the days you don&apos;t feel like it.
              </p>
            </div>

            <div className="routine-tile">
              <div className="routine-num">06</div>
              <div className="routine-badge">SUPPLEMENTS</div>
              <h4>Fuel Your Goals</h4>
              <p>
                Use supplements as strategic amplifiers: Pure Whey Isolate post-workout, Creatine Monohydrate daily, and clean Pre-Workout when extra focus is needed.
              </p>
            </div>
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

      {/* E. CTA */}
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
    </main>
  );
}
