import React from 'react';
import { createClient } from '../../../../utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = params;

  // Fetch order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !order || order.user_id !== user.id) {
    return (
      <main className="page-main account-page">
        <div className="account-container">
          <h2>Order Not Found</h2>
          <p>We couldn't find this order or you don't have permission to view it.</p>
          <Link href="/account" className="auth-link">&larr; Back to Account</Link>
        </div>
      </main>
    );
  }

  // Fetch order items
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  return (
    <main className="page-main account-page">
      <div className="account-container">
        <Link href="/account" className="back-link">&larr; Back to Orders</Link>
        
        <header className="order-details-header">
          <h1>Order {order.order_number}</h1>
          <span className={`order-status status-${order.order_status}`}>{order.order_status}</span>
        </header>

        <div className="order-info-grid">
          <div className="info-card">
            <h3>Delivery Details</h3>
            <p>{order.customer_first_name} {order.customer_last_name}</p>
            <p>{order.address}</p>
            {order.apartment && <p>{order.apartment}</p>}
            <p>{order.city}, {order.country}</p>
            <p>{order.customer_phone}</p>
            {order.delivery_notes && <p className="delivery-notes"><strong>Notes:</strong> {order.delivery_notes}</p>}
          </div>
          
          <div className="info-card">
            <h3>Order Summary</h3>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
            <p><strong>Subtotal:</strong> ${order.subtotal}</p>
            <p><strong>Delivery Fee:</strong> ${order.delivery_fee}</p>
            <p className="order-total"><strong>Total:</strong> ${order.total}</p>
          </div>
        </div>

        <section className="order-items-section">
          <h3>Items in this order</h3>
          <div className="order-items-list">
            {items?.map((item) => (
              <div key={item.id} className="order-item-row">
                <div className="item-info">
                  <h4>{item.product_name}</h4>
                  <p className="item-variant">{item.variant_name}</p>
                  <p className="item-price">${item.price_at_purchase} x {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price_at_purchase * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
