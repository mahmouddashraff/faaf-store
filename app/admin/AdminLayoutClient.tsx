'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    // Notify the global Header about the state change so it can animate its hamburger
    document.dispatchEvent(new CustomEvent('adminMenuStateChange', { detail: isMobileMenuOpen }));
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleToggle = () => setIsMobileMenuOpen(prev => !prev);
    document.addEventListener('toggleAdminMenu', handleToggle);
    return () => document.removeEventListener('toggleAdminMenu', handleToggle);
  }, []);

  return (
    <div className="admin-layout">

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          FAAF Admin
        </div>
        <nav className="admin-nav" onClick={() => setIsMobileMenuOpen(false)}>
          <Link href="/admin">Control Center</Link>
          <Link href="/account">Exit Admin</Link>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
