'use client';

import React, { useState } from 'react';
import { saveAppConfigAction } from '../../actions/admin';

export default function SettingsTab({ config }: { config: any }) {
  const [formData, setFormData] = useState(config);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : 
                  e.target.type === 'checkbox' ? e.target.checked : 
                  e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await saveAppConfigAction('store_settings', formData);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Store Settings</h2>
      
      <div className="admin-section" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="admin-form-group">
            <label style={{ display: 'block', marginBottom: '8px' }}>Store Name</label>
            <input type="text" name="storeName" value={formData.storeName || ''} onChange={handleChange} className="contact-input-field" required />
          </div>

          <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Contact Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} className="contact-input-field" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Contact Phone</label>
              <input type="text" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} className="contact-input-field" required />
            </div>
          </div>

          <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Standard Shipping Fee ($)</label>
              <input type="number" step="0.01" name="shippingFee" value={formData.shippingFee || 0} onChange={handleChange} className="contact-input-field" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Free Shipping Threshold ($)</label>
              <input type="number" step="0.01" name="freeShippingThreshold" value={formData.freeShippingThreshold || 0} onChange={handleChange} className="contact-input-field" required />
            </div>
          </div>

          <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Instagram URL</label>
              <input type="url" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} className="contact-input-field" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Facebook URL</label>
              <input type="url" name="facebookUrl" value={formData.facebookUrl || ''} onChange={handleChange} className="contact-input-field" />
            </div>
          </div>

          <div className="admin-form-group" style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px' }}>
            <h3>Top Announcement Banner</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" name="showAnnouncement" checked={formData.showAnnouncement || false} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <span>Enable Announcement Banner</span>
            </label>
            
            <label style={{ display: 'block', marginBottom: '8px' }}>Banner Text</label>
            <input type="text" name="announcementText" value={formData.announcementText || ''} onChange={handleChange} className="contact-input-field" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE SETTINGS'}
            </button>
            {saved && <span style={{ color: 'var(--success-green, #4ade80)' }}>✓ Saved successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
