import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '../actions/auth';
import IntentRestorer from './IntentRestorer';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch recent orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Check if admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const isAdmin = roleData?.role === 'admin';

  return (
    <main className="page-main account-page">
      <IntentRestorer />
      <div className="account-container">
        <header className="account-header">
          <div>
            <h1 className="account-title">My Account</h1>
            <p className="account-subtitle">Welcome back, {user.email}</p>
          </div>
          <div className="account-actions">
            {isAdmin && (
              <Link href="/admin" className="secondary-btn admin-badge">
                Admin Dashboard
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="secondary-btn">Sign Out</button>
            </form>
          </div>
        </header>

        <section className="account-section">
          <h2>Recent Orders</h2>
          {error ? (
            <div className="alert-error">Failed to load orders.</div>
          ) : !orders || orders.length === 0 ? (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
              <Link href="/shop" className="primary-btn">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-number">{order.order_number}</span>
                    <span className={`order-status status-${order.order_status}`}>
                      {order.order_status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                    <p>Total: ${order.total}</p>
                    <p>Payment: Cash on Delivery</p>
                  </div>
                  <div className="order-actions">
                    <Link href={`/account/orders/${order.id}`} className="view-order-link">
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
