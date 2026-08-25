'use client';

import React, { useState } from 'react';
import { updateReviewStatusAction, deleteReviewAction } from '../../actions/admin';

export default function ReviewsTab({ reviews }: { reviews: any[] }) {
  const [search, setSearch] = useState('');
  
  // Need local state for optimistic UI updates without reloading
  const [localReviews, setLocalReviews] = useState(reviews);

  const filteredReviews = localReviews.filter(r => 
    r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.review_text?.toLowerCase().includes(search.toLowerCase()) ||
    r.products?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (reviewId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'hidden' ? 'published' : 'hidden';
    setLocalReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
    await updateReviewStatusAction(reviewId, newStatus);
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    setLocalReviews(prev => prev.filter(r => r.id !== reviewId));
    await deleteReviewAction(reviewId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Manage Reviews</h2>
        <input 
          type="search" 
          placeholder="Search reviews..." 
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
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => {
              const status = review.status || 'published';
              return (
                <tr key={review.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(review.created_at).toLocaleDateString()}</td>
                  <td>
                    <strong>{review.customer_name}</strong><br/>
                    {review.is_verified_purchase && (
                      <small style={{ color: 'var(--gold-500)' }}>✓ Verified Buyer</small>
                    )}
                  </td>
                  <td>{review.products?.name || 'Unknown Product'}</td>
                  <td>
                    <span style={{ color: 'var(--gold-400)' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <p style={{ margin: 0, fontSize: '0.9em', lineHeight: '1.4' }}>
                      {review.review_text}
                    </p>
                  </td>
                  <td>
                    <span className={`admin-status-badge status-${status === 'hidden' ? 'cancelled' : 'confirmed'}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        onClick={() => handleToggleStatus(review.id, status)}
                        className={`admin-action-btn ${status === 'hidden' ? 'primary-btn' : 'secondary-btn'}`}
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        {status === 'hidden' ? 'Approve' : 'Hide'}
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="admin-action-btn"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,0,0,0.2)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredReviews.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
