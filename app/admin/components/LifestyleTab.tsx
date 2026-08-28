'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function LifestyleTab() {
  const [pillars, setPillars] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Section toggle: 'pillars' or 'tips'
  const [activeSection, setActiveSection] = useState<'pillars' | 'tips'>('pillars');
  
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [pillarsRes, tipsRes] = await Promise.all([
      supabase.from('lifestyle_pillars').select('*').order('sort_order', { ascending: true }),
      supabase.from('lifestyle_tips').select('*').order('sort_order', { ascending: true })
    ]);
    
    if (pillarsRes.error) {
      console.error('Error fetching pillars:', pillarsRes.error);
      alert('Error fetching pillars: ' + pillarsRes.error.message);
    } else if (pillarsRes.data) {
      setPillars(pillarsRes.data);
    }
    
    if (tipsRes.error) {
      console.error('Error fetching tips:', tipsRes.error);
      alert('Error fetching tips: ' + tipsRes.error.message);
    } else if (tipsRes.data) {
      setTips(tipsRes.data);
    }
    
    setLoading(false);
  };

  const handleAdd = () => {
    if (activeSection === 'pillars') {
      setEditingItem({
        _type: 'pillar',
        title: '', description: '', icon_svg: '', bullets: [],
        link_text: '', link_url: '', css_class: '', price: 0, sort_order: 0
      });
    } else {
      setEditingItem({
        _type: 'tip',
        number_label: '01', badge: '', title: '', description: '', price: 0, sort_order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleEdit = (item: any, type: 'pillar' | 'tip') => {
    setEditingItem({ ...item, _type: type });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { _type, ...dataToSave } = editingItem;
    const table = _type === 'pillar' ? 'lifestyle_pillars' : 'lifestyle_tips';
    let res;

    if (dataToSave.id) {
      res = await supabase.from(table).update(dataToSave).eq('id', dataToSave.id);
    } else {
      res = await supabase.from(table).insert([dataToSave]);
    }
    
    if (res.error) {
      console.error(`Error saving ${_type}:`, res.error);
      alert(`Error saving ${_type}: ` + res.error.message);
      setLoading(false);
      return;
    }
    
    setIsModalOpen(false);
    fetchData();
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean, type: 'pillar' | 'tip') => {
    setLoading(true);
    const table = type === 'pillar' ? 'lifestyle_pillars' : 'lifestyle_tips';
    const { error } = await supabase.from(table).update({ is_archived: !currentArchived }).eq('id', id);
    if (error) {
      console.error(`Error archiving ${type}:`, error);
      alert('Error updating status: ' + error.message);
    }
    fetchData();
  };

  const handleDelete = async (id: string, type: 'pillar' | 'tip') => {
    if (confirm('Delete this item permanently?\n\nThis action cannot be undone. The item will be permanently removed.')) {
      setLoading(true);
      const table = type === 'pillar' ? 'lifestyle_pillars' : 'lifestyle_tips';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type}: ` + error.message);
      } else {
        alert(`${type === 'pillar' ? 'Lifestyle pillar' : 'Lifestyle tip'} deleted permanently.`);
      }
      fetchData();
    }
  };

  const handleArrayAdd = (field: string) => {
    const current = editingItem[field] || [];
    setEditingItem({ ...editingItem, [field]: [...current, ''] });
  };
  
  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = [...(editingItem[field] || [])];
    current[index] = value;
    setEditingItem({ ...editingItem, [field]: current });
  };
  
  const handleArrayRemove = (field: string, index: number) => {
    const current = [...(editingItem[field] || [])];
    current.splice(index, 1);
    setEditingItem({ ...editingItem, [field]: current });
  };

  const filteredPillars = pillars.filter(p => showArchived ? p.is_archived : !p.is_archived);
  const filteredTips = tips.filter(t => showArchived ? t.is_archived : !t.is_archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Lifestyle Content</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowArchived(!showArchived)} className="secondary-btn light">
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
          <button onClick={handleAdd} className="primary-btn">
            + Add {activeSection === 'pillars' ? 'Pillar' : 'Tip'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <button 
          className={`admin-tab-btn ${activeSection === 'pillars' ? 'active' : ''}`}
          onClick={() => setActiveSection('pillars')}
          style={{ background: 'none', border: 'none', color: activeSection === 'pillars' ? 'white' : '#888', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Lifestyle Pillars
        </button>
        <button 
          className={`admin-tab-btn ${activeSection === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveSection('tips')}
          style={{ background: 'none', border: 'none', color: activeSection === 'tips' ? 'white' : '#888', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Daily Routine Tips
        </button>
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
                {activeSection === 'pillars' ? <th>CSS Class</th> : <th>Number / Badge</th>}
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSection === 'pillars' ? (
                filteredPillars.map(item => (
                  <tr key={item.id}>
                    <td>{item.sort_order}</td>
                    <td><strong>{item.title}</strong></td>
                    <td>{item.css_class}</td>
                    <td>${item.price}</td>
                    <td>{item.is_archived ? <span style={{color:'red'}}>Archived</span> : <span style={{color:'green'}}>Active</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleEdit(item, 'pillar')} className="admin-action-btn">Edit</button>
                        <button onClick={() => handleToggleArchive(item.id, item.is_archived, 'pillar')} className="admin-action-btn">
                          {item.is_archived ? 'Restore' : 'Archive'}
                        </button>
                        <button onClick={() => handleDelete(item.id, 'pillar')} className="admin-action-btn" style={{color:'red', border:'1px solid red'}}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredTips.map(item => (
                  <tr key={item.id}>
                    <td>{item.sort_order}</td>
                    <td><strong>{item.title}</strong></td>
                    <td>{item.number_label} / {item.badge}</td>
                    <td>${item.price}</td>
                    <td>{item.is_archived ? <span style={{color:'red'}}>Archived</span> : <span style={{color:'green'}}>Active</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleEdit(item, 'tip')} className="admin-action-btn">Edit</button>
                        <button onClick={() => handleToggleArchive(item.id, item.is_archived, 'tip')} className="admin-action-btn">
                          {item.is_archived ? 'Restore' : 'Archive'}
                        </button>
                        <button onClick={() => handleDelete(item.id, 'tip')} className="admin-action-btn" style={{color:'red', border:'1px solid red'}}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {((activeSection === 'pillars' && filteredPillars.length === 0) || (activeSection === 'tips' && filteredTips.length === 0)) && (
                <tr><td colSpan={5} style={{textAlign:'center'}}>No items found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>{editingItem.id ? 'Edit' : 'Add'} {editingItem._type === 'pillar' ? 'Pillar' : 'Tip'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {editingItem._type === 'pillar' ? (
                <>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Title</label>
                      <input required type="text" className="contact-input-field" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>CSS Class (Color)</label>
                      <input required type="text" className="contact-input-field" value={editingItem.css_class} onChange={e => setEditingItem({...editingItem, css_class: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Price</label>
                      <input required type="number" step="0.01" className="contact-input-field" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                  <div>
                    <label>Description</label>
                    <textarea required className="contact-input-field" rows={3} value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </div>
                  <div>
                    <label>SVG Icon (Raw HTML)</label>
                    <textarea required className="contact-input-field" rows={3} value={editingItem.icon_svg} onChange={e => setEditingItem({...editingItem, icon_svg: e.target.value})} />
                  </div>
                  <div>
                    <label>Bullets</label>
                    {(editingItem.bullets || []).map((val: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input className="contact-input-field" value={val} onChange={e => handleArrayChange('bullets', idx, e.target.value)} />
                        <button type="button" onClick={() => handleArrayRemove('bullets', idx)} className="secondary-btn light">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleArrayAdd('bullets')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Bullet</button>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Link Text</label>
                      <input required type="text" className="contact-input-field" value={editingItem.link_text} onChange={e => setEditingItem({...editingItem, link_text: e.target.value})} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Link URL</label>
                      <input required type="text" className="contact-input-field" value={editingItem.link_url} onChange={e => setEditingItem({...editingItem, link_url: e.target.value})} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Number Label (e.g. 01)</label>
                      <input required type="text" className="contact-input-field" value={editingItem.number_label} onChange={e => setEditingItem({...editingItem, number_label: e.target.value})} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Badge</label>
                      <input required type="text" className="contact-input-field" value={editingItem.badge} onChange={e => setEditingItem({...editingItem, badge: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Price</label>
                      <input required type="number" step="0.01" className="contact-input-field" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                  <div>
                    <label>Title</label>
                    <input required type="text" className="contact-input-field" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  </div>
                  <div>
                    <label>Description</label>
                    <textarea required className="contact-input-field" rows={4} value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </div>
                </>
              )}

              <div>
                <label>Sort Order</label>
                <input required type="number" className="contact-input-field" value={editingItem.sort_order} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} />
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
