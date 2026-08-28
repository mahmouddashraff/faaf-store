'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { FitnessProgram } from '../../lib/programs';
import ProgramCard from '../../components/ProgramCard';
import CategoryInquiryBanner from '../../components/CategoryInquiry';

const programCategories = [
  { id: 'ALL', label: 'All Programs' },
  { id: 'Lifestyle Transformation', label: 'Lifestyle Transformation' },
  { id: 'Fat Loss', label: 'Fat Loss & Conditioning' },
  { id: 'Beginner Fitness', label: 'Beginner Fitness' },
  { id: 'Athletic Performance', label: 'Athletic Performance' },
];

export default function ProgramsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      const supabase = createClient();
      const { data } = await supabase
        .from('programs')
        .select('*')
        .eq('is_archived', false)
        .order('sort_order', { ascending: true });
      
      if (data) {
        setPrograms(data.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          tagline: p.tagline,
          duration: p.duration,
          difficulty: p.difficulty,
          goal: p.goal,
          category: p.category,
          shortDescription: p.short_description,
          overview: p.overview,
          targetAudience: p.target_audience,
          weeklySchedule: p.weekly_schedule,
          equipmentNeeded: p.equipment_needed,
          keyBenefits: p.key_benefits,
          includedModules: p.included_modules,
          accentColor: p.accent_color,
          rating: p.rating,
          reviews: p.reviews,
          enrolledCount: p.enrolled_count,
          price: p.price,
          imageUrl: p.image_url
        })));
      }
      setIsLoading(false);
    }
    loadPrograms();
  }, []);

  const filteredPrograms = useMemo(() => {
    if (activeCategory === 'ALL') return programs;
    return programs.filter(p => p.category === activeCategory);
  }, [activeCategory, programs]);

  return (
    <main className="programs-view-page">
      {/* 1. HERO SECTION */}
      <section className="programs-hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="programs-hero-inner">
          <div className="lifestyle-pill-tag">
            <span>🏆</span> COMPLETE FLAGSHIP TRAINING SYSTEMS
          </div>
          <h1 className="programs-hero-title">
            YOUR GOAL.<br />
            <span className="hero-highlight">YOUR PROGRAM.</span>
          </h1>
          <p className="programs-hero-desc">
            Complete fitness roadmaps combining periodized gym protocols, personalized macro targets, habit trackers, and coach video guidance to guarantee sustainable physical breakthroughs.
          </p>
          <div className="programs-hero-ctas">
            <a href="#all-programs" className="primary-btn">
              VIEW PROGRAMS ↓
            </a>
            <Link href="/workout-plans" className="secondary-btn light">
              QUICK WORKOUT PLANS →
            </Link>
          </div>

          <div className="programs-stats-strip">
            <div className="p-stat">
              <strong>40,000+</strong>
              <span>Program Graduates</span>
            </div>
            <div className="p-stat">
              <strong>4.9 ★</strong>
              <span>Average Athlete Score</span>
            </div>
            <div className="p-stat">
              <strong>100% Free</strong>
              <span>With FAAF Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAM CATEGORIES & SHOWCASE */}
      <section className="programs-catalog-section" id="all-programs">
        <div className="programs-catalog-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">CURATED PATHWAYS</span>
            <h2 className="section-main-title">CHOOSE YOUR PATH TO PEAK PERFORMANCE</h2>
            <p className="section-desc">
              Every FAAF program is battle-tested and structured with progressive overload, nutrition timing, and weekly milestones.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="programs-filter-bar" role="tablist" aria-label="Program categories">
            {programCategories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`program-filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="programs-grid-layout">
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                Loading programs...
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                No programs found for this filter.
              </div>
            ) : (
              filteredPrograms.map((program: FitnessProgram) => (
                <ProgramCard key={program.id} program={program} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. WHY STRUCTURED PROGRAMS WORK */}
      <section className="why-programs-section">
        <div className="why-programs-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">THE SCIENCE OF PROGRESS</span>
            <h2 className="section-main-title">WHY FAAF PROGRAMS DELIVER RESULTS</h2>
            <p className="section-desc">
              Random workouts create random results. Structured periodization drives predictable adaptations.
            </p>
          </div>

          <div className="why-programs-grid">
            <div className="why-program-card">
              <div className="why-icon">📊</div>
              <h3>Intelligent Periodization</h3>
              <p>
                Phased training cycles avoid adaptation plateaus and central nervous system burnout while maintaining progressive overload.
              </p>
            </div>
            <div className="why-program-card">
              <div className="why-icon">🥗</div>
              <h3>Coupled Nutrition Protocols</h3>
              <p>
                Workouts and calories are synced. High-volume training days pair with carbohydrate refeeds, while rest days emphasize cellular repair.
              </p>
            </div>
            <div className="why-program-card">
              <div className="why-icon">📱</div>
              <h3>Daily Accountability</h3>
              <p>
                Weekly checklists, habit metrics, and video movement tutorials remove all friction between you and your execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAM ADVICE INQUIRY SECTION */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category="Programs"
            title="UNSURE WHICH TRAINING SYSTEM FITS YOUR GOALS & TIMELINE?"
            subtitle="Have specific fitness milestones, past injuries, or competition requirements? Connect directly with a FAAF head coach."
            buttonText="ASK A HEAD COACH ABOUT PROGRAMS →"
            badge="PROGRAM SELECTION"
            icon="🏆"
            pageName="/programs"
          />
        </div>
      </section>

      {/* 5. FINAL CTA BANNER */}
      <section className="programs-cta-banner">
        <div className="programs-cta-inner">
          <h2>READY TO START YOUR TRANSFORMATION?</h2>
          <p>
            Join thousands of active athletes using FAAF training systems and performance nutrition every single day.
          </p>
          <div className="programs-cta-actions">
            <Link href="/programs/90-day-transformation" className="primary-btn">
              START 90-DAY TRANSFORMATION →
            </Link>
            <Link href="/shop" className="secondary-btn light">
              SHOP SUPPLEMENTS →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
