'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkoutPlan } from '../lib/workoutPlans';
import { useCart } from '../context/CartContext';

export default function WorkoutPlanCard({ plan }: { plan: WorkoutPlan }) {
  const [showModal, setShowModal] = useState(false);
  const { addItem, openCart } = useCart();

  const handleEnroll = () => {
    const product: any = {
      isCMSItem: true,
      cmsType: 'workout_plan',
      id: plan.id,
      name: plan.title,
      slug: plan.slug,
      price: plan.price || 0,
      category: plan.category,
      variants: [{ id: 'digital-access', name: 'Digital Access', price: plan.price || 0, inStock: true, stockQuantity: 999999 }]
    };
    addItem(product, product.variants[0]);
    setShowModal(false);
    openCart();
  };

  return (
    <>
      <article className="workout-plan-card">
        {/* Top Header Row */}
        <div className="plan-card-top">
          <span className={`plan-level-pill ${plan.level.toLowerCase()}`}>
            {plan.level}
          </span>
          {plan.badge && (
            <span className="plan-badge-pill">
              {plan.badge}
            </span>
          )}
        </div>

        {/* Plan Title & Goal */}
        <h3 className="plan-title">{plan.title}</h3>
        <p className="plan-goal-text">🎯 {plan.goal}</p>

        {/* Meta Stats Row */}
        <div className="plan-meta-grid">
          <div className="plan-meta-item">
            <span className="meta-icon">⏱️</span>
            <div>
              <small>Duration</small>
              <strong>{plan.duration}</strong>
            </div>
          </div>
          <div className="plan-meta-item">
            <span className="meta-icon">📅</span>
            <div>
              <small>Frequency</small>
              <strong>{plan.daysPerWeek} Days/Wk</strong>
            </div>
          </div>
          <div className="plan-meta-item">
            <span className="meta-icon">🏋️</span>
            <div>
              <small>Equipment</small>
              <strong className="equipment-text">{plan.equipment}</strong>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="plan-description">{plan.description}</p>

        {/* Highlights Checklist */}
        <div className="plan-highlights-list">
          {plan.highlights.map((h, i) => (
            <div key={i} className="plan-highlight-row">
              <span className="check-icon">✓</span>
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div className="plan-card-footer">
          <button
            type="button"
            className="primary-btn full-width"
            onClick={() => setShowModal(true)}
          >
            VIEW WORKOUT PLAN →
          </button>
        </div>
      </article>

      {/* Plan Preview Modal */}
      {showModal && (
        <div className="plan-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="plan-modal-content" onClick={e => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div>
                <span className={`plan-level-pill ${plan.level.toLowerCase()}`}>{plan.level}</span>
                <h2>{plan.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="plan-modal-body">
              <div className="modal-section">
                <h4>PLAN OVERVIEW</h4>
                <p>{plan.description}</p>
              </div>

              <div className="modal-specs-grid">
                <div className="spec-box">
                  <small>Duration</small>
                  <strong>{plan.duration}</strong>
                </div>
                <div className="spec-box">
                  <small>Commitment</small>
                  <strong>{plan.daysPerWeek} Days / Week</strong>
                </div>
                <div className="spec-box">
                  <small>Equipment</small>
                  <strong>{plan.equipment}</strong>
                </div>
              </div>

              <div className="modal-section">
                <h4>WHAT YOU GET IN THIS PLAN</h4>
                <ul className="modal-highlights">
                  {plan.highlights.map((h, i) => (
                    <li key={i}>✓ {h}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section supplements-box">
                <h4>RECOMMENDED FUEL STACK</h4>
                <p>Maximize your strength &amp; recovery on this plan with these FAAF formulas:</p>
                <div className="supplement-chips">
                  {plan.recommendedSupplements.map((s, idx) => (
                    <Link key={idx} href="/shop" className="supp-chip" onClick={() => setShowModal(false)}>
                      ⚡ {s} →
                    </Link>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', marginTop: '20px' }}>
                <h4>GET INSTANT DIGITAL ACCESS</h4>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold-400)' }}>
                  {(plan.price || 0) > 0 ? `$${(plan.price || 0).toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <button className="primary-btn full-width" onClick={handleEnroll}>
                {(plan.price || 0) > 0 ? `ADD TO BAG ($${(plan.price || 0).toFixed(2)})` : 'ADD TO BAG (FREE)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
