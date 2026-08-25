'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/products';
import { validateCouponAction } from '../app/actions/checkout';

export default function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    freeShippingRemaining,
    freeShippingProgress,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { appliedCoupon, discountAmount, grandTotal, setAppliedCoupon } = useCart();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  if (!isCartOpen) return null;

  const shippingCost = freeShippingRemaining === 0 ? 0 : 9.99;
  
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError('');
    const res = await validateCouponAction(promoInput.trim().toUpperCase());
    if (res.error) {
      setPromoError(res.error);
    } else if (res.coupon) {
      if (subtotal < res.coupon.min_order_amount) {
        setPromoError(`Minimum order of $${res.coupon.min_order_amount} required`);
      } else {
        setAppliedCoupon(res.coupon);
        setPromoInput('');
      }
    }
    setIsApplyingPromo(false);
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart} role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-title-wrap">
            <h2>YOUR BAG</h2>
            <span className="cart-count-pill">{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="close-btn" onClick={closeCart} aria-label="Close cart drawer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="free-shipping-tracker">
          <div className="tracker-text">
            {freeShippingRemaining === 0 ? (
              <span className="tracker-unlocked">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <strong>FREE Express Shipping</strong> Unlocked!
              </span>
            ) : (
              <span>
                Add <strong>{formatPrice(freeShippingRemaining)}</strong> more for <strong>FREE Express Shipping</strong>
              </span>
            )}
          </div>
          <div className="tracker-bar-bg">
            <div
              className={`tracker-bar-fill ${freeShippingRemaining === 0 ? 'complete' : ''}`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Order Complete Screen is now a separate page */}
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="cart-empty-state">
            <div className="empty-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h3>YOUR CART IS EMPTY</h3>
            <p>Looks like you haven&apos;t added any performance fuels to your routine yet.</p>
            <Link href="/shop" className="primary-btn" onClick={closeCart}>
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          /* Items List & Summary */
          <>
            <div className="cart-items-scroll">
              {items.map(item => (
                <div key={item.cartItemId} className="cart-item-row">
                  {/* Thumbnail / Art */}
                  <div className={`cart-item-thumb ${item.product.accent}`}>
                    <span>FAAF</span>
                  </div>

                  {/* Details */}
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        title="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>

                    <p className="cart-item-variant">
                      {item.variant.name} {item.flavor && `| Flavor: ${item.flavor}`}
                    </p>

                    <div className="cart-item-bottom">
                      <div className="cart-qty-stepper">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-price">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="cart-drawer-footer">
              <div className="cart-promo-section" style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!appliedCoupon ? (
                  <>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={promoInput} 
                        onChange={e => setPromoInput(e.target.value)} 
                        placeholder="Promo Code" 
                        className="contact-input-field"
                        style={{ padding: '8px', flex: 1, textTransform: 'uppercase' }}
                      />
                      <button 
                        onClick={handleApplyPromo} 
                        className="primary-btn" 
                        style={{ padding: '8px 16px', minWidth: '80px' }}
                        disabled={isApplyingPromo}
                      >
                        {isApplyingPromo ? '...' : 'APPLY'}
                      </button>
                    </div>
                    {promoError && <span style={{ color: '#ff4d4d', fontSize: '0.85rem' }}>{promoError}</span>}
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ color: 'var(--gold-500)' }}>{appliedCoupon.code}</strong> applied!
                    </div>
                    <button 
                      onClick={() => setAppliedCoupon(null)}
                      style={{ color: '#ff4d4d', background: 'none', border: 'none', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="summary-line">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              
              {appliedCoupon && (
                <div className="summary-line" style={{ color: 'var(--gold-500)' }}>
                  <span>Coupon ({appliedCoupon.code})</span>
                  <strong>-{formatPrice(discountAmount)}</strong>
                </div>
              )}
              <div className="summary-line">
                <span>Estimated Shipping</span>
                <span>{shippingCost === 0 ? <strong className="text-free">FREE</strong> : formatPrice(shippingCost)}</span>
              </div>
              <div className="summary-line total-line">
                <span>Total</span>
                <strong>{formatPrice(grandTotal)}</strong>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                PROCEED TO CHECKOUT • {formatPrice(grandTotal)}
              </button>

              <div className="cart-trust-badges">
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>⚡ Fast 2-Day Delivery</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
