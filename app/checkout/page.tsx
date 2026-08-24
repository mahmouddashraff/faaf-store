'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import { submitCheckout } from '@/app/actions/checkout';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

function CheckoutSubmitBtn({ total }: { total: number }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="primary-btn full-width checkout-submit" disabled={pending}>
      {pending ? 'PROCESSING ORDER...' : `PLACE ORDER • ${formatPrice(total)}`}
    </button>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, freeShippingRemaining, clearCart, setExactQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Wait for hydration to access localStorage

  if (items.length === 0) {
    return (
      <main className="page-main checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>You need to add products to your cart before you can checkout.</p>
          <Link href="/shop" className="primary-btn">BACK TO SHOP</Link>
        </div>
      </main>
    );
  }

  const shippingCost = freeShippingRemaining === 0 ? 0 : 9.99;
  const grandTotal = subtotal + shippingCost;

  async function handleCheckout(formData: FormData) {
    setError(null);
    const res = await submitCheckout(formData);
    if (res?.error) {
      setError(res.error);
      
      // If it's an out-of-stock error, adjust the cart automatically
      if (res.outOfStockCartItemId && res.availableQuantity !== undefined) {
        setExactQuantity(res.outOfStockCartItemId, res.availableQuantity);
        alert(`${res.error}\n\nYour cart has been updated to the maximum available quantity.`);
      } else if (res.details) {
        alert("Server Error Details:\n" + JSON.stringify(res.details, null, 2));
      }
    } else {
      clearCart();
    }
  }

  return (
    <main className="page-main checkout-page">
      <div className="checkout-container">
        
        {/* Checkout Form */}
        <div className="checkout-form-section">
          <h1 className="checkout-title">Secure Checkout</h1>
          <p className="checkout-subtitle">Please enter your delivery details below.</p>

          <form action={handleCheckout} className="checkout-form">
            <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
            <input type="hidden" name="cartSubtotal" value={subtotal} />
            <input type="hidden" name="deliveryFee" value={shippingCost} />
            <input type="hidden" name="total" value={grandTotal} />

            {error && (
              <div className="auth-error" style={{ marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <div className="form-section-title">Contact Information</div>
            <div className="form-row">
              <div className="form-input-group">
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" className="contact-input-field" required />
              </div>
              <div className="form-input-group">
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" className="contact-input-field" required />
              </div>
            </div>
            
            <div className="form-row" style={{ marginTop: '15px' }}>
              <div className="form-input-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" className="contact-input-field" required />
              </div>
              <div className="form-input-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" className="contact-input-field" required />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: '40px' }}>Delivery Address</div>
            
            <div className="form-row">
              <div className="form-input-group">
                <label htmlFor="country">Country *</label>
                <select id="country" name="country" className="contact-input-field" required defaultValue="United Arab Emirates">
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Oman">Oman</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Kuwait">Kuwait</option>
                </select>
              </div>
              <div className="form-input-group">
                <label htmlFor="city">City / Emirate *</label>
                <input type="text" id="city" name="city" className="contact-input-field" required />
              </div>
            </div>

            <div className="form-input-group" style={{ marginTop: '15px' }}>
              <label htmlFor="address">Full Address *</label>
              <input type="text" id="address" name="address" className="contact-input-field" placeholder="Street name, Area" required />
            </div>

            <div className="form-input-group" style={{ marginTop: '15px' }}>
              <label htmlFor="apartment">Apartment / Building / Unit (Optional)</label>
              <input type="text" id="apartment" name="apartment" className="contact-input-field" />
            </div>

            <div className="form-input-group" style={{ marginTop: '15px' }}>
              <label htmlFor="notes">Delivery Notes (Optional)</label>
              <textarea id="notes" name="notes" className="contact-textarea-field" rows={3} placeholder="Any special instructions for the driver?"></textarea>
            </div>

            <div className="form-section-title" style={{ marginTop: '40px' }}>Payment Method</div>
            <div className="payment-method-box">
              <div className="payment-radio-wrap">
                <input type="radio" id="cod" name="paymentMethod" value="cod" defaultChecked />
                <label htmlFor="cod">
                  <strong>Cash on Delivery (COD)</strong>
                  <span>Pay when your order arrives at your door.</span>
                </label>
              </div>
            </div>

            <div className="checkout-submit-wrap">
              <CheckoutSubmitBtn total={grandTotal} />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.cartItemId} className="summary-item-row">
                  <div className="summary-item-thumb">
                    FAAF
                  </div>
                  <div className="summary-item-info">
                    <h4>{item.product.name}</h4>
                    <span className="summary-item-variant">{item.variant.name}</span>
                    <span className="summary-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <div className="summary-item-price">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="summary-line">
                <span>Delivery Fee</span>
                <span>{shippingCost === 0 ? <strong style={{color: 'var(--gold-400)'}}>FREE</strong> : formatPrice(shippingCost)}</span>
              </div>
              <div className="summary-line total-line">
                <span>Total to pay</span>
                <strong className="grand-total">{formatPrice(grandTotal)}</strong>
              </div>
              <div className="payment-notice">
                * Amount will be collected upon delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
