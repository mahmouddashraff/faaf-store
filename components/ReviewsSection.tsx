'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useFormStatus } from 'react-dom';
import { submitReview } from '@/app/actions/reviews';
import { useRouter } from 'next/navigation';

function ReviewSubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="primary-btn" disabled={pending} style={{ marginTop: '10px' }}>
      {pending ? 'SUBMITTING...' : 'POST REVIEW'}
    </button>
  );
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: reviewsData } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsData) {
        setReviews(reviewsData);
        if (user) {
          setHasReviewed(reviewsData.some(r => r.user_id === user.id));
        }
      }
      setLoading(false);
    }
    loadData();
  }, [productId]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const res = await submitReview(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setHasReviewed(true);
      router.refresh();
      // Optimistic update could be added here
      window.location.reload(); // Simple refresh for now to pull new reviews
    }
  }

  return (
    <div className="product-reviews-section">
      <h2 className="reviews-title">Customer Reviews</h2>
      
      <div className="reviews-layout">
        <div className="reviews-list">
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Be the first to share your experience!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author">
                    <strong>{review.customer_name}</strong>
                    {review.is_verified_purchase && (
                      <span className="verified-badge">✓ Verified Buyer</span>
                    )}
                  </div>
                  <div className="review-stars">
                    {'★'.repeat(review.rating)}
                    <span style={{ color: 'var(--silver-700)' }}>
                      {'★'.repeat(5 - review.rating)}
                    </span>
                  </div>
                </div>
                <p className="review-text">{review.review_text}</p>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="review-form-container">
          <h3>Write a Review</h3>
          {!user ? (
            <div className="review-login-prompt">
              <p>You must be signed in to write a review.</p>
              <a href="/login" className="outline-btn" style={{ display: 'inline-block', marginTop: '10px' }}>
                Sign In
              </a>
            </div>
          ) : hasReviewed ? (
            <div className="review-success">
              <p>Thank you for your review! You've already submitted feedback for this product.</p>
            </div>
          ) : (
            <form action={handleSubmit} className="review-form">
              <input type="hidden" name="productId" value={productId} />
              <input type="hidden" name="rating" value={rating} />
              
              {error && <div className="auth-error">{error}</div>}

              <div className="form-input-group">
                <label>Rating</label>
                <div className="star-selector">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-input-group" style={{ marginTop: '15px' }}>
                <label htmlFor="reviewText">Your Review</label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  className="contact-textarea-field"
                  rows={4}
                  required
                  placeholder="What did you like about this product?"
                ></textarea>
              </div>

              <ReviewSubmitBtn />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
