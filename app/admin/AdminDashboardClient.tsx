'use client';

import React, { useState } from 'react';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import PromotionsTab from './components/PromotionsTab';
import ReviewsTab from './components/ReviewsTab';
import CustomersTab from './components/CustomersTab';

function AccordionSection({ title, id, defaultExpanded = false, children }: { title: string, id: string, defaultExpanded?: boolean, children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div id={id} style={{ 
      marginBottom: '24px', 
      background: 'var(--bg-surface)', 
      borderRadius: '8px', 
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden'
    }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent',
          border: 'none',
          color: 'var(--text-main)',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardClient({ initialData }: { initialData: any }) {

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'customers', label: 'Customers' },
    { id: 'products', label: 'Products & Inventory' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="admin-single-page">
      <div className="admin-top-nav" style={{ 
        display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 100
      }}>
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: 'var(--gold-500)',
              border: '1px solid var(--gold-500)',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem'
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="admin-dashboard-content">
        
        <AccordionSection title="Dashboard Statistics" id="dashboard" defaultExpanded={true}>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <h3>Total Orders</h3>
              <div className="stat-value">{initialData.orders?.length || 0}</div>
            </div>
            <div className="admin-stat-card">
              <h3>Total Revenue</h3>
              <div className="stat-value">
                ${initialData.orders?.reduce((sum: number, o: any) => sum + (o.order_status !== 'cancelled' ? Number(o.total) : 0), 0).toFixed(2)}
              </div>
            </div>
            <div className="admin-stat-card">
              <h3>Total Products</h3>
              <div className="stat-value">{initialData.products?.length || 0}</div>
            </div>
            <div className="admin-stat-card">
              <h3>Total Reviews</h3>
              <div className="stat-value">{initialData.reviews?.length || 0}</div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Orders Management" id="orders">
          <OrdersTab orders={initialData.orders} />
        </AccordionSection>

        <AccordionSection title="Customers" id="customers">
          <CustomersTab orders={initialData.orders} />
        </AccordionSection>

        <AccordionSection title="Products & Inventory" id="products">
          <ProductsTab products={initialData.products} />
        </AccordionSection>

        <AccordionSection title="Promotions & Coupons" id="promotions">
          <PromotionsTab />
        </AccordionSection>

        <AccordionSection title="Reviews" id="reviews">
          <ReviewsTab reviews={initialData.reviews} />
        </AccordionSection>

      </div>
    </div>
  );
}
