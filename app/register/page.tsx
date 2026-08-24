'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { register } from '../actions/auth';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" className="primary-btn full-width" disabled={pending}>
      {pending ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
    </button>
  );
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const res = await register(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <main className="page-main login-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join FAAF Fitness Magic for exclusive benefits</p>
          </div>

          <form action={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="contact-input-field"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="contact-input-field"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="form-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="contact-input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="contact-input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="auth-actions">
              <SubmitButton />
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
