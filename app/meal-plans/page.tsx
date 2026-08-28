'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { MealPlan } from '../../lib/mealPlans';
import MealPlanCard from '../../components/MealPlanCard';
import CategoryInquiryBanner from '../../components/CategoryInquiry';

const filterCategories = [
  { id: 'ALL', label: 'All Meal Plans' },
  { id: 'Weight Loss', label: 'Weight Loss' },
  { id: 'Muscle Gain', label: 'Muscle Gain' },
  { id: 'High Protein', label: 'High Protein' },
  { id: 'Balanced Nutrition', label: 'Balanced Nutrition' },
  { id: 'Performance', label: 'Performance' },
];

export default function MealPlansPage() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMealPlans() {
      const supabase = createClient();
      const { data } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('is_archived', false)
        .order('sort_order', { ascending: true });
      
      if (data) {
        setMealPlans(data.map(m => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          goal: m.goal,
          category: m.category,
          price: m.price,
          dailyCalories: m.daily_calories,
          macros: m.macros,
          mealsPerDay: m.meals_per_day,
          duration: m.duration,
          shortDescription: m.short_description,
          description: m.description,
          highlights: m.highlights,
          sampleMeals: m.sample_meals,
          badge: m.badge,
          dietaryTags: m.dietary_tags,
          imageUrl: m.image_url
        })));
      }
      setIsLoading(false);
    }
    loadMealPlans();
  }, []);

  const filteredPlans = useMemo(() => {
    if (activeFilter === 'ALL') return mealPlans;
    return mealPlans.filter(p => p.category === activeFilter);
  }, [activeFilter, mealPlans]);

  return (
    <main className="meal-plans-view">
      {/* 1. HERO SECTION */}
      <section className="plans-hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="plans-hero-inner">
          <div className="lifestyle-pill-tag">
            <span>🥗</span> CUSTOMIZED NUTRITION BLUEPRINTS
          </div>
          <h1 className="plans-hero-title">
            PRECISION NUTRITION.<br />
            <span className="hero-highlight">FUEL YOUR MAGIC.</span>
          </h1>
          <p className="plans-hero-desc">
            Nutrition is 80% of your physical outcome. Eliminate guesswork with science-backed meal plans tailored for weight loss, maximum muscle hypertrophy, peak athletic stamina, or sustainable lifelong wellness.
          </p>
          <div className="plans-hero-ctas">
            <a href="#meal-plans-grid" className="primary-btn">
              CHOOSE YOUR MEAL PLAN ↓
            </a>
            <Link href="/shop" className="secondary-btn light">
              SHOP PERFORMANCE FUELS →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FILTER CONTROLS & PLANS GRID */}
      <section className="plans-grid-section" id="meal-plans-grid">
        <div className="plans-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">SELECT YOUR NUTRITIONAL GOAL</span>
            <h2 className="section-main-title">EXPLORE STRUCTURED MEAL PLANS</h2>
            <p className="section-desc">
              Every blueprint includes calculated daily macros, portion sizes, grocery shopping lists, and quick 15-minute recipes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="plans-filter-bar" role="tablist" aria-label="Meal plan filters">
            {filterCategories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeFilter === cat.id}
                className={`plan-filter-pill ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="plans-results-count">
            Showing <strong>{filteredPlans.length}</strong> {filteredPlans.length === 1 ? 'custom meal plan' : 'custom meal plans'}
            {activeFilter !== 'ALL' && ` in ${filterCategories.find(c => c.id === activeFilter)?.label}`}
          </div>

          {/* Cards Grid */}
          <div className="meal-plans-cards-grid">
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                Loading meal plans...
              </div>
            ) : filteredPlans.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                No meal plans found for this filter.
              </div>
            ) : (
              filteredPlans.map((plan: MealPlan) => (
                <MealPlanCard key={plan.id} plan={plan} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. THE 3 PILLARS OF FAAF NUTRITION */}
      <section className="why-faaf-section">
        <div className="why-faaf-container">
          <div className="why-faaf-header">
            <span className="section-subtitle-tag">NUTRITIONAL PHILOSOPHY</span>
            <h2>THE 3 PILLARS OF FAAF NUTRITION</h2>
            <p>We build our nutritional plans around biological fundamentals—not unsustainable fad diets.</p>
          </div>

          <div className="why-faaf-grid">
            <div className="why-card">
              <div className="why-icon">⚖️</div>
              <h3>1. Macro Precision</h3>
              <p>
                Calculated protein, carb, and fat distributions calibrated to trigger muscle protein synthesis, sustain thyroid function, and preserve lean tissue.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">🥩</div>
              <h3>2. Bioavailable Whole Foods</h3>
              <p>
                Every meal prioritizes high-quality animal and plant proteins, complex fiber starches, and essential fatty acids with zero synthetic fillers.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">⏱️</div>
              <h3>3. Nutrient Timing</h3>
              <p>
                Strategic carbohydrate and amino acid delivery around your workout windows to maximize glycogen loading and accelerate cellular recovery.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">🛒</div>
              <h3>4. Frictionless Prep</h3>
              <p>
                Includes ready-to-use weekly grocery lists, meal prep storage guides, and simple swap charts so you can sustain your plan effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">STEP-BY-STEP BLUEPRINT</span>
            <h2 className="section-main-title">HOW TO EXECUTE YOUR PLAN</h2>
            <p className="section-desc">
              From choosing your target macros to achieving noticeable physical results in 4 simple steps.
            </p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="step-number">01</div>
              <h4>Select Your Goal</h4>
              <p>Choose Weight Loss, Muscle Gain, High Protein, Performance, or Balanced Nutrition based on your current physical objective.</p>
            </div>
            <div className="how-step-card">
              <div className="step-number">02</div>
              <h4>Download Your Plan</h4>
              <p>Receive your complete daily meal schedule, portion charts, macro breakdown, and weekly grocery checklist.</p>
            </div>
            <div className="how-step-card">
              <div className="step-number">03</div>
              <h4>Cook &amp; Enjoy Simple Meals</h4>
              <p>Prepare clean, delicious whole-food recipes in 15-20 minutes with easy batch cooking instructions.</p>
            </div>
            <div className="how-step-card">
              <div className="step-number">04</div>
              <h4>Pair With FAAF Fuel</h4>
              <p>Supplement strategically with FAAF 100% Pure Whey Isolate and Creatine to hit your daily protein requirements effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NUTRITION COACHING INQUIRY SECTION */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category="Meal Plans"
            title="NEED A CUSTOMIZED NUTRITION BLUEPRINT OR DIETARY ADVICE?"
            subtitle="Have specific allergies, macros targets, vegetarian preferences, or competition prep needs? Connect directly with a FAAF sports nutritionist."
            buttonText="ASK A NUTRITIONIST ABOUT MEAL PLANS →"
            badge="NUTRITION CONSULTATION"
            icon="🥗"
            pageName="/meal-plans"
          />
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="plans-cta-section">
        <div className="plans-cta-inner">
          <span className="section-subtitle-tag">READY FOR SERIOUS PROGRESS?</span>
          <h2>TRANSFORM YOUR BODY FROM THE INSIDE OUT.</h2>
          <p>
            Pair your customized meal plan with our structured training programs and clean athletic fuels.
          </p>
          <div className="lifestyle-cta-btns">
            <Link href="/workout-plans" className="primary-btn">
              VIEW WORKOUT PLANS →
            </Link>
            <Link href="/shop" className="secondary-btn light">
              SHOP PERFORMANCE FUELS →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
