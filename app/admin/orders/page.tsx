import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  async function updateStatus(formData: FormData) {
    'use server';
    const orderId = formData.get('orderId') as string;
    const newStatus = formData.get('status') as string;
    
    if (orderId && newStatus) {
      const supabaseServer = await createClient();
      await supabaseServer.from('orders').update({ order_status: newStatus }).eq('id', orderId);
      revalidatePath('/admin/orders');
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Manage Orders</h1>
      
      <div className="admin-section">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>
                    {order.customer_first_name} {order.customer_last_name}<br/>
                    <small>{order.city}</small>
                  </td>
                  <td>${order.total}</td>
                  <td>
                    <span className={`admin-status-badge status-${order.order_status}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td>
                    <form action={updateStatus} style={{ display: 'flex', gap: '5px' }}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <select name="status" defaultValue={order.order_status} className="contact-select-field" style={{ padding: '4px 8px', width: 'auto' }}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button type="submit" className="admin-action-btn">Update</button>
                    </form>
                  </td>
                  <td>
                    <Link href={`/account/orders/${order.id}`} className="admin-link">Details</Link>
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
