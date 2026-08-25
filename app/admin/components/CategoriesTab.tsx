'use client';

import React, { useState } from 'react';
import { saveAppConfigAction } from '../../actions/admin';

export default function CategoriesTab({ categories }: { categories: any[] }) {
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAdd = () => {
    setLocalCategories([
      ...localCategories,
      {
        id: `cat_${Date.now()}`,
        name: 'New Category',
        slug: 'new-category',
        isVisible: true,
        sortOrder: localCategories.length
      }
    ]);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...localCategories];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCategories(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...localCategories];
    updated.splice(index, 1);
    setLocalCategories(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    await saveAppConfigAction('categories', localCategories);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Categories Configuration</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ color: 'var(--success-green, #4ade80)' }}>✓ Saved</span>}
          <button onClick={handleAdd} className="secondary-btn light">+ Add Category</button>
          <button onClick={handleSave} className="primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Slug (URL)</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localCategories.map((cat, index) => (
              <tr key={cat.id || index}>
                <td>
                  <input 
                    type="number" 
                    value={cat.sortOrder} 
                    onChange={e => handleChange(index, 'sortOrder', parseInt(e.target.value) || 0)}
                    className="contact-input-field"
                    style={{ width: '80px', padding: '8px' }}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={cat.name} 
                    onChange={e => handleChange(index, 'name', e.target.value)}
                    className="contact-input-field"
                    style={{ padding: '8px' }}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={cat.slug} 
                    onChange={e => handleChange(index, 'slug', e.target.value)}
                    className="contact-input-field"
                    style={{ padding: '8px' }}
                  />
                </td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={cat.isVisible} 
                    onChange={e => handleChange(index, 'isVisible', e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                </td>
                <td>
                  <button 
                    onClick={() => handleRemove(index)} 
                    className="admin-action-btn"
                    style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,0,0,0.2)' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {localCategories.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No categories defined.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
