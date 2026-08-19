'use client';

import React, { useState } from 'react';
import { MealPlan } from '../lib/mealPlans';

export default function MealPlanCard({ plan }: { plan: MealPlan }) {
  const [showModal, setShowModal] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;
    setEnrolled(true);
    setTimeout(() => {
      setEnrolled(false);
      setShowModal(false);
      setUserEmail('');
    }, 2500);
  };

  return (
    <>
      <article className="meal-plan-card">
        {/* Top Header Row */}
        <div className="meal-card-top">
          <span className="meal-category-pill">
            {plan.category}
          </span>
          {plan.badge && (
            <span className="meal-badge-pill">
              {plan.badge}
            </span>
          )}
        </div>

        {/* Title & Goal */}
        <h3 className="meal-plan-title">{plan.title}</h3>
        <p className="meal-goal-text">🎯 {plan.goal}</p>

        {/* Price & Calorie Banner */}
        <div className="meal-key-metrics-banner">
          <div className="metric-calories">
            <span className="metric-icon">🔥</span>
            <div>
              <small>Daily Calories</small>
              <strong>{plan.dailyCalories.toLocaleString()} kcal</strong>
            </div>
          </div>
          <div className="metric-price">
            <small>Full Blueprint</small>
            <strong>${plan.price.toFixed(2)}</strong>
          </div>
        </div>

        {/* Macro Distribution Grid */}
        <div className="meal-macros-grid">
          <div className="macro-cell protein">
            <span className="macro-name">PROTEIN</span>
            <span className="macro-val">{plan.macros.protein}</span>
          </div>
          <div className="macro-cell carbs">
            <span className="macro-name">CARBS</span>
            <span className="macro-val">{plan.macros.carbs}</span>
          </div>
          <div className="macro-cell fats">
            <span className="macro-name">FATS</span>
            <span className="macro-val">{plan.macros.fats}</span>
          </div>
          <div className="macro-cell meals">
            <span className="macro-name">MEALS</span>
            <span className="macro-val">{plan.mealsPerDay}/Day</span>
          </div>
        </div>

        {/* Meta Stats Row */}
        <div className="meal-meta-row">
          <span className="meal-meta-item">⏱️ Duration: <strong>{plan.duration}</strong></span>
          <span className="meal-meta-item">🥗 Whole Foods: <strong>100% Clean</strong></span>
        </div>

        {/* Description */}
        <p className="meal-description">{plan.shortDescription}</p>

        {/* Dietary Tags */}
        <div className="meal-tags-row">
          {plan.dietaryTags.map((tag, idx) => (
            <span key={idx} className="dietary-tag-chip">
              {tag}
            </span>
          ))}
        </div>

        {/* Highlights Checklist */}
        <div className="meal-highlights-list">
          {plan.highlights.slice(0, 3).map((h, i) => (
            <div key={i} className="meal-highlight-row">
              <span className="check-icon">✓</span>
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Card Footer Action */}
        <div className="meal-card-footer">
          <button
            type="button"
            className="primary-btn full-width"
            onClick={() => setShowModal(true)}
          >
            VIEW PLAN DETAILS →
          </button>
        </div>
      </article>

      {/* Interactive Meal Plan Modal */}
      {showModal && (
        <div className="plan-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="plan-modal-content meal-modal-large" onClick={e => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div>
                <span className="meal-category-pill">{plan.category}</span>
                <h2>{plan.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="plan-modal-body">
              {/* Daily Macro Summary Strip */}
              <div className="modal-macros-summary">
                <div className="macro-summary-item">
                  <small>Daily Target</small>
                  <strong>{plan.dailyCalories.toLocaleString()} kcal</strong>
                </div>
                <div className="macro-summary-item">
                  <small>Protein</small>
                  <strong style={{ color: '#dfb76c' }}>{plan.macros.protein}</strong>
                </div>
                <div className="macro-summary-item">
                  <small>Carbohydrates</small>
                  <strong>{plan.macros.carbs}</strong>
                </div>
                <div className="macro-summary-item">
                  <small>Healthy Fats</small>
                  <strong>{plan.macros.fats}</strong>
                </div>
                <div className="macro-summary-item">
                  <small>Meals Per Day</small>
                  <strong>{plan.mealsPerDay} Meals</strong>
                </div>
              </div>

              {/* Description */}
              <div className="modal-section">
                <h4>NUTRITIONAL BLUEPRINT OVERVIEW</h4>
                <p>{plan.description}</p>
              </div>

              {/* Sample Day Meal Schedule */}
              <div className="modal-section">
                <h4>SAMPLE DAILY MEAL TIMELINE</h4>
                <div className="meal-timeline-container">
                  {plan.sampleMeals.map((meal, idx) => (
                    <div key={idx} className="timeline-meal-card">
                      <div className="timeline-meal-header">
                        <div className="timeline-meal-title">
                          <span className="timeline-badge">{meal.time}</span>
                          <strong>{meal.name}</strong>
                        </div>
                        <div className="timeline-meal-calories">
                          {meal.calories} kcal • {meal.macros.protein}g P / {meal.macros.carbs}g C / {meal.macros.fats}g F
                        </div>
                      </div>
                      <ul className="timeline-food-list">
                        {meal.items.map((food, fIdx) => (
                          <li key={fIdx}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Guides */}
              <div className="modal-section">
                <h4>WHAT IS INCLUDED IN THIS MEAL PLAN</h4>
                <ul className="modal-highlights">
                  {plan.highlights.map((h, i) => (
                    <li key={i}>✓ {h}</li>
                  ))}
                </ul>
              </div>

              {/* Enrollment / Download Form */}
              <div className="modal-section" style={{ borderTop: '1px solid rgba(223, 183, 108, 0.2)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4>GET INSTANT DIGITAL ACCESS</h4>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold-400)' }}>
                    ${plan.price.toFixed(2)}
                  </span>
                </div>

                {enrolled ? (
                  <div className="enroll-success-msg">
                    🎉 Access granted! Your customized {plan.title} and printable shopping lists have been sent to your email.
                  </div>
                ) : (
                  <form onSubmit={handleEnroll} className="enroll-form">
                    <div className="form-input-block">
                      <label htmlFor={`meal-email-${plan.id}`}>Enter your email to receive this meal plan:</label>
                      <input
                        id={`meal-email-${plan.id}`}
                        type="email"
                        required
                        placeholder="athlete@example.com"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        className="modal-email-input"
                      />
                    </div>
                    <button type="submit" className="primary-btn full-width">
                      GET {plan.title.toUpperCase()} (${plan.price.toFixed(2)}) →
                    </button>
                    <small className="modal-disclaimer">
                      Instant PDF blueprint download + printable shopping checklist + recipe cards.
                    </small>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
