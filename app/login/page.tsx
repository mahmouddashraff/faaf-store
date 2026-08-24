'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { login } from '../actions/auth';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" className="primary-btn full-width" disabled={pending}>
      {pending ? 'SIGNING IN...' : 'SIGN IN'}
    </button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <main className="page-main login-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your FAAF Fitness Magic account</p>
          </div>

          <form action={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

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
              />
            </div>

            <div className="auth-actions">
              <SubmitButton />
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="auth-link">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
