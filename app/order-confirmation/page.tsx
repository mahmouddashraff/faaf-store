import React from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/utils/supabase/admin';
import { formatPrice } from '@/lib/products';
import { redirect } from 'next/navigation';

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;

  if (!orderId) {
    redirect('/shop');
  }

  // Use the admin client to bypass RLS so guests can view their newly created order
  // since UUIDs are cryptographically secure and unguessable.
  const adminAuth = createAdminClient();

  // Fetch order details
  const { data: order, error } = await adminAuth
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return (
      <main className="page-main confirmation-page">
        <div className="confirmation-container">
          <h2>Order Not Found</h2>
          <p>We couldn't locate your order details.</p>
          <Link href="/shop" className="primary-btn">CONTINUE SHOPPING</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon-wrap confirmation-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 className="confirmation-title">ORDER CONFIRMED ✓</h1>
        <p className="confirmation-greeting">
          Thank you for your order, <strong>{order.customer_first_name}</strong>.
        </p>

        <div className="confirmation-details-box">
          <div className="detail-row">
            <span>Order Number</span>
            <strong className="detail-highlight">{order.order_number}</strong>
          </div>
          <div className="detail-row">
            <span>Payment Method</span>
            <strong>Cash on Delivery</strong>
          </div>
          <div className="detail-row">
            <span>Total</span>
            <strong className="detail-highlight">{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="confirmation-items" style={{ marginTop: '2rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ color: '#d4af37', fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Order Summary</h3>
          {order.order_items && order.order_items.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.product_name}</div>
                <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{item.variant_name} x {item.quantity}</div>
              </div>
              <div style={{ color: '#d4af37' }}>
                {formatPrice(item.price_at_purchase * item.quantity)}
              </div>
            </div>
          ))}
          {order.delivery_fee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#aaa' }}>
              <span>Delivery Fee</span>
              <span>{formatPrice(order.delivery_fee)}</span>
            </div>
          )}
        </div>

        <p className="confirmation-message" style={{ marginTop: '2rem' }}>
          We will contact you shortly at <strong>{order.customer_phone}</strong> to confirm your delivery to <strong>{order.city}</strong>.
        </p>

        <div className="confirmation-actions">
          <Link href="/account/orders" className="outline-btn">VIEW MY ORDERS</Link>
          <Link href="/shop" className="primary-btn">CONTINUE SHOPPING</Link>
        </div>
      </div>
    </main>
  );
}
