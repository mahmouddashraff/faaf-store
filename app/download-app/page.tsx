'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function DownloadAppPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', position: 'relative', overflow: 'hidden' }}>
      <title>Install FAAF App | FAAF Fitness Magic</title>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(223, 183, 108, 0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(226, 232, 240, 0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 100px', position: 'relative', zIndex: 10 }}>
        
        {/* Back Button */}
        <div style={{ marginBottom: '60px' }}>
          <Link href="/" className="secondary-btn" style={{ padding: '10px 20px', fontSize: '0.8125rem' }}>
            ← BACK TO STORE
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="hero-pill-tag">FAAF FITNESS MAGIC</span>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 900, 
            lineHeight: 1.1, 
            margin: '20px 0',
            background: 'var(--gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 15px rgba(223, 183, 108, 0.2)'
          }}>
            YOUR FITNESS.<br />ALWAYS WITH YOU.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Install the FAAF app on your phone and get instant access to your fitness experience directly from your home screen.
          </p>

          <div style={{ position: 'relative', margin: '0 auto' }}>
            <div style={{ position: 'absolute', inset: '-20px', background: 'var(--gold-glow-strong)', filter: 'blur(40px)', borderRadius: '50%', zIndex: -1, opacity: 0.35 }}></div>
            {/* Minimal App Mockup / Visual */}
            <div style={{ width: '280px', height: '560px', border: '1px solid var(--border-gold)', borderRadius: '40px', background: '#0a0a0d', padding: '12px', boxShadow: 'var(--shadow-xl), 0 0 40px rgba(223, 183, 108, 0.15)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '30px', background: 'linear-gradient(180deg, #111 0%, #000 100%)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: '#000', border: '1px solid rgba(223, 183, 108, 0.4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(223, 183, 108, 0.2)', marginBottom: '20px' }}>
                  <img src="/logo.png" alt="FAAF" style={{ width: '40px', height: '40px' }} />
                </div>
                <h3 style={{ color: 'var(--silver-100)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>FAAF STORE</h3>
                <div style={{ marginTop: '40px', width: '70%', height: '4px', background: 'rgba(223, 183, 108, 0.3)', borderRadius: '2px' }}></div>
                <div style={{ marginTop: '15px', width: '50%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--silver-100)', marginBottom: '15px' }}>
            INSTALL THE FAAF APP
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Choose your device and follow the simple steps.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          
          {/* Android Card */}
          <div style={{ 
            background: 'var(--bg-surface-card)', 
            border: '1px solid rgba(223, 183, 108, 0.25)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '40px 30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(223, 183, 108, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.6), 0 0 40px rgba(223, 183, 108, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(223, 183, 108, 0.05)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(223, 183, 108, 0.08)', border: '1px solid rgba(223, 183, 108, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.73 7.828l2.122-3.676a.44.44 0 0 0-.158-.6.438.438 0 0 0-.598.159l-2.164 3.75A11.393 11.393 0 0 0 12 7.022c-1.385 0-2.716.242-3.932.68l-2.164-3.75a.438.438 0 0 0-.598-.16.44.44 0 0 0-.158.6l2.122 3.676C4.423 9.475 2.222 12.35 2 15.748h20c-.222-3.398-2.423-6.273-5.27-7.92zM8.349 13.59c-.585 0-1.059-.475-1.059-1.06 0-.585.474-1.059 1.059-1.059.584 0 1.059.474 1.059 1.059 0 .585-.475 1.06-1.059 1.06zm7.302 0c-.584 0-1.059-.475-1.059-1.06 0-.585.475-1.059 1.059-1.059.585 0 1.059.474 1.059 1.059 0 .585-.474 1.06-1.059 1.06z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-400)', letterSpacing: '0.05em', margin: 0 }}>ANDROID</h3>
                <p style={{ color: 'var(--silver-400)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Install FAAF using Google Chrome</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1, marginTop: '10px' }}>
              {[
                "Open this website in Google Chrome.",
                "Tap the three dots (⋮) in the top-right corner.",
                "Select 'Install app' or 'Add to Home screen'.",
                "Tap 'Install' or 'Add'."
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', paddingBottom: '15px', borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ color: 'var(--gold-500)', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.05em', paddingTop: '2px' }}>0{idx + 1}</div>
                  <div style={{ color: 'var(--silver-200)', fontSize: '1rem', lineHeight: 1.4 }}>{step}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(223, 183, 108, 0.05)', borderRadius: '10px', border: '1px solid rgba(223, 183, 108, 0.15)', textAlign: 'center' }}>
              <p style={{ color: 'var(--gold-400)', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>FAAF will now appear on your Android home screen.</p>
            </div>
          </div>

          {/* iPhone Card */}
          <div style={{ 
            background: 'var(--bg-surface-card)', 
            border: '1px solid rgba(223, 183, 108, 0.25)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '40px 30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(223, 183, 108, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.6), 0 0 40px rgba(223, 183, 108, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(223, 183, 108, 0.05)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(223, 183, 108, 0.08)', border: '1px solid rgba(223, 183, 108, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.8-3.08 1.8-.97 0-1.46-.71-2.9-.71-1.46 0-1.92.71-2.9.71-1.04 0-2.14-.88-3.14-1.85-2.07-2.1-3.66-5.83-3.66-8.77 0-3.32 2.1-5.18 4.34-5.18 1.34 0 2.37.82 3.51.82 1.15 0 2.45-.88 3.86-.82 1.5.05 2.76.62 3.55 1.6-3.23 1.86-2.73 6.13.37 7.23-.74 2-1.87 3.96-3.03 5.17zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.3-1.81 4.22-3.74 4.25z"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-400)', letterSpacing: '0.05em', margin: 0 }}>IPHONE</h3>
                <p style={{ color: 'var(--silver-400)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Install FAAF using Safari</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1, marginTop: '10px' }}>
              {[
                "Open this website in Safari.",
                "Tap the Share button.",
                "Scroll down and select 'Add to Home Screen'.",
                "Tap 'Add'."
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', paddingBottom: '15px', borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ color: 'var(--gold-500)', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.05em', paddingTop: '2px' }}>0{idx + 1}</div>
                  <div style={{ color: 'var(--silver-200)', fontSize: '1rem', lineHeight: 1.4 }}>{step}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(223, 183, 108, 0.05)', borderRadius: '10px', border: '1px solid rgba(223, 183, 108, 0.15)', textAlign: 'center' }}>
              <p style={{ color: 'var(--gold-400)', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>FAAF will now appear on your iPhone home screen.</p>
            </div>
          </div>

        </div>

        {/* Important Notice */}
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--silver-300)', fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.1em', margin: '0 0 10px 0' }}>IMPORTANT</h4>
          <p style={{ color: 'var(--silver-500)', fontSize: '0.9375rem', margin: 0 }}>
            For the best installation experience, use <strong style={{ color: 'var(--silver-200)' }}>Google Chrome</strong> on Android or <strong style={{ color: 'var(--silver-200)' }}>Safari</strong> on iPhone.
          </p>
        </div>

      </div>
    </main>
  );
}
