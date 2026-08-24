import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('id', { ascending: true });

  async function updateStock(formData: FormData) {
    'use server';
    const variantId = formData.get('variantId') as string;
    const newStock = parseInt(formData.get('stock') as string, 10);
    
    if (variantId && !isNaN(newStock)) {
      const supabaseServer = await createClient();
      await supabaseServer.from('product_variants').update({ 
        stock_quantity: newStock,
        in_stock: newStock > 0 
      }).eq('variant_id', variantId);
      revalidatePath('/admin/products');
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Inventory & Products</h1>
      
      <div className="admin-section">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Variant</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products?.map(product => (
                product.product_variants.map((variant: any) => (
                  <tr key={variant.id}>
                    <td>
                      <strong>{product.name}</strong><br/>
                      <small style={{ color: 'var(--silver-500)' }}>{product.category}</small>
                    </td>
                    <td>{variant.name}</td>
                    <td>${variant.price || product.price}</td>
                    <td>
                      <span style={{ color: variant.stock_quantity < 10 ? 'var(--accent-rose)' : 'inherit', fontWeight: variant.stock_quantity < 10 ? 'bold' : 'normal' }}>
                        {variant.stock_quantity}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${variant.in_stock ? 'status-delivered' : 'status-cancelled'}`}>
                        {variant.in_stock ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </td>
                    <td>
                      <form action={updateStock} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input type="hidden" name="variantId" value={variant.variant_id} />
                        <input 
                          type="number" 
                          name="stock" 
                          defaultValue={variant.stock_quantity} 
                          min="0"
                          className="contact-input-field" 
                          style={{ padding: '4px 8px', width: '80px', background: 'transparent' }} 
                        />
                        <button type="submit" className="admin-action-btn">Update</button>
                      </form>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
