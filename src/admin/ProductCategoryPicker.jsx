import { useState } from 'react';

export default function ProductCategoryPicker({ categories, value, onChange }) {
  const assigned = categories.find(row => row.id === value);
  const initialGroup = assigned?.level === 3 ? categories.find(row => row.id === assigned.parent_id) : assigned?.level === 2 ? assigned : null;
  const [rootId, setRootId] = useState(initialGroup?.parent_id || '');
  const [groupId, setGroupId] = useState(initialGroup?.id || '');
  const roots = categories.filter(row => !row.parent_id);
  const groups = categories.filter(row => row.parent_id === rootId);
  const children = categories.filter(row => row.parent_id === groupId);
  const label = row => `${row.name}${row.is_active ? '' : ' (hidden)'}`;
  return <div className="product-category-picker">
    <div className="admin-field"><label htmlFor="product-root-category">Category</label><select id="product-root-category" value={rootId} required onChange={event => {
      setRootId(event.target.value); setGroupId(''); onChange('');
    }}><option value="">Choose a category</option>{roots.map(row => <option key={row.id} value={row.id}>{label(row)}</option>)}</select></div>
    <div className="admin-field"><label htmlFor="product-group">Group</label><select id="product-group" value={groupId} required disabled={!rootId} onChange={event => {
      setGroupId(event.target.value); onChange(event.target.value);
    }}><option value="">{rootId ? 'Choose a group' : 'Select a category first'}</option>{groups.map(row => <option key={row.id} value={row.id}>{label(row)}</option>)}</select></div>
    <div className="admin-field"><label htmlFor="product-subcategory">Subcategory</label><select id="product-subcategory" value={children.some(row => row.id === value) ? value : ''} disabled={!groupId || !children.length} onChange={event => onChange(event.target.value || groupId)}>
      <option value="">{!groupId ? 'Select a group first' : children.length ? 'Choose a subcategory (optional)' : 'No subcategories in this group'}</option>{children.map(row => <option key={row.id} value={row.id}>{label(row)}</option>)}
    </select></div>
    {rootId && !groups.length && <p>Create a group for this category in Categories &amp; subcategories before adding a product.</p>}
  </div>;
}
