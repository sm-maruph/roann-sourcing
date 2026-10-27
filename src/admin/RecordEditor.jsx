import ImageField from './ImageField';
import ProductCategoryPicker from './ProductCategoryPicker';
import useUploadCleanup from './useUploadCleanup';
import { useEffect, useRef, useState } from 'react';
import { adminRequest } from './api';
import { categoryLabel, getValue, setValue, resourcePayload } from './resources';

function Attributes({ value = {}, onChange, arrays }) {
  const entries = Object.entries(value);
  const update = (index, key, values) => onChange(Object.fromEntries(entries.map(([oldKey, oldValue], i) => i === index ? [key, values] : [oldKey, oldValue])));
  return <div className="admin-attributes">
    <p>Use a group such as Fabric or Fit. Separate multiple values with commas.</p>
    {entries.map(([key, values], index) => <div className="admin-attribute-row" key={index}>
      <input aria-label={`Attribute ${index + 1}`} value={key} maxLength={60} required onChange={event => update(index, event.target.value, values)}/>
      {arrays ? <textarea aria-label={`Options for ${key}`} rows={Math.max(3, Array.isArray(values) ? values.length : 3)} value={Array.isArray(values) ? values.join('\n') : values} maxLength={4000} placeholder="One option per line" onChange={event => update(index, key, event.target.value.split('\n').map(option => option.trim()).filter(Boolean))}/> : <input aria-label={`Values ${index + 1}`} value={Array.isArray(values) ? values.join(', ') : values} maxLength={1000} onChange={event => {
        const parts = event.target.value.split(',');
        update(index, key, parts.length > 1 ? parts : event.target.value);
      }}/>}
      <button type="button" onClick={() => onChange(Object.fromEntries(entries.filter((_, i) => i !== index)))}>Remove</button>
    </div>)}
    <button type="button" onClick={() => {
      let index = entries.length + 1;
      while (`Group ${index}` in value) index++;
      onChange({ ...value, [`Group ${index}`]: arrays ? [] : '' });
    }}>Add attribute</button>
  </div>;
}

function ProductFilterOptions({ categories, categoryId, value = {}, onChange }) {
  const assigned = categories.find(row => row.id === categoryId);
  const group = assigned?.level === 3 ? categories.find(row => row.id === assigned.parent_id) : assigned;
  const filters = group?.config?.filters || {};
  const filterNames = Object.keys(filters);
  if (!filterNames.length) return <div className="admin-field"><span>Product attributes</span><Attributes value={value} onChange={onChange}/><small>Add filter groups and options in Categories &amp; subcategories.</small></div>;
  const extra = Object.fromEntries(Object.entries(value).filter(([key]) => !filterNames.includes(key)));
  const setValues = (name, options) => onChange({...extra, ...Object.fromEntries(filterNames.map(key => [key, key === name ? options : value[key] || []]))});
  return <div className="admin-field"><span>Product filters</span><div className="admin-attributes">
    {filterNames.map(name => <fieldset key={name} className="admin-product-filter-options"><legend>{name}</legend>{filters[name].map(option => <label className="admin-check" key={option}><input type="checkbox" checked={(Array.isArray(value[name]) ? value[name] : value[name] ? [value[name]] : []).includes(option)} onChange={event => {
      const selected = Array.isArray(value[name]) ? value[name] : value[name] ? [value[name]] : [];
      setValues(name, event.target.checked ? [...selected, option] : selected.filter(item => item !== option));
    }}/>{option}</label>)}</fieldset>)}
    {Object.keys(extra).length > 0 && <><p>Additional product details</p><Attributes value={extra} onChange={next => onChange({...Object.fromEntries(filterNames.map(key => [key, value[key] || []])), ...next})}/></>}
  </div></div>;
}

export default function RecordEditor({ resourceKey, resource, record, categories, products = [], onClose, onSaved }) {
  const trackUpload = useUploadCleanup();
  const [values, setValues] = useState(() => resourcePayload(resource, record || {}));
  const [skuPreview, setSkuPreview] = useState({sku: '', loading: false, error: ''});
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  useEffect(() => {
    if (resourceKey !== 'products' || !values.category_id) { setSkuPreview({sku:'',loading:false,error:''}); return; }
    const controller = new AbortController();
    setSkuPreview({sku:'',loading:true,error:''});
    adminRequest(`admin/products/sku-preview?category_id=${encodeURIComponent(values.category_id)}`, {signal:controller.signal})
      .then(data => setSkuPreview({sku:data.sku,loading:false,error:''}))
      .catch(failure => { if(failure.name !== 'AbortError') setSkuPreview({sku:'',loading:false,error:failure.message}); });
    return () => controller.abort();
  }, [resourceKey, values.category_id]);

  const change = (key, value) => setValues(previous => setValue(previous, key, value));

  async function save(event) {
    event.preventDefault(); if (uploading) return; setBusy(true); setError('');
    try {
      await adminRequest(`admin/${resourceKey}${record ? `/${record.id}` : ''}`, { method: record ? 'PUT' : 'POST', body: values });
      onSaved();
    } catch (failure) { setError(failure.message); setBusy(false); }
  }

  return <dialog className="admin-editor" ref={dialog} aria-labelledby="admin-editor-title" onCancel={event => { if (busy) event.preventDefault(); }} onClose={onClose}>
    <form onSubmit={save}>
      <div className="admin-editor-heading"><h2 id="admin-editor-title">{record ? 'Edit' : resourceKey === 'hero_banners' ? 'Set page' : 'Add'} {resource.singular}</h2><button type="button" aria-label="Close editor" disabled={busy || uploading} onClick={onClose}>×</button></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <fieldset disabled={busy || uploading} className="admin-fields">
        {resource.fields.map(({ name, label, type, options, arrays, ...attributes }) => {
          const value = getValue(values, name);
          const fixedParent = name === 'parent_id' && Boolean(record);
          const fixedRootSlug = name === 'slug' && record?.parent_id === null;
          const id = `admin-field-${name.replaceAll('.', '-')}`;
          if (type === 'auto-sku') {
            const sku = values.sku || (record ? '' : skuPreview.sku);
            const duplicate = products.some(product => product.id !== record?.id && product.sku?.trim().toLowerCase() === String(sku).trim().toLowerCase() && sku);
            return <div className="admin-field" key={name}><label htmlFor={id}>SKU</label><input id={id} value={sku} maxLength={80} placeholder={skuPreview.loading ? 'Generating SKU…' : 'Select a category and group first'} onChange={event => change('sku', event.target.value)}/><small id="sku-help">Generated from the selected group. You can edit it.</small>{duplicate && <p className="admin-error" role="status">This SKU is already in use. Choose a different SKU.</p>}{skuPreview.error && <p className="admin-error" role="alert">{skuPreview.error}</p>}</div>;
          }
          if (type === 'product-category') return <ProductCategoryPicker key={name} categories={categories} value={value} onChange={next => change(name, next)}/>;
          if (type === 'attributes' && resourceKey === 'products') return <ProductFilterOptions key={name} categories={categories} categoryId={values.category_id} value={value} onChange={next => change(name, next)}/>;
          if (type === 'attributes') return <div className="admin-field" key={name}><span>{label}</span><Attributes value={value} arrays={arrays} onChange={next => change(name, next)}/></div>;
          if (type === 'checkbox') return <label className="admin-check" htmlFor={id} key={name}><input id={id} type="checkbox" checked={Boolean(value)} onChange={event => change(name, event.target.checked)}/>{label}</label>;
          const choices = type === 'category' ? categories.filter(category => category.level >= 2 || category.id === value).map(category => [category.id, categoryLabel(category, categories)])
            : type === 'parent' ? categories.filter(category => category.level < 3 || category.id === value).map(category => [category.id, categoryLabel(category, categories)]) : options;
          if (resourceKey === 'products' && name === 'name') {
            const duplicate = products.some(product => product.id !== record?.id && product.name?.trim().toLowerCase() === String(value || '').trim().toLowerCase() && value);
            return <div className="admin-field" key={name}><label htmlFor={id}>{label}</label><input id={id} type={type} value={value ?? ''} {...attributes} onChange={event => change(name, event.target.value)}/>{duplicate && <p className="admin-error" role="status">A product with this name already exists.</p>}</div>;
          }
          return <div className="admin-field" key={name}><label htmlFor={id}>{label}</label>
            {['select', 'category', 'parent'].includes(type) ? <select id={id} value={value || ''} disabled={fixedParent || (resourceKey === 'hero_banners' && Boolean(record) && name === 'page')} {...attributes} onChange={event => change(name, event.target.value)}>
              {type !== 'select' && <option value="">{record?.parent_id === null && name === 'parent_id' ? 'Top-level collection' : 'Choose a category'}</option>}
              {choices.map(option => { const [key, text] = Array.isArray(option) ? option : [option, option]; return <option key={key} value={key}>{text}</option>; })}
            </select> : ['textarea', 'lines'].includes(type) ? <textarea id={id} rows={4} value={type === 'lines' ? (value || []).join('\n') : value || ''} {...attributes} onChange={event => change(name, type === 'lines' ? event.target.value.split('\n').filter(Boolean) : event.target.value)}/>
              : (name === 'image_url' || name === 'hero_image_url' || name === 'config.bannerImage') ? <ImageField onUploaded={trackUpload} onUploading={setUploading} id={id} value={value} {...attributes} kind={resourceKey === 'partners' ? 'logo' : resourceKey === 'products' ? 'product' : resourceKey === 'hero_banners' ? 'hero' : 'category'} onChange={next => change(name, next)}/> : <input id={id} type={type} value={value ?? ''} disabled={fixedRootSlug} {...attributes} onChange={event => change(name, type === 'number' ? Number(event.target.value) : event.target.value)}/>}
          </div>;
        })}
      </fieldset>
      <div className="admin-editor-actions"><button type="button" disabled={busy || uploading} onClick={onClose}>Cancel</button><button className="admin-primary" disabled={busy || uploading} type="submit">{busy ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  </dialog>;
}
