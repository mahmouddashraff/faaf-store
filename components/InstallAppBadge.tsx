'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function InstallAppBadge() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (standalone) {
      setIsStandalone(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      setDeviceType('android');
    } else if (isIOS) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  if (deviceType === 'desktop' || deviceType === null || isStandalone) {
    return null;
  }

  const renderModal = () => {
    if (typeof document === 'undefined' || !showModal) return null;

    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="bg-[#111] border border-[#d4af37]/30 rounded-2xl p-6 w-full shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col gap-5" style={{ maxWidth: '360px', margin: '0 auto', position: 'relative' }}>
          <div className="flex justify-between items-start">
            <h3 className="text-white font-bold text-xl m-0 tracking-wide">
              {deviceType === 'android' ? 'Install FAAF on Android' : 'Install FAAF on iPhone'}
            </h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
              aria-label="Close"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="text-gray-300 text-sm leading-relaxed flex flex-col gap-3">
            {deviceType === 'android' ? (
              <>
                <p>1. Open this website in Google Chrome.</p>
                <p>2. Tap the three dots (⋮) in the top-right corner.</p>
                <p>3. Tap <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.</p>
                <p>4. Tap <strong className="text-white">"Install"</strong> / <strong className="text-white">"Add"</strong>.</p>
              </>
            ) : (
              <>
                <p>1. Open this website in Safari.</p>
                <p>2. Tap the Share button at the bottom.</p>
                <p>3. Tap <strong className="text-white">"Add to Home Screen"</strong>.</p>
                <p>4. Tap <strong className="text-white">"Add"</strong>.</p>
              </>
            )}
          </div>

          <button 
            onClick={() => setShowModal(false)}
            className="mt-2 w-full py-3 rounded-xl bg-[#d4af37] text-black font-bold hover:bg-[#b5952f] transition-colors border-none cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          color: '#d4af37',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          marginLeft: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Install App
      </button>
      {renderModal()}
    </>
  );
}
