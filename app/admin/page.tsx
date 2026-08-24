import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Basic stats
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, total, order_status, created_at, customer_first_name')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="admin-page-title">Admin Dashboard</h1>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{ordersCount || 0}</div>
        </div>
        <div className="admin-stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{productsCount || 0}</div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Orders</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer_first_name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`admin-status-badge status-${order.order_status}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td>${order.total}</td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="admin-link">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
