'use client';

import React, { useState } from 'react';
import { saveProductAction, archiveProductAction, restoreProductAction, permanentlyDeleteProductAction, toggleProductFlagAction, updateStockAction } from '../../actions/admin';

export default function ProductsTab({ products }: { products: any[] }) {
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null); // null = list, {} = new, {...} = edit
  const [isSaving, setIsSaving] = useState(false);

  // Local state for stock inputs to avoid jumping
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  React.useEffect(() => {
    setImagePreview(null);
  }, [editingProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'active' ? !p.is_archived : p.is_archived;
    return matchesSearch && matchesTab;
  });

  const handleToggleFlag = async (productId: string, flag: 'is_visible' | 'is_featured', currentValue: boolean) => {
    await toggleProductFlagAction(productId, flag, currentValue);
  };

  const handleStockUpdate = async (variantId: string) => {
    const val = parseInt(stockInputs[variantId] || '0');
    if (!isNaN(val)) {
      await updateStockAction(variantId, val);
      alert('Stock updated');
    }
  };

  const handleArchive = async (productId: string) => {
    if (window.confirm('Archive this product? It will be hidden from the storefront but can be restored later.')) {
      await archiveProductAction(productId);
    }
  };

  const handleRestore = async (productId: string) => {
    if (window.confirm('Restore this product? It will become available on the storefront again.')) {
      await restoreProductAction(productId);
    }
  };

  const handleDeletePermanently = async (productId: string) => {
    if (window.confirm('PERMANENTLY DELETE this product? This action cannot be undone.')) {
      await permanentlyDeleteProductAction(productId);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const fd = new FormData(e.currentTarget);
    
    // Add implicit fields that the server action expects
    if (editingProduct.id) {
      fd.append('id', editingProduct.id);
      fd.append('isNew', 'false');
    } else {
      fd.append('isNew', 'true');
    }

    // Default nutrition if empty
    if (!fd.get('nutrition_highlights')) {
      fd.append('nutrition_highlights', JSON.stringify(["27g Protein", "Zero Sugar"]));
    }

    try {
      await saveProductAction(fd);
      setEditingProduct(null); // close modal on success
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (editingProduct) {
    const isNew = !editingProduct.id;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{isNew ? 'Create New Product' : `Edit ${editingProduct.name}`}</h2>
          <button onClick={() => setEditingProduct(null)} className="secondary-btn light">← Back to List</button>
        </div>

        <div className="admin-section" style={{ maxWidth: '900px' }}>
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Product Name *</label>
                <input type="text" name="name" defaultValue={editingProduct.name} className="contact-input-field" required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Category *</label>
                <input type="text" name="category" defaultValue={editingProduct.category} className="contact-input-field" required />
              </div>
            </div>

            <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Price ($) *</label>
                <input type="number" step="0.01" name="price" defaultValue={editingProduct.price} className="contact-input-field" required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Original/Compare Price ($)</label>
                <input type="number" step="0.01" name="original_price" defaultValue={editingProduct.original_price} className="contact-input-field" />
              </div>
            </div>

            <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Product Image {isNew && '*'}</label>
                <input 
                  type="file" 
                  name="imageFile" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="contact-input-field" 
                  style={{ padding: '8px', cursor: 'pointer' }}
                  required={isNew}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(imagePreview || editingProduct.image) && (
                  <img 
                    src={imagePreview || editingProduct.image} 
                    alt="Preview" 
                    style={{ maxHeight: '100px', borderRadius: '4px', objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>

            <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Tag (e.g. BESTSELLER, NEW)</label>
                <input type="text" name="tag" defaultValue={editingProduct.tag} className="contact-input-field" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Accent Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="color" name="accent" defaultValue={editingProduct.accent || '#dfb76c'} style={{ height: '44px', width: '60px', padding: '0', cursor: 'pointer', border: 'none', background: 'transparent' }} required />
                  <select name="accent_preset" className="contact-input-field" style={{ flex: 1 }} onChange={(e) => {
                    const colorInput = e.target.previousElementSibling as HTMLInputElement;
                    if (e.target.value) { colorInput.value = e.target.value; }
                  }}>
                    <option value="">Custom...</option>
                    <option value="#dfb76c">Gold (FAAF)</option>
                    <option value="#ff4d4d">Red</option>
                    <option value="#4da6ff">Blue</option>
                    <option value="#4dff4d">Green</option>
                    <option value="#9933ff">Purple</option>
                    <option value="#ffffff">White</option>
                    <option value="#000000">Black</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'block', marginBottom: '8px' }}>Flavors (comma separated)</label>
              <input 
                type="text" 
                name="flavors" 
                defaultValue={editingProduct.flavors?.join(', ') || ''} 
                className="contact-input-field" 
                placeholder="e.g. Chocolate, Vanilla, Strawberry" 
              />
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'block', marginBottom: '8px' }}>Short Description *</label>
              <input type="text" name="short_description" defaultValue={editingProduct.short_description} className="contact-input-field" required />
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'block', marginBottom: '8px' }}>Full Description *</label>
              <textarea name="description" defaultValue={editingProduct.description} className="contact-input-field" rows={5} required />
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'block', marginBottom: '8px' }}>Nutrition Highlights (JSON Array of strings)</label>
              <textarea 
                name="nutrition_highlights" 
                defaultValue={JSON.stringify(editingProduct.nutrition_highlights || ["27g Protein", "Zero Sugar"], null, 2)} 
                className="contact-input-field" 
                rows={4} 
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div className="admin-form-group" style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px' }}>
              <h3>Visibility Options</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
                <input type="checkbox" name="is_visible" defaultChecked={editingProduct.id ? editingProduct.is_visible : true} style={{ width: '20px', height: '20px' }} />
                <span>Product is Visible on Storefront</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
                <input type="checkbox" name="is_featured" defaultChecked={editingProduct.is_featured} style={{ width: '20px', height: '20px' }} />
                <span>Feature Product on Homepage</span>
              </label>
              
              <label style={{ display: 'block', marginBottom: '8px' }}>Special Badge (Optional)</label>
              <input type="text" name="badge" defaultValue={editingProduct.badge} className="contact-input-field" />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <button type="submit" className="primary-btn" disabled={isSaving}>
                {isSaving ? 'SAVING...' : (isNew ? 'CREATE PRODUCT' : 'SAVE CHANGES')}
              </button>
              <button type="button" onClick={() => setEditingProduct(null)} className="secondary-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Inventory & Products</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="search" 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="contact-input-field"
            style={{ width: '250px' }}
          />
          <button onClick={() => setEditingProduct({})} className="primary-btn">+ Add Product</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('active')} 
          className={`secondary-btn ${activeTab === 'active' ? 'light' : ''}`}
        >
          Active Products
        </button>
        <button 
          onClick={() => setActiveTab('archived')} 
          className={`secondary-btn ${activeTab === 'archived' ? 'light' : ''}`}
        >
          Archived Products
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Actions</th>
              <th>Visibility</th>
              <th>Featured</th>
              <th>Variant</th>
              <th>Stock</th>
              <th>Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const variants = product.product_variants || [];
              const variantCount = Math.max(1, variants.length);
              
              return variants.map((variant: any, index: number) => (
                <tr key={`${product.id}-${variant.id}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={variantCount} style={{ verticalAlign: 'top', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        <strong>{product.name}</strong><br/>
                        <small style={{ color: 'var(--silver-500)' }}>{product.category}</small>
                      </td>
                      <td rowSpan={variantCount} style={{ verticalAlign: 'top', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {!product.is_archived ? (
                            <>
                              <button onClick={() => setEditingProduct(product)} className="admin-action-btn secondary-btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                Edit
                              </button>
                              <button onClick={() => handleArchive(product.id)} className="admin-action-btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(255,165,0,0.1)', color: '#ffa500', border: 'none' }}>
                                Archive
                              </button>
                              <button onClick={() => handleDeletePermanently(product.id)} className="admin-action-btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: 'none' }}>
                                Remove Product
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleRestore(product.id)} className="admin-action-btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(0,255,0,0.1)', color: '#00ff00', border: 'none' }}>
                                Restore
                              </button>
                              <button onClick={() => handleDeletePermanently(product.id)} className="admin-action-btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: 'none' }}>
                                Remove Product
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td rowSpan={variantCount} style={{ verticalAlign: 'top', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        {product.is_archived ? (
                          <span className="admin-status-badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc' }}>
                            ARCHIVED
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleToggleFlag(product.id, 'is_visible', product.is_visible)}
                            className={`admin-status-badge ${product.is_visible ? 'status-confirmed' : 'status-cancelled'}`}
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            {product.is_visible ? 'VISIBLE' : 'HIDDEN'}
                          </button>
                        )}
                      </td>
                      <td rowSpan={variantCount} style={{ verticalAlign: 'top', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        <button 
                          onClick={() => handleToggleFlag(product.id, 'is_featured', product.is_featured)}
                          className={`admin-status-badge ${product.is_featured ? 'status-delivered' : 'status-pending'}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {product.is_featured ? 'Featured ★' : 'No'}
                        </button>
                      </td>
                    </>
                  )}
                  <td>{variant.name}</td>
                  <td>
                    <span className={variant.stock_quantity <= 10 ? 'alert-text' : ''}>
                      {variant.stock_quantity}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input 
                        type="number" 
                        value={stockInputs[variant.variant_id] !== undefined ? stockInputs[variant.variant_id] : variant.stock_quantity} 
                        onChange={(e) => setStockInputs({...stockInputs, [variant.variant_id]: e.target.value})}
                        style={{ width: '60px', padding: '4px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                      />
                      <button 
                        onClick={() => handleStockUpdate(variant.variant_id)}
                        className="admin-action-btn"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              ));
            })}
            {filteredProducts.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
