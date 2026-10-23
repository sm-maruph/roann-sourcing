import { AdminSkeleton } from './AdminLoading';
import ProductCards, { productCategoryLevels } from './ProductCards';
import HomeSlidesEditor from './HomeSlidesEditor';
import { useEffect, useState } from 'react';
import { adminRequest } from './api';
import { categoryLabel, resources } from './resources';
import RecordEditor from './RecordEditor';

export default function CollectionManager({ resourceKey }) {
  const resource = resources[resourceKey];
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('order');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subgroupFilter, setSubgroupFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState(null);
  const [homeEditor, setHomeEditor] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    Promise.all([
      adminRequest(`admin/${resourceKey}`, { signal: controller.signal }),
      resourceKey === 'products' ? adminRequest('admin/categories', { signal: controller.signal }) : Promise.resolve([]),
    ]).then(([data, categoryRows]) => { setRows(resourceKey === 'hero_banners' ? data.sort((a, b) => a.page.localeCompare(b.page) || a.sort_order - b.sort_order || a.id.localeCompare(b.id)) : data); setCategories(resourceKey === 'categories' ? data : categoryRows); })
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [resourceKey, revision]);

  const filterCategories = categories.filter(row => row.level === 1);
  const filterSubgroups = categories.filter(row => row.parent_id === categoryFilter);
  const filterSubcategories = categories.filter(row => row.parent_id === subgroupFilter);
  const filtered = rows.filter(row => {
    const matchesSearch = [row.name, row.label, row.sku, row.slug, row.audience, row.page, productCategoryLevels(row.category_id, categories).path, categoryLabel(categories.find(category => category.id === row.category_id), categories)].join(' ').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch || resourceKey !== 'products') return matchesSearch;
    const ancestors = new Set();
    let assigned = categories.find(category => category.id === row.category_id);
    while (assigned && ancestors.size < 3) {
      ancestors.add(assigned.id);
      assigned = categories.find(category => category.id === assigned.parent_id);
    }
    return [categoryFilter, subgroupFilter, subcategoryFilter].every(id => !id || ancestors.has(id));
  });
  if (resourceKey === 'products') {
    const compare = (a, b) => String(a || '').localeCompare(String(b || ''), undefined, {numeric:true, sensitivity:'base'});
    filtered.sort((a, b) => {
      let result = 0;
      if (sort === 'name-asc') result = compare(a.name,b.name);
      else if (sort === 'name-desc') result = compare(b.name,a.name);
      else if (sort === 'sku-asc') result = compare(a.sku,b.sku);
      else if (sort === 'sku-desc') result = compare(b.sku,a.sku);
      else if (sort === 'latest') result = Date.parse(b.created_at) - Date.parse(a.created_at);
      else if (sort === 'oldest') result = Date.parse(a.created_at) - Date.parse(b.created_at);
      else if (sort === 'category') result = compare(productCategoryLevels(a.category_id,categories).path,productCategoryLevels(b.category_id,categories).path);
      else result = a.sort_order - b.sort_order;
      return result || compare(a.name,b.name) || compare(a.id,b.id);
    });
  }
  const pageCount = Math.max(1, Math.ceil(filtered.length / 20));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 20, currentPage * 20);

  async function remove() {
    setBusy(true); setError('');
    try {
      await adminRequest(`admin/${resourceKey}/${deleting.id}`, { method: 'DELETE' });
      setDeleting(null); setNotice('Record deleted.'); setRevision(value => value + 1);
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  if (loading) return <AdminSkeleton kind="products" label="Loading products"/>;
  return <section className={resourceKey === 'products' ? 'admin-products-page' : undefined}>
    <div className="admin-section-heading"><div><h1>{resource.label}</h1><p>{resourceKey === 'products' ? `${rows.length} products | ${rows.filter(row=>row.is_active).length} visible | ${rows.filter(row=>!row.is_active).length} hidden` : `${rows.length} records`}</p></div><div className="admin-row-actions">{resourceKey === 'hero_banners' && <button className="admin-primary" disabled={loading} onClick={() => setHomeEditor(true)}>Manage homepage slider</button>}<button className="admin-primary" disabled={loading} onClick={() => { setNotice(''); setEditor({ record: null }); }}>{resourceKey === 'hero_banners' ? 'Set page banner' : `Add ${resource.singular}`}</button></div></div>
    {resourceKey === 'hero_banners' && <p>Use Manage homepage slider to select multiple homepage images together. Other pages have one banner each.</p>}
    <div className={resourceKey === 'products' ? 'admin-product-controls' : undefined}>
    <div className="admin-collection-toolbar">
    <label className="admin-search">Search {resource.label.toLowerCase()}<input type="search" placeholder={resourceKey === 'products' ? 'Name, SKU or category...' : undefined} value={search} onChange={event => { setSearch(event.target.value); setPage(1); }}/></label>
      {resourceKey === 'products' && <div className="admin-product-sort"><label htmlFor="admin-product-sort">Sort products</label><select id="admin-product-sort" value={sort} onChange={event => {setSort(event.target.value);setPage(1);}}>
        <option value="order">Display order</option><option value="latest">Newest first</option><option value="oldest">Oldest first</option><option value="name-asc">Name: A to Z</option><option value="name-desc">Name: Z to A</option><option value="sku-asc">SKU: ascending</option><option value="sku-desc">SKU: descending</option><option value="category">Category / subgroup / subcategory</option>
      </select></div>}
    </div>
    {resourceKey === 'products' && <div className="admin-hierarchy-filter-panel">
      <div className="admin-hierarchy-filters">
        <div><label htmlFor="filter-product-category">Category</label><select id="filter-product-category" value={categoryFilter} disabled={loading} onChange={event => {setCategoryFilter(event.target.value);setSubgroupFilter('');setSubcategoryFilter('');setPage(1);}}><option value="">All categories</option>{filterCategories.map(row => <option key={row.id} value={row.id}>{row.name}{!row.is_active && ' (hidden)'}</option>)}</select></div>
        <div><label htmlFor="filter-product-subgroup">Subgroup</label><select id="filter-product-subgroup" value={subgroupFilter} disabled={loading || !categoryFilter} onChange={event => {setSubgroupFilter(event.target.value);setSubcategoryFilter('');setPage(1);}}><option value="">{categoryFilter ? 'All subgroups' : 'Select a category first'}</option>{filterSubgroups.map(row => <option key={row.id} value={row.id}>{row.name}{!row.is_active && ' (hidden)'}</option>)}</select></div>
        <div><label htmlFor="filter-product-subcategory">Subcategory</label><select id="filter-product-subcategory" value={subcategoryFilter} disabled={loading || !subgroupFilter || !filterSubcategories.length} onChange={event => {setSubcategoryFilter(event.target.value);setPage(1);}}><option value="">{!subgroupFilter ? 'Select a subgroup first' : filterSubcategories.length ? 'All subcategories' : 'No subcategories'}</option>{filterSubcategories.map(row => <option key={row.id} value={row.id}>{row.name}{!row.is_active && ' (hidden)'}</option>)}</select></div>
      </div>
      <div className="admin-hierarchy-filter-summary"><p role="status">{filtered.length} matching products</p>{(categoryFilter || subgroupFilter || subcategoryFilter) && <button type="button" onClick={() => {setCategoryFilter('');setSubgroupFilter('');setSubcategoryFilter('');setPage(1);}}>Clear category filters</button>}</div>
    </div>}
    </div>
    {notice && <p role="status" className="admin-success">{notice}</p>}
    {error && <div className="admin-error" role="alert">{error}<button onClick={() => setRevision(value => value + 1)}>Retry</button></div>}
    {deleting && <div className="admin-delete" role="alert"><p>Delete “{deleting.name || deleting.label || deleting.page}”? This cannot be undone.</p><button disabled={busy} onClick={() => setDeleting(null)}>Cancel</button><button className="admin-danger" disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Confirm delete'}</button></div>}
    {loading ? <p role="status">Loading records…</p> : <>
      {resourceKey === 'products' ? <ProductCards products={visible} categories={categories} hasRecords={Boolean(rows.length)} onEdit={row => setEditor({record:row})} onDelete={row => {setError('');setDeleting(row);}}/> : <div className="admin-table-wrap"><table><thead><tr>{resourceKey === 'hero_banners' && <th>Preview</th>}<th>Name</th><th>{resourceKey === 'products' ? 'SKU / Category' : 'Details'}</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>
        {visible.map(row => <tr key={row.id}>{resourceKey === 'hero_banners' && <td>{row.image_url ? <img className="admin-banner-thumbnail" src={row.image_url} alt={`${row.page} banner preview`} loading="lazy"/> : <span>No image</span>}</td>}<td>{row.name || row.label || row.page}</td><td>{resourceKey === 'products' ? <>{row.sku}<small>{categoryLabel(categories.find(category => category.id === row.category_id), categories)}</small></> : resourceKey === 'hero_banners' ? `Order: ${row.sort_order || 0}${row.page === 'home' ? ' ? Homepage slide' : ' ? Single banner'}` : row.slug || row.audience || row.website_url || '—'}</td><td>{row.is_active === false ? 'Hidden' : 'Visible'}</td><td><div className="admin-row-actions"><button onClick={() => resourceKey === 'hero_banners' && row.page === 'home' ? setHomeEditor(true) : setEditor({ record: row })}>{resourceKey === 'hero_banners' && row.page === 'home' ? 'Edit slider' : 'Edit'}</button><button disabled={resourceKey === 'categories' && row.parent_id === null} onClick={() => { setError(''); setDeleting(row); }}>Delete</button></div></td></tr>)}
        {!visible.length && <tr><td colSpan={resourceKey === 'hero_banners' ? 5 : 4}>{rows.length ? 'No matching records.' : 'No records yet. Add your first record to get started.'}</td></tr>}
      </tbody></table></div>}
      <div className="admin-pagination"><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pageCount}</span><button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button></div>
    </>}
    {homeEditor && <HomeSlidesEditor banners={rows} onClose={() => setHomeEditor(false)} onSaved={() => { setHomeEditor(false); setNotice('Homepage slider saved.'); setRevision(value => value + 1); }}/>}
    {editor && <RecordEditor resourceKey={resourceKey} resource={resourceKey === 'hero_banners' ? { ...resource, defaults: { ...resource.defaults, page: 'about' }, fields: resource.fields.map(field => field.name === 'page' ? { ...field, options: field.options.filter(page => page !== 'home') } : field) } : resource} record={editor.record} categories={categories} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); setNotice('Changes saved.'); setRevision(value => value + 1); }}/>}
  </section>;
}
