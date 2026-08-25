'use client';

import React, { useState } from 'react';
import { updateOrderStatusAction } from '../../actions/admin';

export default function OrdersTab({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_first_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_last_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
        <input 
          type="search" 
          placeholder="Search orders..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="contact-input-field"
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  {order.customer_first_name} {order.customer_last_name}<br/>
                  <small style={{ color: 'var(--silver-500)' }}>{order.customer_email}</small>
                </td>
                <td>${order.total}</td>
                <td>
                  <span className={`admin-status-badge status-${order.order_status}`}>
                    {order.order_status}
                  </span>
                </td>
                <td>
                  <button onClick={() => setSelectedOrder(order)} className="admin-action-btn secondary-btn" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'var(--bg-surface)', padding: '30px', borderRadius: '8px', 
            width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2>Order {selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <h3>Customer</h3>
                <p><strong>Name:</strong> {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
              </div>
              <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <h3>Delivery</h3>
                <p>{selectedOrder.address} {selectedOrder.apartment}</p>
                <p>{selectedOrder.city}, {selectedOrder.country}</p>
                <p><strong>Notes:</strong> {selectedOrder.delivery_notes || 'None'}</p>
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <h3>Financials</h3>
              <p><strong>Subtotal:</strong> ${selectedOrder.subtotal}</p>
              {selectedOrder.coupon_code && (
                <p style={{ color: 'var(--gold-500)' }}>
                  <strong>Coupon ({selectedOrder.coupon_code}):</strong> -${selectedOrder.discount_amount}
                </p>
              )}
              <p><strong>Delivery Fee:</strong> ${selectedOrder.delivery_fee}</p>
              <p><strong>Total:</strong> ${selectedOrder.total}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <h3>Update Status</h3>
              <form action={async (fd) => {
                await updateOrderStatusAction(selectedOrder.id, fd.get('status') as string);
                setSelectedOrder({ ...selectedOrder, order_status: fd.get('status') });
              }} style={{ display: 'flex', gap: '10px' }}>
                <select name="status" defaultValue={selectedOrder.order_status} className="contact-select-field">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" className="primary-btn">Save</button>
              </form>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
