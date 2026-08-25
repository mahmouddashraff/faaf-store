'use client';

import React, { useState } from 'react';
import { saveAppConfigAction } from '../../actions/admin';

export default function HomepageTab({ config }: { config: any }) {
  const [formData, setFormData] = useState(config);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await saveAppConfigAction('homepage_config', formData);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Homepage Configuration</h2>
      
      <div className="admin-section" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="admin-form-group" style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px' }}>
            <h3>Hero Section</h3>
            
            <label style={{ display: 'block', marginBottom: '8px', marginTop: '16px' }}>Hero Pill Tag (e.g. #1 RATED SPORTS NUTRITION)</label>
            <input type="text" name="heroPill" value={formData.heroPill || ''} onChange={handleChange} className="contact-input-field" />

            <label style={{ display: 'block', marginBottom: '8px', marginTop: '16px' }}>Hero Main Title</label>
            <input type="text" name="heroTitle" value={formData.heroTitle || ''} onChange={handleChange} className="contact-input-field" required />

            <label style={{ display: 'block', marginBottom: '8px', marginTop: '16px' }}>Hero Subtitle / Description</label>
            <textarea name="heroSubtitle" value={formData.heroSubtitle || ''} onChange={handleChange} className="contact-input-field" rows={3} required />

            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Primary Button Text</label>
                <input type="text" name="heroButtonText" value={formData.heroButtonText || ''} onChange={handleChange} className="contact-input-field" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Primary Button Link</label>
                <input type="text" name="heroButtonLink" value={formData.heroButtonLink || ''} onChange={handleChange} className="contact-input-field" />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Secondary Button Text</label>
                <input type="text" name="heroButton2Text" value={formData.heroButton2Text || ''} onChange={handleChange} className="contact-input-field" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Secondary Button Link</label>
                <input type="text" name="heroButton2Link" value={formData.heroButton2Link || ''} onChange={handleChange} className="contact-input-field" />
              </div>
            </div>
          </div>

          <div className="admin-form-group" style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px' }}>
            <h3>Visibility Toggles</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" name="showBestSellers" checked={formData.showBestSellers !== false} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <span>Show Best Sellers Section</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" name="showWhyFaaf" checked={formData.showWhyFaaf !== false} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <span>Show "Why Choose FAAF" Section</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" name="showTestimonials" checked={formData.showTestimonials !== false} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <span>Show Testimonials Section</span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE HOMEPAGE CONFIG'}
            </button>
            {saved && <span style={{ color: 'var(--success-green, #4ade80)' }}>✓ Saved successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
