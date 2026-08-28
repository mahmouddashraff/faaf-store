'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function WorkoutPlansTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching plans:', error);
      alert('Error fetching workout plans: ' + error.message);
    }
    if (data) setPlans(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingPlan({
      slug: '', title: '', level: 'Beginner', duration: '4 Weeks', days_per_week: 3,
      goal: 'Fat Loss', category: 'Strength', equipment: 'Full Gym', price: 0, description: '',
      highlights: [], recommended_supplements: [], badge: '', sort_order: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan({ ...plan });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingPlan.id) {
      res = await supabase.from('workout_plans').update(editingPlan).eq('id', editingPlan.id);
    } else {
      res = await supabase.from('workout_plans').insert([editingPlan]);
    }
    
    if (res.error) {
      console.error('Error saving plan:', res.error);
      alert('Error saving workout plan: ' + res.error.message);
      setLoading(false);
      return;
    }
    
    setIsModalOpen(false);
    fetchPlans();
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    setLoading(true);
    const { error } = await supabase.from('workout_plans').update({ is_archived: !currentArchived }).eq('id', id);
    if (error) {
      console.error('Error archiving plan:', error);
      alert('Error updating status: ' + error.message);
    }
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item permanently?\n\nThis action cannot be undone. The item will be permanently removed.')) {
      setLoading(true);
      const { error } = await supabase.from('workout_plans').delete().eq('id', id);
      if (error) {
        console.error('Error deleting plan:', error);
        alert('Error deleting plan: ' + error.message);
      } else {
        alert('Workout plan deleted permanently.');
      }
      fetchPlans();
    }
  };

  const handleArrayAdd = (field: string) => {
    const current = editingPlan[field] || [];
    setEditingPlan({ ...editingPlan, [field]: [...current, ''] });
  };
  
  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = [...(editingPlan[field] || [])];
    current[index] = value;
    setEditingPlan({ ...editingPlan, [field]: current });
  };
  
  const handleArrayRemove = (field: string, index: number) => {
    const current = [...(editingPlan[field] || [])];
    current.splice(index, 1);
    setEditingPlan({ ...editingPlan, [field]: current });
  };

  const filteredPlans = plans.filter(p => showArchived ? p.is_archived : !p.is_archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Workout Plans</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowArchived(!showArchived)} className="secondary-btn light">
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
          <button onClick={handleAdd} className="primary-btn">+ Add Plan</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.sort_order}</td>
                  <td><strong>{plan.title}</strong><br/><small>{plan.slug}</small></td>
                  <td>{plan.level}</td>
                  <td>{plan.duration}</td>
                  <td>{plan.is_archived ? <span style={{color:'red'}}>Archived</span> : <span style={{color:'green'}}>Active</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => handleEdit(plan)} className="admin-action-btn">Edit</button>
                      <button onClick={() => handleToggleArchive(plan.id, plan.is_archived)} className="admin-action-btn">
                        {plan.is_archived ? 'Restore' : 'Archive'}
                      </button>
                      <button onClick={() => handleDelete(plan.id)} className="admin-action-btn" style={{color:'red', border:'1px solid red'}}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr><td colSpan={6} style={{textAlign:'center'}}>No plans found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && editingPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>{editingPlan.id ? 'Edit Plan' : 'Add Plan'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Title</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.title} onChange={e => setEditingPlan({...editingPlan, title: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Slug</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.slug} onChange={e => setEditingPlan({...editingPlan, slug: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Level</label>
                  <select 
                    required 
                    className="modal-select-field" 
                    value={editingPlan.level} 
                    onChange={e => setEditingPlan({...editingPlan, level: e.target.value})}
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Duration</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.duration} onChange={e => setEditingPlan({...editingPlan, duration: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Days/Week</label>
                  <input required type="number" className="contact-input-field" value={editingPlan.days_per_week} onChange={e => setEditingPlan({...editingPlan, days_per_week: parseInt(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Category</label>
                  <select 
                    required 
                    className="modal-select-field" 
                    value={editingPlan.category} 
                    onChange={e => setEditingPlan({...editingPlan, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Strength & Hypertrophy">Strength & Hypertrophy</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Home / No Gym">Home / No Gym</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Goal</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.goal} onChange={e => setEditingPlan({...editingPlan, goal: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Equipment</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.equipment} onChange={e => setEditingPlan({...editingPlan, equipment: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Price</label>
                  <input required type="number" step="0.01" className="contact-input-field" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div>
                <label>Description</label>
                <textarea required className="contact-input-field" rows={3} value={editingPlan.description} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} />
              </div>

              <div>
                <label>Highlights</label>
                {(editingPlan.highlights || []).map((val: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input className="contact-input-field" value={val} onChange={e => handleArrayChange('highlights', idx, e.target.value)} />
                    <button type="button" onClick={() => handleArrayRemove('highlights', idx)} className="secondary-btn light">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => handleArrayAdd('highlights')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Highlight</button>
              </div>

              <div>
                <label>Supplements</label>
                {(editingPlan.recommended_supplements || []).map((val: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input className="contact-input-field" value={val} onChange={e => handleArrayChange('recommended_supplements', idx, e.target.value)} />
                    <button type="button" onClick={() => handleArrayRemove('recommended_supplements', idx)} className="secondary-btn light">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => handleArrayAdd('recommended_supplements')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Supplement</button>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Badge</label>
                  <input type="text" className="contact-input-field" value={editingPlan.badge || ''} onChange={e => setEditingPlan({...editingPlan, badge: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Sort Order</label>
                  <input required type="number" className="contact-input-field" value={editingPlan.sort_order} onChange={e => setEditingPlan({...editingPlan, sort_order: parseInt(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-btn light" disabled={loading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
