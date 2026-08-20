'use client';

import React, { useState } from 'react';
import { submitContactRequest } from '../lib/contact';

export interface CategoryInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  pageName?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Reusable modal for category/page customer inquiries.
 * Pre-fills the category, saves to contact_requests in Supabase,
 * and notifies elkberfahd@gmail.com without redirecting.
 */
export function CategoryInquiryModal({
  isOpen,
  onClose,
  category,
  pageName,
  title,
  subtitle,
}: CategoryInquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage('Please fill in your full name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await submitContactRequest({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      category: category,
      page: pageName || category,
      created_at: new Date().toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.error || 'Failed to submit your inquiry. Please try again.');
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setMessage('');
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div
      className="plan-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      <div
        className="plan-modal-content category-inquiry-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="plan-modal-header">
          <div>
            <span className="service-tag">FAAF EXPERT INQUIRY</span>
            <h2 id="inquiry-modal-title">
              {title || `ASK ABOUT ${category.toUpperCase()}`}
            </h2>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close inquiry modal"
          >
            ✕
          </button>
        </div>

        <div className="plan-modal-body">
          {isSubmitted ? (
            <div className="booking-success-box">
              <span className="success-icon">🎉</span>
              <h3>INQUIRY TRANSMITTED</h3>
              <p>
                Thank you, <strong>{name}</strong>! Your inquiry regarding{' '}
                <strong>{category}</strong> has been received by our athlete support team.
              </p>
              <p className="success-sub">
                A specialist will review your message and contact you at{' '}
                <strong>{phone}</strong> within 2 hours.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  marginTop: '24px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  className="primary-btn"
                  onClick={onClose}
                >
                  RETURN TO PAGE
                </button>
                <button
                  type="button"
                  className="secondary-btn light"
                  onClick={handleReset}
                >
                  ASK ANOTHER QUESTION
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="therapy-booking-form">
              {/* Category indicator */}
              <div className="inquiry-category-indicator">
                <span className="indicator-label">CURRENT INQUIRY TOPIC:</span>
                <span className="indicator-badge">🏷️ {category}</span>
              </div>

              {subtitle && (
                <p className="inquiry-modal-sub">{subtitle}</p>
              )}

              {errorMessage && (
                <div className="form-error-banner" role="alert">
                  <span className="error-icon">⚠️</span>
                  <div className="error-text">
                    <strong>Submission Error:</strong> {errorMessage}
                  </div>
                </div>
              )}

              <div className="form-field">
                <label htmlFor="inquiry-name">Full Name *</label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="modal-email-input"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-field">
                <label htmlFor="inquiry-phone">Phone Number *</label>
                <input
                  id="inquiry-phone"
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 234-5678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="modal-email-input"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-field">
                <label htmlFor="inquiry-message">Your Message / Question *</label>
                <textarea
                  id="inquiry-message"
                  required
                  rows={4}
                  placeholder={`Ask anything about ${category}, ingredients, dosage, customized adjustments, or recommendations...`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="modal-textarea-field"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="primary-btn full-width"
                style={{ marginTop: '8px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'TRANSMITTING INQUIRY...' : `SUBMIT INQUIRY ABOUT ${category.toUpperCase()} →`}
              </button>

              <small className="modal-disclaimer">
                🔒 Direct 1-on-1 athlete consultation. Fast response to your phone within 2 hours. Zero spam.
              </small>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export interface CategoryInquiryBannerProps {
  category: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  badge?: string;
  icon?: string;
  pageName?: string;
  className?: string;
}

/**
 * Reusable embedded luxury CTA banner with integrated modal for any category page.
 */
export default function CategoryInquiryBanner({
  category,
  title,
  subtitle,
  buttonText,
  badge = 'EXPERT GUIDANCE',
  icon = '💬',
  pageName,
  className = '',
}: CategoryInquiryBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultTitle = `HAVE QUESTIONS ABOUT ${category.toUpperCase()}?`;
  const defaultSubtitle = `Connect directly with our nutritionists and coaches for personalized advice regarding ${category}. Fast response within 2 hours.`;
  const defaultBtnText = `ASK ABOUT ${category.toUpperCase()} →`;

  return (
    <>
      <div className={`category-inquiry-banner ${className}`}>
        <div className="inquiry-banner-glow"></div>
        <div className="inquiry-banner-inner">
          <div className="inquiry-banner-icon-col">
            <span className="inquiry-banner-icon">{icon}</span>
          </div>

          <div className="inquiry-banner-text-col">
            <span className="inquiry-pill-badge">{badge}</span>
            <h3 className="inquiry-banner-title">{title || defaultTitle}</h3>
            <p className="inquiry-banner-sub">{subtitle || defaultSubtitle}</p>
          </div>

          <div className="inquiry-banner-cta-col">
            <button
              type="button"
              className="primary-btn inquiry-cta-btn"
              onClick={() => setIsModalOpen(true)}
            >
              {buttonText || defaultBtnText}
            </button>
          </div>
        </div>
      </div>

      <CategoryInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={category}
        pageName={pageName}
        title={title}
        subtitle={subtitle}
      />
    </>
  );
}
