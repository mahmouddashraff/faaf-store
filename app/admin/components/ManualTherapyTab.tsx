'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ManualTherapyTab() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('manual_therapy')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
      alert('An error occurred. Please try again.');
    }
    if (data) setServices(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingService({
      name: '', tag: '', icon: '🏃‍♂️', duration: '60 Minutes', price: 0,
      short_description: '', focus_areas: [], best_for: '', sort_order: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: any) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingService.id) {
      res = await supabase.from('manual_therapy').update(editingService).eq('id', editingService.id);
    } else {
      res = await supabase.from('manual_therapy').insert([editingService]);
    }
    
    if (res.error) {
      console.error('Error saving service:', res.error);
      alert('An error occurred while saving. Please check your inputs and try again.');
      setLoading(false);
      return;
    }
    
    setIsModalOpen(false);
    fetchServices();
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    setLoading(true);
    const { error } = await supabase.from('manual_therapy').update({ is_archived: !currentArchived }).eq('id', id);
    if (error) {
      console.error('Error archiving service:', error);
      alert('An error occurred. Please try again.');
    }
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item permanently?\n\nThis action cannot be undone. The item will be permanently removed.')) {
      setLoading(true);
      const { error } = await supabase.from('manual_therapy').delete().eq('id', id);
      if (error) {
        console.error('Error deleting service:', error);
        alert('An error occurred. Please try again.');
      } else {
        alert('Manual therapy service deleted permanently.');
      }
      fetchServices();
    }
  };

  const handleArrayAdd = (field: string) => {
    const current = editingService[field] || [];
    setEditingService({ ...editingService, [field]: [...current, ''] });
  };
  
  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = [...(editingService[field] || [])];
    current[index] = value;
    setEditingService({ ...editingService, [field]: current });
  };
  
  const handleArrayRemove = (field: string, index: number) => {
    const current = [...(editingService[field] || [])];
    current.splice(index, 1);
    setEditingService({ ...editingService, [field]: current });
  };

  const filteredServices = services.filter(s => showArchived ? s.is_archived : !s.is_archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Manual Therapy Services</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowArchived(!showArchived)} className="secondary-btn light">
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
          <button onClick={handleAdd} className="primary-btn">+ Add Service</button>
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
                <th>Icon</th>
                <th>Name</th>
                <th>Tag</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr key={service.id}>
                  <td>{service.sort_order}</td>
                  <td style={{ fontSize: '24px' }}>{service.icon}</td>
                  <td><strong>{service.name}</strong></td>
                  <td>{service.tag}</td>
                  <td>${service.price}</td>
                  <td>{service.duration}</td>
                  <td>{service.is_archived ? <span style={{color:'red'}}>Archived</span> : <span style={{color:'green'}}>Active</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => handleEdit(service)} className="admin-action-btn">Edit</button>
                      <button onClick={() => handleToggleArchive(service.id, service.is_archived)} className="admin-action-btn">
                        {service.is_archived ? 'Restore' : 'Archive'}
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="admin-action-btn" style={{color:'red', border:'1px solid red'}}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr><td colSpan={7} style={{textAlign:'center'}}>No services found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && editingService && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>{editingService.id ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Name</label>
                  <input required type="text" className="contact-input-field" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} />
                </div>
                <div>
                  <label>Tag</label>
                  <input required type="text" className="contact-input-field" value={editingService.tag} onChange={e => setEditingService({...editingService, tag: e.target.value})} />
                </div>
                <div>
                  <label>Icon (Emoji)</label>
                  <input required type="text" className="contact-input-field" value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} />
                </div>
                <div>
                  <label>Duration</label>
                  <input required type="text" className="contact-input-field" value={editingService.duration} onChange={e => setEditingService({...editingService, duration: e.target.value})} />
                </div>
                <div>
                  <label>Price</label>
                  <input required type="number" step="0.01" className="contact-input-field" value={editingService.price} onChange={e => setEditingService({...editingService, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label>Sort Order</label>
                  <input required type="number" className="contact-input-field" value={editingService.sort_order} onChange={e => setEditingService({...editingService, sort_order: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label>Short Description</label>
                <textarea required className="contact-input-field" rows={3} value={editingService.short_description} onChange={e => setEditingService({...editingService, short_description: e.target.value})} />
              </div>

              <div>
                <label>Best For</label>
                <textarea required className="contact-input-field" rows={2} value={editingService.best_for} onChange={e => setEditingService({...editingService, best_for: e.target.value})} />
              </div>

              <div>
                <label>Focus Areas</label>
                {(editingService.focus_areas || []).map((val: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input className="contact-input-field" value={val} onChange={e => handleArrayChange('focus_areas', idx, e.target.value)} />
                    <button type="button" onClick={() => handleArrayRemove('focus_areas', idx)} className="secondary-btn light">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => handleArrayAdd('focus_areas')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Focus Area</button>
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
