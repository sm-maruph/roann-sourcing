import { AdminSkeleton } from './AdminLoading';
import { useEffect, useRef, useState } from 'react';
import { FolderPlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminRequest } from './api';
import { resourcePayload, resources } from './resources';
import RecordEditor from './RecordEditor';
import './categories.css';

const colors = ['#2864ff', '#f2297b', '#f59e0b', '#00a3a3', '#16a34a'];
const slugify = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function QuickAdd({ label, onAdd, busy }) {
  const [name, setName] = useState('');
  return <form className="category-quick-add" onSubmit={async event => {
    event.preventDefault();
    if (await onAdd(name)) setName('');
  }}><input aria-label={label} placeholder={label} value={name} required maxLength={100} disabled={busy} onChange={event => setName(event.target.value)}/><button disabled={busy || !name.trim()}>Add</button></form>;
}

function RootEditor({ onClose, onSave, busy, error }) {
  const dialog = useRef(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog ref={dialog} className="admin-editor" onClose={onClose} onCancel={event => { if (busy) event.preventDefault(); }} aria-label="Add category"><form onSubmit={event => { event.preventDefault(); onSave(name, slug); }}>
    <div className="admin-editor-heading"><h2>Add Category</h2><button type="button" disabled={busy} aria-label="Close" onClick={onClose}><X size={18}/></button></div>
    {error && <p role="alert" className="admin-error">{error}</p>}
    <fieldset className="admin-fields" disabled={busy}><label>Category name<input required maxLength={100} value={name} onChange={event => { setName(event.target.value); setSlug(slugify(event.target.value)); }}/></label><label>URL name<input required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={event => setSlug(event.target.value)}/></label></fieldset>
    <div className="admin-editor-actions"><button type="button" disabled={busy} onClick={onClose}>Cancel</button><button type="submit" className="admin-primary" disabled={busy}>Save category</button></div>
  </form></dialog>;
}

export default function CategoryManager() {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState(null);
  const [addingRoot, setAddingRoot] = useState(false);
  const [addingGroup, setAddingGroup] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    adminRequest('admin/categories', { signal: controller.signal }).then(data => {
      data.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
      setRows(data);
      setSelectedId(previous => data.some(row => row.id === previous) ? previous : data.find(row => !row.parent_id)?.id);
    }).catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  const roots = rows.filter(row => !row.parent_id);
  const selected = roots.find(row => row.id === selectedId);
  const groups = rows.filter(row => row.parent_id === selectedId);
  const color = colors[Math.max(0, roots.findIndex(row => row.id === selectedId)) % colors.length];

  async function create(name, parentId, slug = slugify(name)) {
    if (!slug) { setError('Enter a name with letters or numbers, or supply a URL name.'); return false; }
    setBusy(true); setError(''); setNotice('');
    try {
      const created = await adminRequest('admin/categories', { method: 'POST', body: { ...resourcePayload(resources.categories, {}), name: name.trim(), slug, parent_id: parentId, sort_order: rows.filter(row => row.parent_id === parentId).reduce((max, row) => Math.max(max, row.sort_order + 1), 0) } });
      if (!parentId) { setSelectedId(created.id); setAddingRoot(false); }
      setNotice('Category saved.'); setRevision(value => value + 1); return true;
    } catch (failure) { setError(failure.message); return false; }
    finally { setBusy(false); }
  }
  async function reorder(parentId, dragged, target) {
    if (dragged === target || busy) return;
    const siblings = rows.filter(row => (row.parent_id || null) === parentId);
    const from = siblings.findIndex(row => row.id === dragged);
    const to = siblings.findIndex(row => row.id === target);
    if (from < 0 || to < 0) return;
    const [moving] = siblings.splice(from, 1);
    siblings.splice(to, 0, moving);
    const updates = new Map(siblings.map((row, index) => [row.id, {...row, sort_order: index}]));
    setRows(previous => previous.map(row => updates.get(row.id) || row));
    setBusy(true); setError(''); setNotice('');
    try {
      await Promise.all([...updates.values()].map(row => adminRequest(`admin/categories/${row.id}`, { method: 'PUT', body: resourcePayload(resources.categories, row) })));
      setNotice('Display order saved.');
      setRevision(value => value + 1);
    } catch (failure) {
      setError(failure.message);
      setRevision(value => value + 1);
    } finally { setBusy(false); setDraggedId(null); }
  }
  async function remove() {
    setBusy(true); setError('');
    try {
      await adminRequest(`admin/categories/${deleting.id}`, { method: 'DELETE' });
      setDeleting(null); setNotice('Category deleted.'); setRevision(value => value + 1);
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }
  if (loading) return <AdminSkeleton kind="categories" label="Loading categories"/>;
  return <section className="category-manager">
    <div className="category-page-heading"><div><h1>Categories</h1><p>{roots.length} categories</p></div><button className="category-create" disabled={busy || loading} onClick={() => { setError(''); setAddingRoot(true); }}><Plus size={16}/>Add Category</button></div>
    {error && <p className="admin-error" role="alert">{error}<button onClick={() => { setError(''); setRevision(value => value + 1); }}>Retry</button></p>}
    {notice && <p className="admin-success" role="status">{notice}</p>}
    {deleting && <div className="admin-delete" role="alert"><p>Delete “{deleting.name}”? Categories containing groups or products must be emptied first.</p><button disabled={busy} onClick={() => setDeleting(null)}>Cancel</button><button disabled={busy} className="admin-danger" onClick={remove}>Confirm delete</button></div>}
    {loading && !rows.length ? <p role="status">Loading categories…</p> : <div className="category-workbench" aria-busy={loading}>
      <nav className="category-list" aria-label="Categories">{roots.map((root, index) => {
        const children = rows.filter(row => row.parent_id === root.id);
        const count = rows.filter(row => children.some(child => child.id === row.parent_id)).length;
        return <button key={root.id} disabled={busy} draggable={!busy} onDragStart={event => { event.dataTransfer.setData('text/plain', root.id); event.dataTransfer.effectAllowed = 'move'; setDraggedId(root.id); }} onDragEnd={() => setDraggedId(null)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); void reorder(null, id || draggedId, root.id); }} className={draggedId === root.id ? 'is-dragging' : ''} aria-current={selectedId === root.id ? 'true' : undefined} onClick={() => { setSelectedId(root.id); setAddingGroup(false); setError(''); }} style={{ '--category-color': colors[index % colors.length] }} title="Drag to reorder"><i className="category-swatch"/><span><strong>{root.name}</strong><small>{children.length} groups · {count} subcategories{!root.is_active && ' · Hidden'}</small></span>{selectedId === root.id && <i className="category-selected-dot"/>}</button>;
      })}{!roots.length && <p>No categories yet. Add your first category.</p>}</nav>
      <div className="category-detail">{selected && <>
        <div className="category-summary" style={{ '--category-color': color }}><i className="category-swatch"/><div><h2>{selected.name}</h2><p>/{selected.slug}{!selected.is_active && ' · Hidden'}</p></div><div className="category-summary-actions"><button disabled={busy} onClick={() => setEditor(selected)}><Pencil size={14}/>Edit</button><button disabled={busy} className="category-delete" onClick={() => setDeleting(selected)}><Trash2 size={14}/>Delete</button></div></div>
        {groups.map(group => <article className={`category-group${draggedId === group.id ? ' is-dragging' : ''}`} key={group.id}>
          <header onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); void reorder(selectedId, id || draggedId, group.id); }}><button className="category-group-title" disabled={busy} draggable={!busy} onDragStart={event => { event.dataTransfer.setData('text/plain', group.id); event.dataTransfer.effectAllowed = 'move'; setDraggedId(group.id); }} onDragEnd={() => setDraggedId(null)} onClick={() => setEditor(group)} title="Drag to reorder">{group.name}{!group.is_active && <small>Hidden</small>}</button><button className="category-icon-button" disabled={busy} aria-label={`Delete group ${group.name}`} onClick={() => setDeleting(group)}><Trash2 size={15}/></button></header>
          <div className="category-chips">{rows.filter(row => row.parent_id === group.id).map(child => <span className={`category-chip${draggedId === child.id ? ' is-dragging' : ''}`} key={child.id} draggable={!busy} onDragStart={event => { event.dataTransfer.setData('text/plain', child.id); event.dataTransfer.effectAllowed = 'move'; setDraggedId(child.id); }} onDragEnd={() => setDraggedId(null)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); void reorder(group.id, id || draggedId, child.id); }} title="Drag to reorder"><button disabled={busy} onClick={() => setEditor(child)}>{child.name}{!child.is_active && ' (hidden)'}</button><button disabled={busy} aria-label={`Delete subcategory ${child.name}`} onClick={() => setDeleting(child)}><X size={12}/></button></span>)}</div>
          <QuickAdd label={`Add subcategory to ${group.name}`} busy={busy || loading} onAdd={name => create(name, group.id)}/>
        </article>)}
        {!groups.length && <p className="category-empty">Add a group to organize products and subcategories.</p>}
        {addingGroup ? <div className="category-group"><QuickAdd label="Group name" busy={busy || loading} onAdd={async name => { const result = await create(name, selected.id); if (result) setAddingGroup(false); return result; }}/><button className="category-cancel" onClick={() => setAddingGroup(false)}>Cancel</button></div> : <button className="category-add-group" disabled={busy || loading} onClick={() => setAddingGroup(true)}><FolderPlus size={16}/>Add Group</button>}
      </>}</div>
    </div>}
    {addingRoot && <RootEditor error={error} busy={busy} onClose={() => setAddingRoot(false)} onSave={(name, slug) => create(name, null, slug)}/>}
    {editor && <RecordEditor resourceKey="categories" resource={{ ...resources.categories, singular: editor.level === 1 ? 'category' : editor.level === 2 ? 'group' : 'subcategory' }} record={editor} categories={rows} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); setNotice('Changes saved.'); setRevision(value => value + 1); }}/>}
  </section>;
}
