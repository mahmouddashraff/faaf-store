'use client';

import React, { FormEvent, useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFeedback('Welcome to the FAAF Team! Check your inbox for your 15% welcome code.');
      setEmail('');
    }, 800);
  }

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="newsletter-card">
        <div className="newsletter-glow-bg"></div>
        <div className="newsletter-content-wrap">
          <div className="newsletter-badge">JOIN THE INNER CIRCLE</div>
          <h2 className="newsletter-heading">
            UNLOCK 15% OFF YOUR FIRST ORDER
          </h2>
          <p className="newsletter-sub">
            Get exclusive early access to product drops, athlete nutrition guides, and member-only flash sales.
          </p>

          <div className="newsletter-perks">
            <span className="newsletter-perk-item">✓ 15% Welcome Discount</span>
            <span className="newsletter-perk-item">✓ Weekly Training Protocols</span>
            <span className="newsletter-perk-item">✓ Zero Spam Guarantee</span>
          </div>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="newsletter-input-group">
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                placeholder="Enter your email address..."
                required
                className={`newsletter-input ${status === 'error' ? 'error' : ''}`}
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className="newsletter-submit-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'JOINING...' : 'JOIN NOW →'}
              </button>
            </div>
          </form>

          {feedback && (
            <div className={`newsletter-message ${status}`}>
              {status === 'success' && '🎉 '}
              {feedback}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
