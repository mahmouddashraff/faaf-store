'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FitnessProgram } from '../../../lib/programs';

export default function ProgramDetailClient({ program }: { program: FitnessProgram }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleStartProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !userEmail.includes('@')) return;
    setEnrollSuccess(true);
    setIsEnrolled(true);
    setTimeout(() => {
      setShowModal(false);
    }, 2500);
  };

  return (
    <main className="program-detail-page">
      {/* 1. HERO SECTION */}
      <section className={`detail-hero-section ${program.accentColor}`}>
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
              <p className="detail-short-desc">{program.shortDescription}</p>

              <div className="detail-cta-bar">
                {isEnrolled ? (
                  <div className="enrolled-status-box">
                    <span className="enrolled-check">✓</span>
                    <span>You are Enrolled in this Program! Daily schedule active.</span>
                  </div>
                ) : (
                  <button
                    className="primary-btn"
                    style={{ padding: '16px 36px', fontSize: '1.0625rem' }}
                    onClick={() => setShowModal(true)}
                  >
                    START THIS PROGRAM (FREE) →
                  </button>
                )}
                <Link href="/shop" className="secondary-btn light">
                  SHOP RECOMMENDED STACK
                </Link>
              </div>
            </div>

            {/* Right Program Summary Card */}
            <div className="detail-summary-card">
              <div className="summary-card-header">
                <h3>PROGRAM AT A GLANCE</h3>
                <span className="card-free-tag">{program.price}</span>
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
                  <strong>{program.enrolledCount.toLocaleString()} Active</strong>
                </div>
              </div>

              <div className="summary-card-footer">
                <button
                  className="primary-btn full-width"
                  onClick={() => setShowModal(true)}
                >
                  {isEnrolled ? 'DOWNLOAD PROGRAM MATERIALS' : 'GET INSTANT ACCESS'}
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
                {program.keyBenefits.map((benefit, i) => (
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
                  {program.targetAudience.map((item, i) => (
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
                  {program.equipmentNeeded.map((eq, i) => (
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
            {program.weeklySchedule.map((item, idx) => (
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
            {program.includedModules.map((mod, i) => (
              <div key={i} className="module-card">
                <div className="module-icon-circle">0{i + 1}</div>
                <h4>{mod}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="detail-cta-section">
        <div className="detail-cta-inner">
          <h2>READY TO TRANSFORM WITH {program.title}?</h2>
          <p>
            Start Day 1 today. Join thousands of dedicated athletes in the FAAF Fitness Community.
          </p>
          <div className="detail-cta-buttons">
            <button
              className="primary-btn"
              onClick={() => setShowModal(true)}
            >
              {isEnrolled ? 'ACCESS YOUR PROGRAM DASHBOARD' : 'ENROLL FOR FREE NOW →'}
            </button>
            <Link href="/programs" className="secondary-btn light">
              EXPLORE OTHER PROGRAMS
            </Link>
          </div>
        </div>
      </section>

      {/* ENROLLMENT MODAL */}
      {showModal && (
        <div className="plan-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="plan-modal-content" onClick={e => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div>
                <span className="detail-category-badge">{program.category}</span>
                <h2>ENROLL IN {program.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="plan-modal-body">
              {enrollSuccess ? (
                <div className="enroll-success-msg">
                  <div className="success-emoji">🎉</div>
                  <h3>WELCOME TO {program.title}!</h3>
                  <p>
                    We sent the complete training roadmap, PDF guides, and workout logging template to <strong>{userEmail}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStartProgram} className="enroll-form">
                  <p>
                    Enter your email below for immediate free digital access to the {program.title} training schedules, nutrition calculator, and PDF downloads.
                  </p>

                  <div className="form-input-block">
                    <label htmlFor="athlete-email">Athlete Email Address</label>
                    <input
                      id="athlete-email"
                      type="email"
                      required
                      placeholder="e.g. champion@fitness.com"
                      value={userEmail}
                      onChange={e => setUserEmail(e.target.value)}
                      className="modal-email-input"
                    />
                  </div>

                  <button type="submit" className="primary-btn full-width" style={{ marginTop: '14px' }}>
                    CONFIRM &amp; UNLOCK PROGRAM NOW
                  </button>

                  <small className="modal-disclaimer">
                    ✓ 100% Free with FAAF Community • No credit card required • Unsubscribe anytime.
                  </small>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
