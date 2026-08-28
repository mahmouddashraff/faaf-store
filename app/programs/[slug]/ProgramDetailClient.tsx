'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FitnessProgram } from '../../../lib/programs';
import CategoryInquiryBanner from '../../../components/CategoryInquiry';
import { useCart } from '../../../context/CartContext';

export default function ProgramDetailClient({ program }: { program: any }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { addItem, openCart } = useCart();

  const handleStartProgram = () => {
    const parsedPrice = typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, ''));
    const finalPrice = isNaN(parsedPrice) ? 0 : parsedPrice;

    const product: any = {
      isCMSItem: true,
      cmsType: 'program',
      id: program.id,
      name: program.title,
      slug: program.slug,
      price: finalPrice,
      category: program.category,
      variants: [{ id: 'digital-access', name: 'Digital Access', price: finalPrice, inStock: true, stockQuantity: 999999 }]
    };
    
    addItem(product, product.variants[0]);
    setShowModal(false);
    openCart();
  };

  return (
    <main className="program-detail-page">
      {/* 1. HERO SECTION */}
      <section className={`detail-hero-section ${program.accent_color || ''}`}>
        <div className="hero-glow-1"></div>
        <div className="detail-hero-container">
          {/* Breadcrumb */}
          <div className="detail-breadcrumb">
            <Link href="/programs">← Back to All Programs</Link>
            <span>/</span>
            <span>{program.title}</span>
          </div>

          <div className="detail-hero-grid">
            <div className="detail-hero-left">
              <div className="detail-badge-row">
                <span className="detail-category-badge">{program.category}</span>
                <span className="detail-difficulty-badge">{program.difficulty}</span>
                <span className="detail-rating-pill">★ {program.rating} ({program.reviews} reviews)</span>
              </div>

              <h1 className="detail-title">{program.title}</h1>
              <p className="detail-tagline">{program.tagline}</p>
              <p className="detail-short-desc">{program.short_description}</p>

                <div className="detail-cta-bar">
                  <button
                    className="primary-btn"
                    style={{ padding: '16px 36px', fontSize: '1.0625rem' }}
                    onClick={handleStartProgram}
                  >
                    {((typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, '')) || 0) > 0) ? `ADD TO BAG ($${(typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, ''))).toFixed(2)})` : 'ADD TO BAG (FREE)'}
                  </button>
                <Link href="/shop" className="secondary-btn light">
                  SHOP RECOMMENDED STACK
                </Link>
              </div>
            </div>

            {/* Right Program Summary Card */}
            <div className="detail-summary-card">
              <div className="summary-card-header">
                <h3>PROGRAM AT A GLANCE</h3>
                <span className="card-free-tag">
                  {((typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, '')) || 0) > 0) ? `$${(typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, ''))).toFixed(2)}` : 'FREE'}
                </span>
              </div>

              <div className="summary-specs-list">
                <div className="spec-row">
                  <span>⏱️ Duration</span>
                  <strong>{program.duration}</strong>
                </div>
                <div className="spec-row">
                  <span>🎯 Primary Goal</span>
                  <strong>{program.category}</strong>
                </div>
                <div className="spec-row">
                  <span>📈 Difficulty</span>
                  <strong>{program.difficulty}</strong>
                </div>
                <div className="spec-row">
                  <span>👥 Enrolled Athletes</span>
                  <strong>{(program.enrolled_count || 0).toLocaleString()} Active</strong>
                </div>
              </div>

              <div className="summary-card-footer">
                <button
                  className="primary-btn full-width"
                  onClick={handleStartProgram}
                >
                  {((typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, '')) || 0) > 0) ? `ADD TO BAG ($${(typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, ''))).toFixed(2)})` : 'ADD TO BAG (FREE)'}
                </button>
                <small className="instant-access-note">
                  🔒 100% Free digital access with FAAF Community
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW & WHO IT'S FOR */}
      <section className="detail-overview-section">
        <div className="detail-container">
          <div className="overview-two-col">
            <div className="overview-left">
              <span className="section-subtitle-tag">IN-DEPTH BREAKDOWN</span>
              <h2 className="detail-section-heading">PROGRAM OVERVIEW</h2>
              <p className="overview-body-text">{program.overview}</p>

              <h3 className="subheading-h3" style={{ marginTop: '36px' }}>KEY BENEFITS</h3>
              <div className="benefits-checklist-grid">
                {(program.key_benefits || []).map((benefit: string, i: number) => (
                  <div key={i} className="benefit-check-card">
                    <span className="benefit-check-icon">✓</span>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overview-right">
              {/* Who It's For Box */}
              <div className="target-audience-card">
                <h3>WHO THIS IS BUILT FOR</h3>
                <ul className="audience-list">
                  {(program.target_audience || []).map((item: string, i: number) => (
                    <li key={i}>
                      <span className="target-bullet">🎯</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You'll Need Box */}
              <div className="equipment-needed-card">
                <h3>EQUIPMENT REQUIRED</h3>
                <ul className="equipment-list">
                  {(program.equipment_needed || []).map((eq: string, i: number) => (
                    <li key={i}>
                      <span className="eq-icon">🏋️</span>
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WEEKLY SCHEDULE BREAKDOWN */}
      <section className="detail-schedule-section">
        <div className="detail-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">SAMPLE TRAINING SPLIT</span>
            <h2 className="detail-section-heading">WEEKLY ROUTINE SCHEDULE</h2>
            <p className="section-desc">
              A balanced 7-day periodization template structuring high-intensity training with targeted recovery.
            </p>
          </div>

          <div className="schedule-cards-grid">
            {(program.weekly_schedule || []).map((item: any, idx: number) => (
              <div key={idx} className="schedule-day-card">
                <div className="day-header">
                  <span className="day-name">{item.day}</span>
                  <span className="day-duration">{item.duration}</span>
                </div>
                <h4>{item.title}</h4>
                <div className="day-focus-tag">
                  Focus: <strong>{item.focus}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INCLUDED MODULES & RESOURCES */}
      <section className="detail-modules-section">
        <div className="detail-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">DIGITAL TOOLKIT</span>
            <h2 className="detail-section-heading">WHAT&apos;S INCLUDED IN THIS PROGRAM</h2>
            <p className="section-desc">
              Everything you need to execute without guesswork—from PDFs and trackers to coaching masterclasses.
            </p>
          </div>

          <div className="modules-grid">
            {(program.included_modules || []).map((mod: string, i: number) => (
              <div key={i} className="module-card">
                <div className="module-icon-circle">0{i + 1}</div>
                <h4>{mod}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROGRAM INQUIRY SECTION */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category={`Program: ${program.title}`}
            title={`HAVE QUESTIONS ABOUT ${program.title.toUpperCase()}?`}
            subtitle={`Want to know if ${program.title} aligns with your current strength level, available equipment, or schedule? Ask our coaching team.`}
            buttonText={`ASK ABOUT ${program.title.toUpperCase()} →`}
            badge="COACH CONSULTATION"
            icon="🏆"
            pageName={`/programs/${program.slug}`}
          />
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="detail-cta-section">
        <div className="detail-cta-inner">
          <h2>READY TO TRANSFORM WITH {program.title}?</h2>
          <p>
            Start Day 1 today. Join thousands of dedicated athletes in the FAAF Fitness Community.
          </p>
          <div className="detail-cta-buttons">
            <button
              className="primary-btn"
              onClick={handleStartProgram}
            >
              {((typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, '')) || 0) > 0) ? `ADD TO BAG ($${(typeof program.price === 'number' ? program.price : parseFloat((String(program.price) || '').replace(/[^0-9.]/g, ''))).toFixed(2)})` : 'ADD TO BAG (FREE)'}
            </button>
            <Link href="/programs" className="secondary-btn light">
              EXPLORE OTHER PROGRAMS
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
