'use client';

import React, { useState } from 'react';

export default function CustomersTab({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState('');

  // Group orders by email to derive unique customers
  const customerMap = new Map<string, any>();

  for (const order of orders) {
    if (!order.customer_email) continue;
    const email = order.customer_email.toLowerCase();
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        email,
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
        phone: order.customer_phone,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: order.created_at,
        orders: []
      });
    }
    
    const c = customerMap.get(email);
    c.totalOrders += 1;
    c.totalSpent += Number(order.total);
    c.orders.push(order);
    if (new Date(order.created_at) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = order.created_at;
    }
  }

  const customers = Array.from(customerMap.values()).filter(c => 
    c.email.includes(search.toLowerCase()) || 
    c.firstName?.toLowerCase().includes(search.toLowerCase()) || 
    c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Customers Directory</h2>
        <input 
          type="search" 
          placeholder="Search customers..." 
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
              <th>Customer</th>
              <th>Contact Info</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.email}>
                <td>
                  <strong>{c.firstName} {c.lastName}</strong>
                </td>
                <td>
                  <a href={`mailto:${c.email}`} style={{ color: 'var(--gold-500)', textDecoration: 'none' }}>{c.email}</a><br/>
                  <small style={{ color: 'var(--silver-500)' }}>{c.phone}</small>
                </td>
                <td>{c.totalOrders}</td>
                <td>${c.totalSpent.toFixed(2)}</td>
                <td>{new Date(c.lastOrderDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
