'use client';

import React, { useEffect, useState } from 'react';
import { getPromotionsAction, savePromotionAction, deletePromotionAction, Promotion } from '../../actions/promotions';

export default function PromotionsTab() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    const res = await getPromotionsAction();
    if (res.promotions) {
      setPromotions(res.promotions);
    }
    setLoading(false);
  };

  const handleAddRow = () => {
    const newPromo: Promotion = {
      id: `new_${Date.now()}`,
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPromotions([newPromo, ...promotions]);
  };

  const handleChange = (index: number, field: keyof Promotion, value: any) => {
    const updated = [...promotions];
    let val = value;
    
    if (field === 'code') {
      val = val.toUpperCase().replace(/\s+/g, '');
    }
    if (field === 'discount_value' && updated[index].discount_type === 'percentage') {
      if (val < 0) val = 0;
      if (val > 100) val = 100;
    }
    if (field === 'min_order_amount' && val < 0) {
      val = 0;
    }
    
    updated[index] = { ...updated[index], [field]: val };
    setPromotions(updated);
  };

  const handleSaveRow = async (index: number) => {
    const promo = promotions[index];
    if (!promo.code.trim()) {
      setError('Promo code is required');
      return;
    }

    setSaving(true);
    setError('');
    
    const res = await savePromotionAction(promo);
    if (res.error) {
      setError(res.error);
    } else if (res.promotion) {
      const updated = [...promotions];
      updated[index] = res.promotion;
      setPromotions(updated);
      alert('Saved successfully!');
    }
    
    setSaving(false);
  };

  const handleDeleteRow = async (index: number) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    
    const promo = promotions[index];
    if (promo.id.startsWith('new_')) {
      const updated = [...promotions];
      updated.splice(index, 1);
      setPromotions(updated);
      return;
    }

    setSaving(true);
    const res = await deletePromotionAction(promo.id);
    if (res.error) {
      setError(res.error);
    } else {
      const updated = [...promotions];
      updated.splice(index, 1);
      setPromotions(updated);
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading promotions...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Promotions & Coupons</h2>
        <button onClick={handleAddRow} className="primary-btn" disabled={saving}>
          + Add Promo
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: '20px' }}>{error}</div>}

      <div className="admin-settings-card">
        {promotions.length === 0 ? (
          <p style={{ color: 'var(--silver-500)', textAlign: 'center', padding: '20px' }}>
            No promotions found. Click "+ Add Promo" to create one.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>TYPE</th>
                  <th>VALUE</th>
                  <th>MIN ORDER</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo, index) => (
                  <tr key={promo.id}>
                    <td>
                      <input 
                        type="text" 
                        value={promo.code} 
                        placeholder="e.g. SUMMER20"
                        onChange={e => handleChange(index, 'code', e.target.value)}
                        className="contact-input-field"
                        style={{ padding: '8px', textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      <select 
                        value={promo.discount_type}
                        onChange={e => handleChange(index, 'discount_type', e.target.value)}
                        className="contact-select-field"
                        style={{ padding: '8px' }}
                      >
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        max={promo.discount_type === 'percentage' ? "100" : undefined}
                        value={promo.discount_value.toString()} 
                        onChange={e => handleChange(index, 'discount_value', parseFloat(e.target.value) || 0)}
                        className="contact-input-field"
                        style={{ width: '80px', padding: '8px' }}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={promo.min_order_amount.toString()} 
                        onChange={e => handleChange(index, 'min_order_amount', parseFloat(e.target.value) || 0)}
                        className="contact-input-field"
                        style={{ width: '100px', padding: '8px' }}
                      />
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={promo.active}
                        onChange={e => handleChange(index, 'active', e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleSaveRow(index)}
                          className="primary-btn"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          disabled={saving}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => handleDeleteRow(index)}
                          style={{ 
                            background: 'none', 
                            border: '1px solid #ff4d4d', 
                            color: '#ff4d4d', 
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
