'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitContactRequest } from '../../lib/contact';

const inquiryCategories = [
  'General Inquiry',
  'Order & Shipping Support',
  'Product & Supplement Advice',
  'Meal Plans & Nutrition Guidance',
  'Manual Therapy & Recovery Studio',
  'Wholesale & Business Partnerships',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedMessage = formData.email.trim()
      ? `[Email: ${formData.email.trim()}] ${formData.message.trim()}`
      : formData.message.trim();

    const result = await submitContactRequest({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formattedMessage,
      category: formData.category,
      page: '/contact',
      created_at: new Date().toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.error || 'Failed to submit contact request. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      category: 'General Inquiry',
      message: '',
    });
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <main className="contact-page-view">
      {/* 1. HERO HEADER */}
      <section className="contact-hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="contact-hero-inner">
          <div className="contact-pill-tag">
            <span>💬</span> 24/7 ATHLETE &amp; CUSTOMER SUPPORT
          </div>
          <h1 className="contact-hero-title">
            GET IN TOUCH WITH <span className="hero-highlight">FAAF.</span>
          </h1>
          <p className="contact-hero-desc">
            Have questions about our science-backed supplements, structured meal plans, manual therapy sessions, or order delivery? Our dedicated team is here to assist you every step of the way.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID: INFO & FORM */}
      <section className="contact-main-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* LEFT COLUMN: SUPPORT DETAILS */}
            <div className="contact-info-col">
              <div className="section-header-block text-left">
                <span className="section-subtitle-tag">DIRECT CHANNELS</span>
                <h2 className="contact-info-heading">WE ARE READY TO HELP</h2>
                <p className="contact-info-sub">
                  Reach out through our direct lines, email support, or submit your request using the form.
                </p>
              </div>

              <div className="contact-cards-stack">
                <div className="contact-info-card">
                  <div className="contact-card-icon">📞</div>
                  <div className="contact-card-content">
                    <h4>Athlete Support Hotline</h4>
                    <p className="contact-value">+1 (800) 555-FAAF</p>
                    <span className="contact-sub">Available Mon - Sat, 8:00 AM - 8:00 PM EST</span>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-card-icon">✉️</div>
                  <div className="contact-card-content">
                    <h4>Direct Email Support</h4>
                    <p className="contact-value">support@faaf-fitness.com</p>
                    <span className="contact-sub">Average response time: Under 2 hours</span>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-card-icon">💆</div>
                  <div className="contact-card-content">
                    <h4>Manual Therapy Studio</h4>
                    <p className="contact-value">FAAF Performance Recovery Studio</p>
                    <span className="contact-sub">Private 1-on-1 athletic recovery by appointment</span>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-card-icon">⚡</div>
                  <div className="contact-card-content">
                    <h4>Fast Resolution Guarantee</h4>
                    <p className="contact-value">100% Satisfaction Promise</p>
                    <span className="contact-sub">Hassle-free 30-day returns &amp; order tracking support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="contact-form-col">
              <div className="contact-form-card">
                {isSubmitted ? (
                  <div className="contact-success-state">
                    <div className="contact-success-icon">🎉</div>
                    <h3>MESSAGE TRANSMITTED</h3>
                    <p className="contact-success-lead">
                      Thank you, <strong>{formData.name}</strong>! Your inquiry regarding <strong>{formData.category}</strong> has been logged.
                    </p>
                    <p className="contact-success-detail">
                      A FAAF athlete support specialist will reach out to you via phone (<strong>{formData.phone}</strong>)
                      {formData.email && <> or email (<strong>{formData.email}</strong>)</>} within 2 hours.
                    </p>
                    <div className="contact-success-actions">
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={handleReset}
                      >
                        SEND ANOTHER MESSAGE
                      </button>
                      <Link href="/shop" className="secondary-btn light">
                        RETURN TO SHOPPING →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="contact-form-header">
                      <span className="form-badge">SEND A MESSAGE</span>
                      <h2>SUBMIT INQUIRY</h2>
                      <p>Fill out the form below and an athlete specialist will connect with you.</p>
                    </div>

                    {errorMessage && (
                      <div className="form-error-banner" role="alert">
                        <span className="error-icon">⚠️</span>
                        <div className="error-text">
                          <strong>Error:</strong> {errorMessage}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="customer-contact-form">
                      <div className="form-row-2col">
                        <div className="form-input-group">
                          <label htmlFor="contact-name">Full Name *</label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            placeholder="e.g. Alex Morgan"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="contact-input-field"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="form-input-group">
                          <label htmlFor="contact-phone">Phone Number *</label>
                          <input
                            id="contact-phone"
                            type="tel"
                            required
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="contact-input-field"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="form-row-2col">
                        <div className="form-input-group">
                          <label htmlFor="contact-email">Email Address (Optional)</label>
                          <input
                            id="contact-email"
                            type="email"
                            placeholder="athlete@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="contact-input-field"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="form-input-group">
                          <label htmlFor="contact-category">Inquiry Category *</label>
                          <select
                            id="contact-category"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="contact-select-field"
                            disabled={isSubmitting}
                          >
                            {inquiryCategories.map(cat => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-input-group">
                        <label htmlFor="contact-message">Message Details *</label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          placeholder="How can our nutritionists and athlete support team help you today? Please include any order numbers or training goals..."
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          className="contact-textarea-field"
                          disabled={isSubmitting}
                        />
                      </div>

                      <button
                        type="submit"
                        className="primary-btn full-width contact-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'TRANSMITTING MESSAGE...' : 'TRANSMIT INQUIRY TO FAAF TEAM →'}
                      </button>

                      <small className="contact-form-footer-note">
                        🔒 Your information is confidential and used solely to assist with your inquiry. Zero spam.
                      </small>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ STRIP */}
      <section className="contact-faq-section">
        <div className="contact-container">
          <div className="section-header-block">
            <span className="section-subtitle-tag">QUICK ANSWERS</span>
            <h2 className="section-main-title">FREQUENTLY ASKED QUESTIONS</h2>
          </div>

          <div className="contact-faq-grid">
            <div className="contact-faq-card">
              <h4>When will my order ship?</h4>
              <p>Orders placed before 2:00 PM EST ship the same business day via Express Courier. You will receive tracking details via email and SMS.</p>
            </div>
            <div className="contact-faq-card">
              <h4>How do I book Manual Therapy?</h4>
              <p>You can reserve directly through our <Link href="/manual-therapy" style={{ color: 'var(--gold-400)', textDecoration: 'underline' }}>Manual Therapy Studio</Link> page or submit a contact request here.</p>
            </div>
            <div className="contact-faq-card">
              <h4>What is the 30-day guarantee?</h4>
              <p>If you are not 100% satisfied with your FAAF supplements or meal plans, reach out within 30 days for a full, hassle-free refund.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
