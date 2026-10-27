import { publicRequest, usePublicData } from '../api/public';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronRight, SlidersHorizontal, X, Shirt, ShieldCheck, Leaf, Globe2, Handshake, Eye } from 'lucide-react';
import { mensCategories, mensProducts } from '../data/mens';
import GarmentPreview from '../components/GarmentPreview';
import CatalogFilters from '../components/CatalogFilters';
import CatalogPagination from '../components/CatalogPagination';
import CollectionLoading from '../components/CollectionLoading';
import '../styles/mens.css';

function categoryFromUrl(categories) {
  const id = new URLSearchParams(window.location.search).get('category');
  return categories.some(category => category.id === id) ? id : categories[0]?.id;
}
function filtersFromUrl(categories, categoryId) {
  const subcategoryId = new URLSearchParams(window.location.search).get('subcategory');
  const subcategory = categories.find(category => category.id === categoryId)?.subcategories?.find(item => item.id === subcategoryId);
  return subcategory ? { Subcategory: [subcategory.label] } : {};
}

function Catalog({ categories = mensCategories, catalogProducts = mensProducts, basePath = '/mens', audience = 'Men’s', Preview = GarmentPreview, women = false, girls = false }) {
  const [categoryId, setCategoryId] = useState(() => categoryFromUrl(categories));
  const [filters, setFilters] = useState(() => filtersFromUrl(categories, categoryFromUrl(categories)));
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(() => {
    const productId = new URLSearchParams(window.location.search).get('product');
    const items = catalogProducts.filter(product => product.category === categoryId).sort((a, b) => a.order - b.order);
    return Math.floor(Math.max(0, items.findIndex(product => product.id === productId)) / 8) + 1;
  });
  const [pageSize, setPageSize] = useState('8');
  const [quote, setQuote] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const filterDialog = useRef(null);
  const quoteDialog = useRef(null);
  const imageDialog = useRef(null);
  const category = categories.find(item => item.id === categoryId);
  useEffect(() => {
    const onPopState = () => { const nextCategory = categoryFromUrl(categories); setCategoryId(nextCategory); setFilters(filtersFromUrl(categories, nextCategory)); setSort('featured'); setPage(1); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [categories]);
  useEffect(() => { document.title = `${audience} ${category.title} | Roann Sourcing`; }, [category.title, audience]);
  useEffect(() => { if (quote) { setSubmitted(false); setQuoteError(''); quoteDialog.current?.showModal(); } }, [quote]);
  useEffect(() => { if (viewing) { setImageZoom(1); imageDialog.current?.showModal(); } }, [viewing]);
  useEffect(() => {
    if (!viewing) return;
    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const previous = {position: bodyStyle.position, top: bodyStyle.top, left: bodyStyle.left, right: bodyStyle.right, width: bodyStyle.width, overflow: bodyStyle.overflow};
    bodyStyle.position = 'fixed'; bodyStyle.top = `-${scrollY}px`; bodyStyle.left = '0'; bodyStyle.right = '0'; bodyStyle.width = '100%'; bodyStyle.overflow = 'hidden';
    return () => {
      Object.assign(bodyStyle, previous);
      window.scrollTo(0, scrollY);
    };
  }, [viewing]);

  function changeCategory(event, id) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setCategoryId(id); setFilters({}); setSort('featured'); setPage(1);
    window.history.pushState({}, '', `${basePath}?category=${id}`);
  }
  function toggleFilter(group, value) {
    setPage(1);
    setFilters(previous => {
      const current = previous[group] || [];
      return { ...previous, [group]: current.includes(value) ? current.filter(item => item !== value) : [...current, value] };
    });
  }
  const visibleProducts = useMemo(() => {
    const result = catalogProducts.filter(product => product.category === categoryId && Object.entries(filters).every(([group, choices]) => !choices.length || choices.some(choice => Array.isArray(product.attributes[group]) ? product.attributes[group].includes(choice) : choice === product.attributes[group])));
    return result.sort(sort === 'az' ? (a, b) => a.name.localeCompare(b.name) : sort === 'za' ? (a, b) => b.name.localeCompare(a.name) : sort === 'latest' ? (a, b) => b.order - a.order : (a, b) => a.order - b.order);
  }, [categoryId, filters, sort, catalogProducts]);
  const limit = pageSize === 'all' ? Math.max(visibleProducts.length, 1) : Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / limit));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * limit;
  const paginatedProducts = visibleProducts.slice(startIndex, startIndex + limit);
  useEffect(() => {
    if (window.location.hash.startsWith('#product-')) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ block: 'center' });
  }, []);
  const filterCategory = {
    ...category,
    filters: Object.fromEntries(Object.entries(category.filters).filter(([group, options]) =>
      group !== 'Color' && !(['Style', 'Type', 'Product Type'].includes(group) && options.some(option => category.tabs.includes(option)))
    )),
  };
  const filterCount = Object.values(filters).flat().length;
  const clearFilters = () => { setFilters({}); setPage(1); };

  async function prepareQuote(event) {
    event.preventDefault();
    if (submitting || submitted) return;
    const data = new FormData(event.currentTarget);
    setSubmitting(true); setQuoteError('');
    try {
      await publicRequest('quotes', { method: 'POST', body: JSON.stringify({
        name: data.get('name'), email: data.get('email'), company: data.get('company'),
        quantity: Number(data.get('quantity')), message: data.get('message'),
        product_id: quote.databaseId || null, product_name: quote.name,
        product_sku: quote.id, color: quote.selectedColor || '', website: data.get('website') || '',
      }) });
      setSubmitted(true);
    } catch (error) { setQuoteError(error.message); }
    finally { setSubmitting(false); }
  }

  return <div className={`mens-page${women ? ' womens-page' : ''}${girls ? ' girls-page' : ''}`}>
    <nav className="mens-category-nav" aria-label={`${audience} categories`}><div className="container"><span>Explore {audience}</span>{categories.map(item => <a key={item.id} href={`${basePath}?category=${item.id}`} className={item.id === categoryId ? 'selected' : ''} aria-current={item.id === categoryId ? 'page' : undefined} onClick={event => changeCategory(event, item.id)}>{item.label}</a>)}</div></nav>
    <section className={`mens-hero mens-hero-${categoryId}`} style={{ '--mens-hero-image': `url("${category.hero}")` }} aria-labelledby="mens-title"><div className="container"><nav className="mens-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={12}/><a href={basePath}>{audience}</a><ChevronRight size={12}/><span>{category.label}</span></nav><p className="eyebrow">{girls ? "Girls’ Collection" : audience}</p><h1 id="mens-title">{girls && <span>Girls’<br/></span>}{category.title}</h1>{women && <p className="womens-hero-tagline">{category.tagline}</p>}<p className="mens-hero-description">{category.description}</p>{women ? <button className="button" onClick={() => setQuote({id: `Custom ${category.label}`,name: `${audience} ${category.label}`,category: category.id,type: category.tabs[1],color: '#bab4a7',pattern: 'plain'})}>Request a Quote<ArrowRight size={14}/></button> : <span className="mens-hero-tagline">{category.tagline}</span>}</div></section>

    {women && <div className="womens-benefits"><div className="container">{category.benefits.map((label, i) => { const Icon = [Globe2, Leaf, Shirt, ShieldCheck][i]; return <div key={label}><Icon size={22} strokeWidth={1.3}/><span>{label}</span></div>; })}</div></div>}
    <section className="mens-catalog" aria-label={`${category.title} product catalog`}><div className="container catalog-layout"><aside className="catalog-sidebar" aria-label="Product filters"><CatalogFilters category={filterCategory} filters={filters} onToggle={toggleFilter} onClear={clearFilters}/></aside><div className="catalog-main"><div className="catalog-toolbar"><button className="mobile-filter-button" onClick={() => filterDialog.current.showModal()}><SlidersHorizontal size={16}/>Filter{filterCount > 0 && <span>{filterCount}</span>}</button><label className="catalog-page-size"><span>Products per page</span><select aria-label="Products per page" value={pageSize} onChange={event => { setPageSize(event.target.value); setPage(1); }}>{[3, 6, 8, 12, 24, 48].map(size => <option key={size} value={String(size)}>{size}</option>)}<option value="all">All</option></select></label><label className="catalog-sort"><span>Sort by:</span><select aria-label="Sort products" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="featured">Featured</option><option value="latest">Latest</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option></select></label></div><div className="catalog-summary"><p role="status">Showing {visibleProducts.length ? startIndex + 1 : 0}?{Math.min(startIndex + limit, visibleProducts.length)} of {visibleProducts.length} products</p><span>Designed for your brand.</span></div>{filterCount > 0 && <div className="active-filters">{Object.entries(filters).flatMap(([group, choices]) => choices.map(choice => <button key={`${group}-${choice}`} onClick={() => toggleFilter(group, choice)}>{choice}<X size={12}/></button>))}<button className="clear-filters" onClick={clearFilters}>Clear all</button></div>}
    {visibleProducts.length ? <div className="mens-product-grid">{paginatedProducts.map(product => { return <article className="mens-product-card" id={`product-${product.id}`} key={product.id}><div className="mens-product-image"><Preview product={product}/><span className="product-image-label">ROANN / {category.label}</span><button className="image-view-button" aria-label={`View image of ${product.name}`} title="View image" onClick={() => setViewing(product)}><Eye size={20}/><span>View</span></button></div><div className="mens-product-info"><h2>{product.name}</h2><p>{women ? product.subtitle : product.id}</p>{girls ? <div className="girls-card-actions"><button className="girls-quote-arrow" aria-label={`Request quote for ${product.name}`} onClick={() => setQuote(product)}><ArrowRight size={17}/></button></div> : <button className="button" onClick={() => setQuote(product)}>Request Quote<ArrowRight size={13}/></button>}</div></article>; })}</div> : <div className="catalog-empty"><Shirt size={38} strokeWidth={1}/><h2>No matching styles</h2><p>Try another combination of filters, or ask us about a custom design.</p><button className="button" onClick={clearFilters}>Reset Filters<ArrowRight size={15}/></button></div>}
    {visibleProducts.length > 0 && <CatalogPagination page={currentPage} pageCount={pageCount} onChange={setPage}/>}
    <div className="catalog-footnote"><ShieldCheck size={16}/><p>Custom fabrics, colors and branding available. Photos and illustrations are style references.</p></div></div></div></section>

    {girls && <section className="girls-custom-banner"><div className="container"><img src={category.bannerImage} alt={`${category.label} sourcing materials`} loading="lazy"/><div><h2>{category.banner}</h2><p>{category.bannerCopy}</p><a className="button" href={`mailto:nazim@roannsourcing.com?subject=${encodeURIComponent(`Girls ${category.label} custom sourcing`)}`}>Request a Quote<ArrowRight size={15}/></a></div></div></section>}
    <section className="mens-promise"><div className="container">{[[ShieldCheck, 'Quality Manufacturing'], [Leaf, 'Ethical Production'], [Globe2, 'Global Supply Chain'], [Handshake, 'Long-Term Partnership']].map(([Icon, label]) => <div key={label}><Icon size={28} strokeWidth={1.2}/><span>{label}</span></div>)}</div></section>
    <section className="mens-contact" id="contact"><div className="container"><p className="eyebrow">One Supply Partner. Endless Possibilities.</p><h2>Your next collection starts here.</h2><p>Let’s build {audience.toLowerCase()} apparel that brings your brand’s vision to life.</p><a className="button" href={`mailto:nazim@roannsourcing.com?subject=${encodeURIComponent(`${audience} ${category.label} sourcing enquiry`)}`}>Discuss Your Collection<ArrowRight size={16}/></a></div></section>

    <dialog className="mens-filter-dialog" ref={filterDialog} aria-label="Filter products" onClick={event => { if (event.target === event.currentTarget) filterDialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close filters" onClick={() => filterDialog.current.close()}><X/></button><CatalogFilters category={filterCategory} filters={filters} onToggle={toggleFilter} onClear={clearFilters} prefix="mobile"/><button className="button filter-apply" onClick={() => filterDialog.current.close()}>Show {visibleProducts.length} Styles<ArrowRight size={15}/></button></dialog>
    <dialog className="mens-quote-dialog" ref={quoteDialog} aria-labelledby="quote-title" onCancel={event => { if (submitting) event.preventDefault(); }} onClose={() => setQuote(null)} onClick={event => { if (!submitting && event.target === event.currentTarget) quoteDialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close quote request" disabled={submitting} onClick={() => quoteDialog.current.close()}><X/></button>{quote && <><div className="quote-product"><Preview product={quote}/><span>{quote.id}</span></div><div className="quote-content"><p className="eyebrow">Let’s Make It Yours</p><h2 id="quote-title">{quote.name}</h2>{quote.selectedColor && <p className="quote-selected-color">Selected color: {quote.selectedColor}</p>}<p className="quote-intro">Tell us about your collection. We’ll help you explore fabrics, sizing and custom branding.</p><form onSubmit={prepareQuote}><fieldset disabled={submitting || submitted} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }}/><div className="quote-form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100}/></label><label>Work email<input name="email" type="email" autoComplete="email" required maxLength={200}/></label></div><div className="quote-form-row"><label>Company<input name="company" autoComplete="organization" maxLength={150}/></label><label>Quantity (pieces)<input name="quantity" type="number" min="1" max="10000000" step="1" required placeholder="e.g. 500"/></label></div><label>Requirements<textarea name="message" rows={3} maxLength={2500} placeholder="Fabric, colors, sizes, delivery date…"/></label><button className="button" type="submit">{submitting ? 'Sending?' : submitted ? 'Request sent' : 'Send Quote Request'}<ArrowRight size={15}/></button></fieldset>{quoteError && <p role="alert">{quoteError}</p>}<p className="quote-email-note" role="status">{submitted ? 'Thank you. Your quote request has been received. Our team will contact you.' : 'Send your requirements to our sourcing team.'}</p></form></div></>}</dialog>
    <dialog className="product-image-dialog" ref={imageDialog} aria-label={viewing ? `${viewing.name} image` : 'Product image'} onClose={() => setViewing(null)} onClick={event => { if (event.target === event.currentTarget) imageDialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close image" onClick={() => imageDialog.current.close()}><X/></button>{viewing && <><div className="product-image-stage"><div className="product-image-stage-content" style={{width:`${imageZoom * 100}%`,height:`${imageZoom * 100}%`}}>{viewing.image ? <img src={viewing.image} alt={viewing.name}/> : <Preview product={viewing}/>}</div></div><div className="product-image-modal-footer"><p>{viewing.name}</p><div className="product-image-zoom-controls" aria-label="Image zoom controls"><button type="button" aria-label="Zoom out" disabled={imageZoom <= 1} onClick={() => setImageZoom(value => Math.max(1, +(value - 0.5).toFixed(1)))}>−</button><span>{Math.round(imageZoom * 100)}%</span><button type="button" aria-label="Zoom in" disabled={imageZoom >= 3} onClick={() => setImageZoom(value => Math.min(3, +(value + 0.5).toFixed(1)))}>+</button><button type="button" onClick={() => setImageZoom(1)}>Reset</button></div></div></>}</dialog>
  </div>;
}

export default function Mens(props) {
  const audience = (props.basePath || '/mens').slice(1);
  const { data, loading, error } = usePublicData(`catalog/${audience}`);
  if (loading) return <CollectionLoading audience={props.audience || 'Men’s'}/>;
  if (error) return <main className="container" style={{ paddingBlock: 60 }}><p role="alert">{error}</p><button className="button" onClick={() => window.location.reload()}>Retry</button></main>;
  if (!data?.categories.length) return <main className="container" style={{ paddingBlock: 60 }}><h1>Collection coming soon</h1><p>Contact us to discuss your sourcing requirements.</p><a className="button" href="/contact">Contact us</a></main>;
  return <Catalog {...props} audience={props.audience || data.collection?.name || "Apparel"} categories={data.categories} catalogProducts={data.products}/>;
}
