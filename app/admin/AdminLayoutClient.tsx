'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Mobile Menu Button */}
      <button 
        className="admin-mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕ Close Menu' : '☰ Admin Menu'}
      </button>

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
