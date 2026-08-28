'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ProgramsTab() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching programs:', error);
      alert('An error occurred. Please try again.');
    }
    if (data) setPrograms(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingProg({
      slug: '', title: '', tagline: '', duration: '', difficulty: '',
      goal: '', category: '', short_description: '', overview: '',
      target_audience: [], weekly_schedule: [], equipment_needed: [],
      rating: 5.0, reviews: 0, enrolled_count: 0, price: 0, sort_order: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prog: any) => {
    setEditingProg({ ...prog });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingProg.id) {
      res = await supabase.from('programs').update(editingProg).eq('id', editingProg.id);
    } else {
      res = await supabase.from('programs').insert([editingProg]);
    }
    
    if (res.error) {
      console.error('Error saving program:', res.error);
      alert('An error occurred while saving. Please check your inputs and try again.');
      setLoading(false);
      return;
    }
    
    setIsModalOpen(false);
    fetchPrograms();
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    setLoading(true);
    const { error } = await supabase.from('programs').update({ is_archived: !currentArchived }).eq('id', id);
    if (error) {
      console.error('Error archiving program:', error);
      alert('An error occurred. Please try again.');
    }
    fetchPrograms();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item permanently?\n\nThis action cannot be undone. The item will be permanently removed.')) {
      setLoading(true);
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) {
        console.error('Error deleting program:', error);
        alert('An error occurred. Please try again.');
      } else {
        alert('Program deleted permanently.');
      }
      fetchPrograms();
    }
  };

  const handleArrayAdd = (field: string) => {
    const current = editingProg[field] || [];
    setEditingProg({ ...editingProg, [field]: [...current, ''] });
  };
  
  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = [...(editingProg[field] || [])];
    current[index] = value;
    setEditingProg({ ...editingProg, [field]: current });
  };
  
  const handleArrayRemove = (field: string, index: number) => {
    const current = [...(editingProg[field] || [])];
    current.splice(index, 1);
    setEditingProg({ ...editingProg, [field]: current });
  };

  const handleDayAdd = () => {
    const schedule = editingProg.weekly_schedule || [];
    setEditingProg({ 
      ...editingProg, 
      weekly_schedule: [...schedule, { day: '', title: '', duration: '', focus: '' }] 
    });
  };

  const handleDayChange = (index: number, field: string, value: string) => {
    const schedule = [...(editingProg.weekly_schedule || [])];
    schedule[index] = { ...schedule[index], [field]: value };
    setEditingProg({ ...editingProg, weekly_schedule: schedule });
  };

  const handleDayRemove = (index: number) => {
    const schedule = [...(editingProg.weekly_schedule || [])];
    schedule.splice(index, 1);
    setEditingProg({ ...editingProg, weekly_schedule: schedule });
  };

  const filteredPrograms = programs.filter(p => showArchived ? p.is_archived : !p.is_archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Programs</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowArchived(!showArchived)} className="secondary-btn light">
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
          <button onClick={handleAdd} className="primary-btn">+ Add Program</button>
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
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map(prog => (
                <tr key={prog.id}>
                  <td>{prog.sort_order}</td>
                  <td><strong>{prog.title}</strong><br/><small>{prog.slug}</small></td>
                  <td>{prog.category}</td>
                  <td>{prog.is_archived ? <span style={{color:'red'}}>Archived</span> : <span style={{color:'green'}}>Active</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => handleEdit(prog)} className="admin-action-btn">Edit</button>
                      <button onClick={() => handleToggleArchive(prog.id, prog.is_archived)} className="admin-action-btn">
                        {prog.is_archived ? 'Restore' : 'Archive'}
                      </button>
                      <button onClick={() => handleDelete(prog.id)} className="admin-action-btn" style={{color:'red', border:'1px solid red'}}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPrograms.length === 0 && (
                <tr><td colSpan={5} style={{textAlign:'center'}}>No programs found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && editingProg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>{editingProg.id ? 'Edit Program' : 'Add Program'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label>Title</label>
                  <input required type="text" className="contact-input-field" value={editingProg.title} onChange={e => setEditingProg({...editingProg, title: e.target.value})} />
                </div>
                <div>
                  <label>Slug</label>
                  <input required type="text" className="contact-input-field" value={editingProg.slug} onChange={e => setEditingProg({...editingProg, slug: e.target.value})} />
                </div>
                <div>
                  <label>Tagline</label>
                  <input required type="text" className="contact-input-field" value={editingProg.tagline} onChange={e => setEditingProg({...editingProg, tagline: e.target.value})} />
                </div>
                <div>
                  <label>Category</label>
                  <select 
                    required 
                    className="modal-select-field" 
                    value={editingProg.category} 
                    onChange={e => setEditingProg({...editingProg, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Lifestyle Transformation">Lifestyle Transformation</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Beginner Fitness">Beginner Fitness</option>
                    <option value="Athletic Performance">Athletic Performance</option>
                  </select>
                </div>
                <div>
                  <label>Duration</label>
                  <input required type="text" className="contact-input-field" value={editingProg.duration} onChange={e => setEditingProg({...editingProg, duration: e.target.value})} />
                </div>
                <div>
                  <label>Difficulty</label>
                  <input required type="text" className="contact-input-field" value={editingProg.difficulty} onChange={e => setEditingProg({...editingProg, difficulty: e.target.value})} />
                </div>
                <div>
                  <label>Goal</label>
                  <input required type="text" className="contact-input-field" value={editingProg.goal} onChange={e => setEditingProg({...editingProg, goal: e.target.value})} />
                </div>
                <div>
                  <label>Price</label>
                  <input required type="number" step="0.01" className="contact-input-field" value={editingProg.price} onChange={e => setEditingProg({...editingProg, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label>Accent Color (Hex)</label>
                  <input required type="text" className="contact-input-field" value={editingProg.accent_color} onChange={e => setEditingProg({...editingProg, accent_color: e.target.value})} />
                </div>
                <div>
                  <label>Sort Order</label>
                  <input required type="number" className="contact-input-field" value={editingProg.sort_order} onChange={e => setEditingProg({...editingProg, sort_order: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label>Short Description</label>
                <textarea required className="contact-input-field" rows={2} value={editingProg.short_description} onChange={e => setEditingProg({...editingProg, short_description: e.target.value})} />
              </div>
              
              <div>
                <label>Overview</label>
                <textarea required className="contact-input-field" rows={4} value={editingProg.overview} onChange={e => setEditingProg({...editingProg, overview: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label>Target Audience</label>
                  {(editingProg.target_audience || []).map((val: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input className="contact-input-field" value={val} onChange={e => handleArrayChange('target_audience', idx, e.target.value)} />
                      <button type="button" onClick={() => handleArrayRemove('target_audience', idx)} className="secondary-btn light">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('target_audience')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Target</button>
                </div>
                <div>
                  <label>Equipment Needed</label>
                  {(editingProg.equipment_needed || []).map((val: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input className="contact-input-field" value={val} onChange={e => handleArrayChange('equipment_needed', idx, e.target.value)} />
                      <button type="button" onClick={() => handleArrayRemove('equipment_needed', idx)} className="secondary-btn light">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('equipment_needed')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Equipment</button>
                </div>
                <div>
                  <label>Key Benefits</label>
                  {(editingProg.key_benefits || []).map((val: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input className="contact-input-field" value={val} onChange={e => handleArrayChange('key_benefits', idx, e.target.value)} />
                      <button type="button" onClick={() => handleArrayRemove('key_benefits', idx)} className="secondary-btn light">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('key_benefits')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Benefit</button>
                </div>
                <div>
                  <label>Included Modules</label>
                  {(editingProg.included_modules || []).map((val: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input className="contact-input-field" value={val} onChange={e => handleArrayChange('included_modules', idx, e.target.value)} />
                      <button type="button" onClick={() => handleArrayRemove('included_modules', idx)} className="secondary-btn light">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('included_modules')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Module</button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #444', paddingTop: '20px', marginTop: '10px' }}>
                <label style={{ fontSize: '1.2rem', marginBottom: '15px', display: 'block' }}>Weekly Schedule (Days)</label>
                {(editingProg.weekly_schedule || []).map((dayObj: any, idx: number) => (
                  <div key={idx} style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong>Day {idx + 1}</strong>
                      <button type="button" onClick={() => handleDayRemove(idx)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove Day</button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label>Day Label (e.g. Day 1, Monday)</label>
                        <input className="contact-input-field" value={dayObj.day} onChange={e => handleDayChange(idx, 'day', e.target.value)} />
                      </div>
                      <div>
                        <label>Title (e.g. Push Day)</label>
                        <input className="contact-input-field" value={dayObj.title} onChange={e => handleDayChange(idx, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label>Duration (e.g. 60 min)</label>
                        <input className="contact-input-field" value={dayObj.duration} onChange={e => handleDayChange(idx, 'duration', e.target.value)} />
                      </div>
                      <div>
                        <label>Focus (e.g. Chest & Triceps)</label>
                        <input className="contact-input-field" value={dayObj.focus} onChange={e => handleDayChange(idx, 'focus', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={handleDayAdd} className="primary-btn" style={{ width: '100%' }}>+ Add Schedule Day</button>
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
