'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function MealPlansTab() {
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching meal plans:', error);
      alert('Error fetching meal plans: ' + error.message);
    }
    if (data) setMealPlans(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingPlan({
      slug: '', title: '', goal: '', category: '', price: 0, daily_calories: 2000,
      macros: { protein: '30%', carbs: '40%', fats: '30%' }, meals_per_day: 3,
      duration: '4 Weeks', short_description: '', description: '',
      highlights: [], sample_meals: [], badge: '', dietary_tags: [], sort_order: 0
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
      res = await supabase.from('meal_plans').update(editingPlan).eq('id', editingPlan.id);
    } else {
      res = await supabase.from('meal_plans').insert([editingPlan]);
    }
    
    if (res.error) {
      console.error('Error saving meal plan:', res.error);
      alert('Error saving meal plan: ' + res.error.message);
      setLoading(false);
      return;
    }
    
    setIsModalOpen(false);
    fetchMealPlans();
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    setLoading(true);
    const { error } = await supabase.from('meal_plans').update({ is_archived: !currentArchived }).eq('id', id);
    if (error) {
      console.error('Error archiving meal plan:', error);
      alert('Error updating status: ' + error.message);
    }
    fetchMealPlans();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item permanently?\n\nThis action cannot be undone. The item will be permanently removed.')) {
      setLoading(true);
      const { error } = await supabase.from('meal_plans').delete().eq('id', id);
      if (error) {
        console.error('Error deleting meal plan:', error);
        alert('Error deleting meal plan: ' + error.message);
      } else {
        alert('Meal plan deleted permanently.');
      }
      fetchMealPlans();
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

  const handleMealAdd = () => {
    const meals = editingPlan.sample_meals || [];
    setEditingPlan({ 
      ...editingPlan, 
      sample_meals: [...meals, { name: '', time: '', calories: 0, macros: { protein: 0, carbs: 0, fats: 0 }, items: [] }] 
    });
  };

  const handleMealChange = (index: number, field: string, value: any) => {
    const meals = [...(editingPlan.sample_meals || [])];
    meals[index] = { ...meals[index], [field]: value };
    setEditingPlan({ ...editingPlan, sample_meals: meals });
  };

  const handleMealMacroChange = (index: number, macro: string, value: number) => {
    const meals = [...(editingPlan.sample_meals || [])];
    meals[index].macros = { ...meals[index].macros, [macro]: value };
    setEditingPlan({ ...editingPlan, sample_meals: meals });
  };

  const handleMealRemove = (index: number) => {
    const meals = [...(editingPlan.sample_meals || [])];
    meals.splice(index, 1);
    setEditingPlan({ ...editingPlan, sample_meals: meals });
  };

  const handleMealFoodAdd = (mealIndex: number) => {
    const meals = [...(editingPlan.sample_meals || [])];
    meals[mealIndex].items = [...(meals[mealIndex].items || []), ''];
    setEditingPlan({ ...editingPlan, sample_meals: meals });
  };

  const handleMealFoodChange = (mealIndex: number, foodIndex: number, value: string) => {
    const meals = [...(editingPlan.sample_meals || [])];
    meals[mealIndex].items[foodIndex] = value;
    setEditingPlan({ ...editingPlan, sample_meals: meals });
  };

  const handleMealFoodRemove = (mealIndex: number, foodIndex: number) => {
    const meals = [...(editingPlan.sample_meals || [])];
    meals[mealIndex].items.splice(foodIndex, 1);
    setEditingPlan({ ...editingPlan, sample_meals: meals });
  };

  const filteredPlans = mealPlans.filter(p => showArchived ? p.is_archived : !p.is_archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Meal Plans</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowArchived(!showArchived)} className="secondary-btn light">
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
          <button onClick={handleAdd} className="primary-btn">+ Add Meal Plan</button>
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
                <th>Calories</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.sort_order}</td>
                  <td><strong>{plan.title}</strong><br/><small>{plan.slug}</small></td>
                  <td>{plan.category}</td>
                  <td>{plan.daily_calories}</td>
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
                <tr><td colSpan={6} style={{textAlign:'center'}}>No meal plans found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && editingPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>{editingPlan.id ? 'Edit Meal Plan' : 'Add Meal Plan'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label>Title</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.title} onChange={e => setEditingPlan({...editingPlan, title: e.target.value})} />
                </div>
                <div>
                  <label>Slug</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.slug} onChange={e => setEditingPlan({...editingPlan, slug: e.target.value})} />
                </div>
                <div>
                  <label>Goal</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.goal} onChange={e => setEditingPlan({...editingPlan, goal: e.target.value})} />
                </div>
                <div>
                  <label>Category</label>
                  <select 
                    required 
                    className="modal-select-field" 
                    value={editingPlan.category} 
                    onChange={e => setEditingPlan({...editingPlan, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="High Protein">High Protein</option>
                    <option value="Balanced Nutrition">Balanced Nutrition</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>
                <div>
                  <label>Price</label>
                  <input required type="number" step="0.01" className="contact-input-field" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label>Daily Calories</label>
                  <input required type="number" className="contact-input-field" value={editingPlan.daily_calories} onChange={e => setEditingPlan({...editingPlan, daily_calories: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label>Meals Per Day</label>
                  <input required type="number" className="contact-input-field" value={editingPlan.meals_per_day} onChange={e => setEditingPlan({...editingPlan, meals_per_day: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label>Duration</label>
                  <input required type="text" className="contact-input-field" value={editingPlan.duration} onChange={e => setEditingPlan({...editingPlan, duration: e.target.value})} />
                </div>
                <div>
                  <label>Badge</label>
                  <input type="text" className="contact-input-field" value={editingPlan.badge || ''} onChange={e => setEditingPlan({...editingPlan, badge: e.target.value})} />
                </div>
                <div>
                  <label>Sort Order</label>
                  <input required type="number" className="contact-input-field" value={editingPlan.sort_order} onChange={e => setEditingPlan({...editingPlan, sort_order: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label>Short Description</label>
                <textarea required className="contact-input-field" rows={2} value={editingPlan.short_description} onChange={e => setEditingPlan({...editingPlan, short_description: e.target.value})} />
              </div>
              
              <div>
                <label>Description</label>
                <textarea required className="contact-input-field" rows={4} value={editingPlan.description} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Highlights</label>
                  {(editingPlan.highlights || []).map((val: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input className="contact-input-field" value={val} onChange={e => handleArrayChange('highlights', idx, e.target.value)} />
                      <button type="button" onClick={() => handleArrayRemove('highlights', idx)} className="secondary-btn light">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('highlights')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Highlight</button>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Dietary Tags</label>
                  {(editingPlan.dietary_tags || []).map((val: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input className="contact-input-field" value={val} onChange={e => handleArrayChange('dietary_tags', idx, e.target.value)} />
                      <button type="button" onClick={() => handleArrayRemove('dietary_tags', idx)} className="secondary-btn light">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('dietary_tags')} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Tag</button>
                </div>
              </div>

              <div>
                <label>Overall Plan Macros</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Protein</label>
                    <input type="text" className="contact-input-field" value={editingPlan.macros?.protein || ''} onChange={e => setEditingPlan({...editingPlan, macros: {...editingPlan.macros, protein: e.target.value}})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Carbs</label>
                    <input type="text" className="contact-input-field" value={editingPlan.macros?.carbs || ''} onChange={e => setEditingPlan({...editingPlan, macros: {...editingPlan.macros, carbs: e.target.value}})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Fats</label>
                    <input type="text" className="contact-input-field" value={editingPlan.macros?.fats || ''} onChange={e => setEditingPlan({...editingPlan, macros: {...editingPlan.macros, fats: e.target.value}})} />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #444', paddingTop: '20px', marginTop: '10px' }}>
                <label style={{ fontSize: '1.2rem', marginBottom: '15px', display: 'block' }}>Sample Meals</label>
                {(editingPlan.sample_meals || []).map((meal: any, idx: number) => (
                  <div key={idx} style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong>Meal {idx + 1}</strong>
                      <button type="button" onClick={() => handleMealRemove(idx)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove Meal</button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label>Name</label>
                        <input className="contact-input-field" value={meal.name} onChange={e => handleMealChange(idx, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label>Time</label>
                        <input className="contact-input-field" value={meal.time} onChange={e => handleMealChange(idx, 'time', e.target.value)} />
                      </div>
                      <div>
                        <label>Calories</label>
                        <input type="number" className="contact-input-field" value={meal.calories} onChange={e => handleMealChange(idx, 'calories', parseInt(e.target.value))} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                      <div>
                        <label>Protein (g)</label>
                        <input type="number" className="contact-input-field" value={meal.macros?.protein || 0} onChange={e => handleMealMacroChange(idx, 'protein', parseInt(e.target.value))} />
                      </div>
                      <div>
                        <label>Carbs (g)</label>
                        <input type="number" className="contact-input-field" value={meal.macros?.carbs || 0} onChange={e => handleMealMacroChange(idx, 'carbs', parseInt(e.target.value))} />
                      </div>
                      <div>
                        <label>Fats (g)</label>
                        <input type="number" className="contact-input-field" value={meal.macros?.fats || 0} onChange={e => handleMealMacroChange(idx, 'fats', parseInt(e.target.value))} />
                      </div>
                    </div>

                    <label style={{ fontSize: '0.9rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Foods / Items</label>
                    {(meal.items || []).map((food: string, fIdx: number) => (
                      <div key={fIdx} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                        <input className="contact-input-field" value={food} onChange={e => handleMealFoodChange(idx, fIdx, e.target.value)} />
                        <button type="button" onClick={() => handleMealFoodRemove(idx, fIdx)} className="secondary-btn light" style={{ padding: '5px 10px' }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleMealFoodAdd(idx)} className="secondary-btn light" style={{ marginTop: '5px' }}>+ Add Food</button>
                  </div>
                ))}
                <button type="button" onClick={handleMealAdd} className="primary-btn" style={{ width: '100%' }}>+ Add Sample Meal</button>
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
