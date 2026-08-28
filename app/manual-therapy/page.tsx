'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { submitContactRequest } from '../../lib/contact';
import CategoryInquiryBanner from '../../components/CategoryInquiry';
import { useCart } from '../../context/CartContext';

interface TherapyService {
  id: string;
  name: string;
  tag: string;
  icon: string;
  duration: string;
  shortDescription: string;
  focusAreas: string[];
  bestFor: string;
  price: number;
}

export default function ManualTherapyPage() {
  const [selectedService, setSelectedService] = useState<TherapyService | null>(null);
  const [therapyServices, setTherapyServices] = useState<TherapyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Personalized Manual Therapy',
    duration: '60 Minutes',
    preferredDate: '',
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    async function loadTherapy() {
      const supabase = createClient();
      const { data } = await supabase
        .from('manual_therapy')
        .select('*')
        .eq('is_archived', false)
        .order('sort_order', { ascending: true });
      
      if (data) {
        setTherapyServices(data.map(t => ({
          id: t.id,
          name: t.name,
          tag: t.tag,
          icon: t.icon,
          duration: t.duration,
          shortDescription: t.short_description,
          focusAreas: t.focus_areas,
          bestFor: t.best_for,
          price: t.price
        })));
      }
      setIsLoading(false);
    }
    loadTherapy();
  }, []);

  const openBookingModal = (serviceName?: string) => {
    if (serviceName) {
      setFormData(prev => ({ ...prev, service: serviceName }));
    }
    setIsModalOpen(true);
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const service = therapyServices.find(s => s.name === formData.service);
    if (!service) {
      setErrorMessage('Service not found.');
      return;
    }

    const variantName = [
      formData.duration,
      formData.preferredDate ? `Date: ${formData.preferredDate}` : '',
      `Time: ${formData.preferredTime}`
    ].filter(Boolean).join(' | ');

    const product: any = {
      isCMSItem: true,
      cmsType: 'manual_therapy',
      id: service.id,
      name: service.name,
      slug: service.id,
      price: service.price || 0,
      category: 'Therapy',
      variants: [{ id: 'therapy-session', name: variantName, price: service.price || 0, inStock: true, stockQuantity: 999999 }]
    };

    addItem(product, product.variants[0]);
    setIsModalOpen(false);
    openCart();
  };

  return (
    <main className="manual-therapy-view">
      {/* 1. HERO SECTION */}
      <section className="therapy-hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="therapy-hero-container">
          <div className="therapy-pill-tag">
            <span>💆</span> FAAF PERFORMANCE RECOVERY STUDIO
          </div>
          <h1 className="therapy-hero-title">
            MANUAL <span className="hero-highlight">THERAPY.</span>
          </h1>
          <p className="therapy-hero-subtitle">
            Move Better. Recover Better. Perform Better.
          </p>
          <p className="therapy-hero-desc">
            FAAF Manual Therapy delivers personalized, hands-on recovery sessions engineered for athletes and active individuals. Designed around functional mobility, tissue recovery, deep physical relaxation, and sustained physical performance.
          </p>

          <div className="therapy-hero-ctas">
            <a href="#services" className="primary-btn">
              EXPLORE SESSIONS ↓
            </a>
            <button
              type="button"
              className="secondary-btn light"
              onClick={() => openBookingModal()}
            >
              BOOK YOUR SESSION →
            </button>
          </div>

          <div className="therapy-stats-strip">
            <div className="therapy-stat-item">
              <strong>1-ON-1</strong>
              <span>Dedicated Attention</span>
            </div>
            <div className="therapy-stat-item">
              <strong>100%</strong>
              <span>Performance-Focused</span>
            </div>
            <div className="therapy-stat-item">
              <strong>CUSTOM</strong>
              <span>Tailored to Your Training</span>
            </div>
            <div className="therapy-stat-item">
              <strong>STUDIO</strong>
              <span>Private Luxury Environment</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="therapy-services-section" id="services">
        <div className="therapy-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">CUSTOMIZED HANDS-ON SESSIONS</span>
            <h2 className="section-main-title">OUR MANUAL THERAPY SERVICES</h2>
            <p className="section-desc">
              Every session is structured around your physical demands, training intensity, and personal recovery priorities.
            </p>
          </div>

          <div className="therapy-cards-grid">
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                Loading services...
              </div>
            ) : therapyServices.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                No services available at this time.
              </div>
            ) : (
              therapyServices.map(service => (
                <article key={service.id} className="therapy-service-card">
                  <div className="service-card-header">
                  <span className="service-tag">{service.tag}</span>
                  <span className="service-duration-badge">⏱️ {service.duration}</span>
                </div>

                <div className="service-icon-box">
                  <span className="service-icon">{service.icon}</span>
                </div>

                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.shortDescription}</p>

                <div className="service-focus-box">
                  <span className="focus-label">KEY SESSION FOCUS:</span>
                  <ul className="focus-list">
                    {service.focusAreas.map((area, i) => (
                      <li key={i}>✓ {area}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-best-for">
                  <small>RECOMMENDED FOR:</small>
                  <p>{service.bestFor}</p>
                </div>

                <div className="service-card-footer">
                  <button
                    type="button"
                    className="primary-btn full-width"
                    onClick={() => openBookingModal(service.name)}
                  >
                    BOOK SESSION →
                  </button>
                </div>
              </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE FAAF MANUAL THERAPY (FEATURED BENEFITS) */}
      <section className="why-therapy-section">
        <div className="therapy-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">THE FAAF RECOVERY ADVANTAGE</span>
            <h2 className="section-main-title">WHY CHOOSE FAAF MANUAL THERAPY?</h2>
            <p className="section-desc">
              We bridge the gap between rigorous athletic training and restorative hands-on bodywork.
            </p>
          </div>

          <div className="why-therapy-grid">
            <div className="why-therapy-card">
              <div className="why-card-icon">🎯</div>
              <h3>Personalized Sessions</h3>
              <p>
                Every appointment begins with a brief check-in regarding your current training split, tight spots, and lifestyle habits so every minute is customized to your body.
              </p>
            </div>

            <div className="why-therapy-card">
              <div className="why-card-icon">⚡</div>
              <h3>Performance-Focused Approach</h3>
              <p>
                Engineered specifically for individuals who lift weights, run, train sports, or demand high output from their physical frame every single day.
              </p>
            </div>

            <div className="why-therapy-card">
              <div className="why-card-icon">🔄</div>
              <h3>Recovery Support</h3>
              <p>
                Promotes efficient recovery between heavy workouts, helping release muscular tension, improve local circulation, and refresh tight muscle groups.
              </p>
            </div>

            <div className="why-therapy-card">
              <div className="why-card-icon">📐</div>
              <h3>Mobility-Focused Protocols</h3>
              <p>
                Combines hands-on tissue work with assisted mobility techniques to help support unrestricted, comfortable joint movement throughout daily routines.
              </p>
            </div>

            <div className="why-therapy-card">
              <div className="why-card-icon">🏆</div>
              <h3>Professional Experience</h3>
              <p>
                Practitioners versed in human movement mechanics, athletic recovery principles, and modern hands-on muscular relaxation methods.
              </p>
            </div>

            <div className="why-therapy-card">
              <div className="why-card-icon">👑</div>
              <h3>Individual Attention</h3>
              <p>
                A tranquil, 1-on-1 private studio environment where your comfort, recovery targets, and overall physical wellness take absolute center stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 3-STEP EXPERIENCE */}
      <section className="therapy-process-section">
        <div className="therapy-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">HOW IT WORKS</span>
            <h2 className="section-main-title">YOUR SESSION JOURNEY</h2>
            <p className="section-desc">
              Three streamlined steps from booking your session to walking out feeling revitalized.
            </p>
          </div>

          <div className="process-steps-grid">
            <div className="process-step-card">
              <div className="step-num">01</div>
              <h4>Movement &amp; Tension Check</h4>
              <p>
                We review your training routine, identify muscle tightness, and discuss your goals for the day.
              </p>
            </div>

            <div className="process-step-card">
              <div className="step-num">02</div>
              <h4>Hands-On Custom Therapy</h4>
              <p>
                Enjoy targeted manual therapy, assisted stretching, and muscle relaxation techniques tailored to your body.
              </p>
            </div>

            <div className="process-step-card">
              <div className="step-num">03</div>
              <h4>Post-Session Recovery Tips</h4>
              <p>
                Receive actionable advice on post-session hydration, gentle mobility drills, and optimal training timing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MANUAL THERAPY INQUIRY SECTION */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryInquiryBanner
            category="Manual Therapy"
            title="HAVE QUESTIONS ABOUT OUR MANUAL THERAPY PROTOCOLS?"
            subtitle="Ask about sports massage, deep tissue therapy, mobility work, session durations, or therapist recommendations for your specific recovery goals."
            buttonText="ASK A THERAPY SPECIALIST →"
            badge="RECOVERY CONSULTATION"
            icon="💆"
            pageName="/manual-therapy"
          />
        </div>
      </section>

      {/* 6. BOOKING / CONTACT CTA */}
      <section className="therapy-cta-banner">
        <div className="therapy-cta-inner">
          <span className="section-subtitle-tag">ELEVATE YOUR RECOVERY</span>
          <h2>READY TO FEEL THE DIFFERENCE?</h2>
          <p>
            Book your Manual Therapy session with FAAF. Experience personalized hands-on bodywork tailored to your training and mobility.
          </p>
          <div className="therapy-cta-buttons">
            <button
              type="button"
              className="primary-btn"
              onClick={() => openBookingModal()}
            >
              BOOK YOUR SESSION →
            </button>
            <Link href="/programs" className="secondary-btn light">
              EXPLORE TRAINING PROGRAMS
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BOOKING MODAL */}
      {isModalOpen && (
        <div
          className="plan-modal-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="plan-modal-content therapy-booking-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="plan-modal-header">
              <div>
                <span className="service-tag">FAAF STUDIO RESERVATION</span>
                <h2>BOOK MANUAL THERAPY</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close booking modal"
              >
                ✕
              </button>
            </div>

            <div className="plan-modal-body">
              {isSubmitted ? (
                <div className="booking-success-box">
                  <span className="success-icon">🎉</span>
                  <h3>BOOKING REQUEST RECEIVED</h3>
                  <p>
                    Thank you, <strong>{formData.name || 'Athlete'}</strong>! We have received your reservation request for <strong>{formData.service}</strong> ({formData.duration}).
                  </p>
                  <p className="success-sub">
                    Our recovery studio specialist will contact you via email at <strong>{formData.email}</strong> or phone ({formData.phone}) within 2 hours to confirm your exact appointment time.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      CLOSE &amp; RETURN TO SITE
                    </button>
                    <button
                      type="button"
                      className="secondary-btn light"
                      onClick={() => {
                        setIsSubmitted(false);
                        setErrorMessage(null);
                      }}
                    >
                      SUBMIT ANOTHER REQUEST
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="therapy-booking-form">
                  {errorMessage && (
                    <div className="form-error-banner" role="alert">
                      <span className="error-icon">⚠️</span>
                      <div className="error-text">
                        <strong>Submission Error:</strong> {errorMessage}
                      </div>
                    </div>
                  )}

                  <div className="form-group-row">
                    <div className="form-field">
                      <label htmlFor="tb-service">Selected Service</label>
                      <select
                        id="tb-service"
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        className="modal-select-field"
                        disabled={isSubmitting}
                        required
                      >
                        {therapyServices.map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.duration})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="tb-duration">Session Duration</label>
                      <select
                        id="tb-duration"
                        value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                        className="modal-select-field"
                        disabled={isSubmitting}
                      >
                        <option value="45 Minutes">45 Minutes (Express Recovery)</option>
                        <option value="60 Minutes">60 Minutes (Standard Session)</option>
                        <option value="90 Minutes">90 Minutes (Deep Comprehensive)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label htmlFor="tb-date">Preferred Date</label>
                      <input
                        id="tb-date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="modal-email-input"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="tb-time">Preferred Time of Day</label>
                      <select
                        id="tb-time"
                        value={formData.preferredTime}
                        onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="modal-select-field"
                        disabled={isSubmitting}
                      >
                        <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="tb-notes">Focus Areas / Training Notes (Optional)</label>
                    <textarea
                      id="tb-notes"
                      rows={3}
                      placeholder="E.g., heavy squat day yesterday, tight hamstrings & lower back..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="modal-textarea-field"
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-btn full-width"
                    style={{ marginTop: '10px' }}
                    disabled={isSubmitting}
                  >
                    ADD SESSION TO BAG →
                  </button>

                  <small className="modal-disclaimer">
                    1-on-1 private studio session. No payment required today—you will receive confirmation &amp; location details via email/phone.
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
