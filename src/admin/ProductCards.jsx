import { useEffect, useRef, useState } from 'react';
import { Eye, Pencil, Shirt, Trash2, X } from 'lucide-react';
import './product-cards.css';

export function productCategoryLevels(id, categories) {
  const levels = {};
  const path = [];
  let row = categories.find(item => item.id === id);
  while (row && path.length < 3) {
    path.unshift(row.name);
    levels[row.level] = row.name;
    row = categories.find(item => item.id === row.parent_id);
  }
  return {category: levels[1] || 'Unassigned', subgroup: levels[2] || 'Not assigned', subcategory: levels[3] || 'Not assigned', path: path.join(' / ') || 'Unassigned'};
}

function ProductClassification({ product, categories }) {
  const levels = productCategoryLevels(product.category_id, categories);
  return <dl className="admin-product-classification"><div><dt>Category</dt><dd>{levels.category}</dd></div><div><dt>Subgroup</dt><dd>{levels.subgroup}</dd></div><div><dt>Subcategory</dt><dd>{levels.subcategory}</dd></div></dl>;
}

function ProductImage({ product, eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.image_url]);
  return product.image_url && !failed
    ? <img src={product.image_url} alt={product.name} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)}/>
    : <div className="admin-product-no-image"><Shirt size={48} strokeWidth={1}/><span>No image uploaded</span></div>;
}

function ProductView({ product, categories, onClose, onEdit }) {
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog ref={dialog} className="admin-editor admin-product-view" aria-labelledby="product-view-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="product-view-header"><h2 id="product-view-title">{product.name}</h2><button aria-label="Close product preview" onClick={onClose}><X size={18}/></button></div>
    <div className="product-view-layout"><div className="product-view-image"><ProductImage product={product} eager/></div><div className="product-view-copy">
      <span className={`admin-product-status${product.is_active ? '' : ' is-hidden'}`}>{product.is_active ? 'Visible' : 'Hidden'}</span>
      <ProductClassification product={product} categories={categories}/>
      <dl><dt>SKU</dt><dd>{product.sku}</dd><dt>Color</dt><dd><i className="admin-product-color" style={{backgroundColor:product.color_hex}}/>{product.color_name || product.color_hex}</dd><dt>Pattern</dt><dd>{product.pattern}</dd><dt>Display order</dt><dd>{product.sort_order}</dd></dl>
      {product.subtitle && <p>{product.subtitle}</p>}
      <h3>Description</h3><p className="admin-prewrap">{product.description || 'No description added.'}</p>
      {Object.keys(product.attributes || {}).length > 0 && <><h3>Product details</h3><dl>{Object.entries(product.attributes).map(([name,value]) => <div key={name}><dt>{name}</dt><dd>{Array.isArray(value) ? value.join(', ') : value}</dd></div>)}</dl></>}
    </div></div>
    <div className="admin-editor-actions"><button onClick={onClose}>Close</button><button className="admin-primary" onClick={() => { onClose(); onEdit(product); }}><Pencil size={15}/>Edit product</button></div>
  </dialog>;
}

export default function ProductCards({ products, categories, hasRecords, onEdit, onDelete }) {
  const [viewing, setViewing] = useState(null);
  return <>
    <div className="admin-product-grid">{products.map(product => <article className="admin-product-card" key={product.id} aria-label={product.name}>
      <div className="admin-product-picture"><ProductImage product={product}/><span className={`admin-product-status${product.is_active ? '' : ' is-hidden'}`}>{product.is_active ? 'Visible' : 'Hidden'}</span></div>
      <div className="admin-product-body"><h2 title={product.name}>{product.name}</h2><p className="admin-product-sku">{product.sku}</p><ProductClassification product={product} categories={categories}/>
        {product.subtitle && <p className="admin-product-subtitle">{product.subtitle}</p>}
        <p className="admin-product-color-line"><i className="admin-product-color" style={{backgroundColor:product.color_hex}}/>{product.color_name || 'Color not specified'}</p>
        <div className="admin-product-actions"><button className="admin-product-view-button" aria-label={`View ${product.name}`} title="View product" onClick={() => setViewing(product)}><Eye size={17}/></button><button onClick={() => onEdit(product)}><Pencil size={14}/>Edit</button><button className="admin-product-delete-button" onClick={() => onDelete(product)}><Trash2 size={14}/>Delete</button></div>
      </div>
    </article>)}</div>
    {!products.length && <div className="admin-product-empty"><Shirt size={35}/><h2>{hasRecords ? 'No matching products' : 'No products yet'}</h2><p>{hasRecords ? 'Try a different name, SKU or category.' : 'Add your first product to get started.'}</p></div>}
    {viewing && <ProductView product={viewing} categories={categories} onClose={() => setViewing(null)} onEdit={onEdit}/>}
  </>;
}
