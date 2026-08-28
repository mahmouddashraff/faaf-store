'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { WorkoutPlan } from '../../lib/workoutPlans';
import WorkoutPlanCard from '../../components/WorkoutPlanCard';
import CategoryInquiryBanner from '../../components/CategoryInquiry';

// Filters are now computed dynamically from active plans

export default function WorkoutPlansPage() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      const supabase = createClient();
      const { data } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('is_archived', false)
        .order('sort_order', { ascending: true });
      
      if (data) {
        setWorkoutPlans(data.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          level: p.level,
          duration: p.duration,
          daysPerWeek: p.days_per_week,
          goal: p.goal,
          category: p.category,
          equipment: p.equipment,
          description: p.description,
          highlights: p.highlights,
          recommendedSupplements: p.recommended_supplements,
          badge: p.badge,
          imageUrl: p.image_url,
          price: p.price
        })));
      }
      setIsLoading(false);
    }
    loadPlans();
  }, []);

  const filterCategories = useMemo(() => {
    const levels = Array.from(new Set(workoutPlans.map(p => p.level))).filter(Boolean);
    const cats = Array.from(new Set(workoutPlans.map(p => p.category))).filter(Boolean);
    
    // De-duplicate in case a level and category have the same string
    const uniqueFilters = Array.from(new Set([...levels, ...cats]));
    return ['ALL', ...uniqueFilters];
  }, [workoutPlans]);

  const filteredPlans = useMemo(() => {
    if (activeFilter === 'ALL') return workoutPlans;
    return workoutPlans.filter(p => p.level === activeFilter || p.category === activeFilter);
  }, [activeFilter, workoutPlans]);

  return (
    <main className="workout-plans-view">
      {/* 1. HERO SECTION */}
      <section className="plans-hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="plans-hero-inner">
          <div className="lifestyle-pill-tag">
            <span>⚡</span> FREE STRUCTURED WORKOUT PLANS
          </div>
          <h1 className="plans-hero-title">
            TRAIN WITH<br />
            <span className="hero-highlight">PURPOSE.</span>
          </h1>
          <p className="plans-hero-desc">
            Stop guessing your sets and reps. Follow structured, periodized workout plans engineered by elite coaches to help you train smarter, stay consistent, and reach your physical peak.
          </p>
          <div className="plans-hero-ctas">
            <a href="#plans-grid" className="primary-btn">
              FIND YOUR PLAN ↓
            </a>
            <Link href="/programs" className="secondary-btn light">
              EXPLORE GUIDED PROGRAMS →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FILTER CONTROLS & PLANS GRID */}
      <section className="plans-grid-section" id="plans-grid">
        <div className="plans-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">SELECT YOUR LEVEL &amp; GOAL</span>
            <h2 className="section-main-title">EXPLORE WORKOUT PLANS</h2>
            <p className="section-desc">
              Whether training in a full gym or in your living room, find the exact blueprint that fits your schedule.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="plans-filter-bar" role="tablist" aria-label="Workout plan filters">
            {filterCategories.map((cat: string) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeFilter === cat}
                className={`plan-filter-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat === 'ALL' ? 'All Plans' : cat}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="plans-results-count">
            Showing <strong>{filteredPlans.length}</strong> {filteredPlans.length === 1 ? 'workout plan' : 'workout plans'}
            {activeFilter !== 'ALL' && ` in ${activeFilter}`}
          </div>

          {/* Cards Grid */}
          <div className="workout-cards-grid">
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                Loading workout plans...
              </div>
            ) : filteredPlans.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                No workout plans found for this filter.
              </div>
            ) : (
              filteredPlans.map((plan: WorkoutPlan) => (
                <WorkoutPlanCard key={plan.id} plan={plan} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">SIMPLE STEP-BY-STEP</span>
            <h2 className="section-main-title">HOW IT WORKS</h2>
            <p className="section-desc">
              Four streamlined steps from selecting your routine to achieving tangible progress.
            </p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="step-number">01</div>
              <h4>Choose Your Goal</h4>
              <p>Identify whether your priority is raw strength, muscle hypertrophy, rapid fat loss, or functional athleticism.</p>
            </div>
            <div className="how-step-card">
              <div className="step-number">02</div>
              <h4>Pick Your Plan</h4>
              <p>Select the plan that matches your training experience (Beginner to Advanced) and available days per week.</p>
            </div>
            <div className="how-step-card">
              <div className="step-number">03</div>
              <h4>Follow Your Program</h4>
              <p>Execute exercises with prescribed intensity, rest periods, progressive weight increases, and proper form.</p>
            </div>
            <div className="how-step-card">
              <div className="step-number">04</div>
              <h4>Track Your Progress</h4>
              <p>Log your working weights, monitor recovery metrics, and fuel your gains with targeted FAAF nutrition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKOUT INQUIRY SECTION */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category="Workout Plans"
            title="NEED HELP CHOOSING OR ADJUSTING A WORKOUT SPLIT?"
            subtitle="Have questions about sets, reps, progressive overload, or training with limited gym equipment? Connect with a FAAF coach."
            buttonText="ASK A COACH ABOUT WORKOUT PLANS →"
            badge="TRAINING GUIDANCE"
            icon="📋"
            pageName="/workout-plans"
          />
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="plans-cta-section">
        <div className="plans-cta-inner">
          <span className="section-subtitle-tag">TAKE THE LEAP</span>
          <h2>YOUR NEXT LEVEL STARTS HERE.</h2>
          <p>
            Looking for complete guided nutrition, video masterclasses, and community coach support? Explore our comprehensive flagship programs.
          </p>
          <Link href="/programs" className="primary-btn">
            EXPLORE COMPREHENSIVE PROGRAMS →
          </Link>
        </div>
      </section>
    </main>
  );
}
