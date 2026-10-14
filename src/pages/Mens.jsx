import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronRight, SlidersHorizontal, X, Shirt, ShieldCheck, Leaf, Globe2, Handshake } from 'lucide-react';
import { mensCategories, mensProducts } from '../data/mens';
import GarmentPreview from '../components/GarmentPreview';
import CatalogFilters from '../components/CatalogFilters';
import { girlColors } from '../data/girls';
import '../styles/mens.css';

function categoryFromUrl(categories) {
  const id = new URLSearchParams(window.location.search).get('category');
  return categories.some(category => category.id === id) ? id : 't-shirts';
}

export default function Mens({ categories = mensCategories, catalogProducts = mensProducts, basePath = '/mens', audience = 'Men’s', Preview = GarmentPreview, women = false, girls = false }) {
  const [categoryId, setCategoryId] = useState(() => categoryFromUrl(categories));
  const [tab, setTab] = useState('All');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('featured');
  const [quote, setQuote] = useState(null);
  const [colorChoices, setColorChoices] = useState({});
  const [emailReady, setEmailReady] = useState(false);
  const filterDialog = useRef(null);
  const quoteDialog = useRef(null);
  const category = categories.find(item => item.id === categoryId);
  useEffect(() => {
    const onPopState = () => { setCategoryId(categoryFromUrl(categories)); setFilters({}); setTab('All'); setSort('featured'); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [categories]);
  useEffect(() => { document.title = `${audience} ${category.title} | Roann Sourcing`; }, [category.title, audience]);
  useEffect(() => { if (quote) { setEmailReady(false); quoteDialog.current?.showModal(); } }, [quote]);

  function changeCategory(event, id) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setCategoryId(id); setTab('All'); setFilters({}); setSort('featured');
    window.history.pushState({}, '', `${basePath}?category=${id}`);
  }
  function toggleFilter(group, value) {
    setFilters(previous => {
      const current = previous[group] || [];
      return { ...previous, [group]: current.includes(value) ? current.filter(item => item !== value) : [...current, value] };
    });
  }
  const visibleProducts = useMemo(() => {
    const result = catalogProducts.filter(product => product.category === categoryId && (tab === 'All' || product.type === tab) && Object.entries(filters).every(([group, choices]) => !choices.length || choices.some(choice => Array.isArray(product.attributes[group]) ? product.attributes[group].includes(choice) : choice === product.attributes[group])));
    return result.sort(sort === 'az' ? (a, b) => a.name.localeCompare(b.name) : sort === 'za' ? (a, b) => b.name.localeCompare(a.name) : sort === 'latest' ? (a, b) => b.order - a.order : (a, b) => a.order - b.order);
  }, [categoryId, tab, filters, sort, catalogProducts]);
  const filterCount = Object.values(filters).flat().length;
  const clearFilters = () => { setFilters({}); setTab('All'); };

  function prepareQuote(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Hello Roann Sourcing,\n\nI would like a quote for ${quote.name} (${quote.id}).\n\nColor: ${quote.selectedColor || 'To be discussed'}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company') || 'Not specified'}\nQuantity: ${data.get('quantity')} pieces\nRequirements: ${data.get('message') || 'Please share available customization and sourcing options.'}\n`;
    window.location.href = `mailto:info@roann-sourcing.com?subject=${encodeURIComponent(`Quote request: ${quote.name} — ${quote.id}`)}&body=${encodeURIComponent(body)}`;
    setEmailReady(true);
  }

  return <div className={`mens-page${women ? ' womens-page' : ''}${girls ? ' girls-page' : ''}`}>
    <nav className="mens-category-nav" aria-label={`${audience} apparel categories`}><div className="container"><span>{audience} Collection</span>{categories.map(item => <a href={`${basePath}?category=${item.id}`} key={item.id} className={categoryId === item.id ? 'selected' : ''} aria-current={categoryId === item.id ? 'page' : undefined} onClick={event => changeCategory(event, item.id)}>{item.label}</a>)}</div></nav>
    <section className={`mens-hero mens-hero-${categoryId}`} style={{ '--mens-hero-image': `url("${category.hero}")` }} aria-labelledby="mens-title"><div className="container"><nav className="mens-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={12}/><a href={basePath}>{audience}</a><ChevronRight size={12}/><span>{category.label}</span></nav><p className="eyebrow">{girls ? "Girls’ Collection" : audience}</p><h1 id="mens-title">{girls && <span>Girls’<br/></span>}{category.title}</h1>{women && <p className="womens-hero-tagline">{category.tagline}</p>}<p className="mens-hero-description">{category.description}</p>{women ? <button className="button" onClick={() => setQuote({id: `Custom ${category.label}`,name: `${audience} ${category.label}`,category: category.id,type: category.tabs[1],color: '#bab4a7',pattern: 'plain'})}>Request a Quote<ArrowRight size={14}/></button> : <span className="mens-hero-tagline">{category.tagline}</span>}</div></section>

    {women && <div className="womens-benefits"><div className="container">{category.benefits.map((label, i) => { const Icon = [Globe2, Leaf, Shirt, ShieldCheck][i]; return <div key={label}><Icon size={22} strokeWidth={1.3}/><span>{label}</span></div>; })}</div></div>}
    <section className="mens-catalog" aria-label={`${category.title} product catalog`}><div className="container catalog-layout"><aside className="catalog-sidebar" aria-label="Product filters"><CatalogFilters category={category} filters={filters} onToggle={toggleFilter} onClear={clearFilters}/></aside><div className="catalog-main">{girls && <div className="girls-dropdowns"><span>Filter by:</span>{Object.entries(category.filters).map(([group, options]) => <label key={group}><span className="sr-only">{group}</span><select aria-label={`Filter by ${group}`} value={filters[group]?.[0] || ""} onChange={event => setFilters(previous => ({...previous,[group]:event.target.value ? [event.target.value] : []}))}><option value="">All {group === "Age Group" ? "Age Groups" : `${group}s`}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>)}</div>}<div className="catalog-toolbar"><button className="mobile-filter-button" onClick={() => filterDialog.current.showModal()}><SlidersHorizontal size={16}/>Filter{filterCount > 0 && <span>{filterCount}</span>}</button><div className="catalog-types" role="group" aria-label="Product types">{category.tabs.map(type => <button key={type} className={type === tab ? 'selected' : ''} aria-pressed={type === tab} onClick={() => setTab(type)}>{type}</button>)}</div><label className="catalog-sort"><span>Sort by:</span><select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="latest">Latest</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option></select></label></div><div className="catalog-summary"><p role="status">{visibleProducts.length} {visibleProducts.length === 1 ? 'style' : 'styles'} in {category.label}</p><span>Designed for your brand.</span></div>{(filterCount > 0 || tab !== 'All') && <div className="active-filters">{tab !== 'All' && <button onClick={() => setTab('All')}>{tab}<X size={12}/></button>}{Object.entries(filters).flatMap(([group, choices]) => choices.map(choice => <button key={`${group}-${choice}`} onClick={() => toggleFilter(group, choice)}>{choice}<X size={12}/></button>))}<button className="clear-filters" onClick={clearFilters}>Clear all</button></div>}
    {visibleProducts.length ? <div className="mens-product-grid">{visibleProducts.map(original => { const product = girls ? {...original,color:girlColors[colorChoices[original.id] || original.colors[0]], selectedColor:colorChoices[original.id] || original.colors[0]} : original; return <article className="mens-product-card" key={product.id}><button className="mens-product-image" aria-label={`View ${product.name}`} onClick={() => setQuote(product)}><Preview product={product}/><span className="product-image-label">ROANN / {category.label}</span></button><div className="mens-product-info"><h2>{product.name}</h2><p>{women ? product.subtitle : product.id}</p>{girls ? <div className="girls-card-actions"><div className="girls-swatches" role="group" aria-label={`${product.name} colors`}>{product.colors.map(color => <button key={color} className={product.selectedColor === color ? "selected" : ""} style={{background:girlColors[color]}} aria-label={`${product.name}: ${color}`} aria-pressed={product.selectedColor === color} onClick={() => setColorChoices(previous => ({...previous,[product.id]:color}))}/>)}</div><button className="girls-quote-arrow" aria-label={`Request quote for ${product.name}`} onClick={() => setQuote(product)}><ArrowRight size={17}/></button></div> : <button className="button" onClick={() => setQuote(product)}>Request Quote<ArrowRight size={13}/></button>}</div></article>; })}</div> : <div className="catalog-empty"><Shirt size={38} strokeWidth={1}/><h2>No matching styles</h2><p>Try another combination of filters, or ask us about a custom design.</p><button className="button" onClick={clearFilters}>Reset Filters<ArrowRight size={15}/></button></div>}
    <div className="catalog-footnote"><ShieldCheck size={16}/><p>Custom fabrics, colors and branding available. Photos and illustrations are style references.</p></div></div></div></section>

    {girls && <section className="girls-custom-banner"><div className="container"><img src={category.bannerImage} alt={`${category.label} sourcing materials`} loading="lazy"/><div><h2>{category.banner}</h2><p>{category.bannerCopy}</p><a className="button" href={`mailto:info@roann-sourcing.com?subject=${encodeURIComponent(`Girls ${category.label} custom sourcing`)}`}>Request a Quote<ArrowRight size={15}/></a></div></div></section>}
    <section className="mens-promise"><div className="container">{[[ShieldCheck, 'Quality Manufacturing'], [Leaf, 'Ethical Production'], [Globe2, 'Global Supply Chain'], [Handshake, 'Long-Term Partnership']].map(([Icon, label]) => <div key={label}><Icon size={28} strokeWidth={1.2}/><span>{label}</span></div>)}</div></section>
    <section className="mens-contact" id="contact"><div className="container"><p className="eyebrow">One Supply Partner. Endless Possibilities.</p><h2>Your next collection starts here.</h2><p>Let’s build {audience.toLowerCase()} apparel that brings your brand’s vision to life.</p><a className="button" href={`mailto:info@roann-sourcing.com?subject=${encodeURIComponent(`${audience} ${category.label} sourcing enquiry`)}`}>Discuss Your Collection<ArrowRight size={16}/></a></div></section>

    <dialog className="mens-filter-dialog" ref={filterDialog} aria-label="Filter products" onClick={event => { if (event.target === event.currentTarget) filterDialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close filters" onClick={() => filterDialog.current.close()}><X/></button><CatalogFilters category={category} filters={filters} onToggle={toggleFilter} onClear={clearFilters} prefix="mobile"/><button className="button filter-apply" onClick={() => filterDialog.current.close()}>Show {visibleProducts.length} Styles<ArrowRight size={15}/></button></dialog>
    <dialog className="mens-quote-dialog" ref={quoteDialog} aria-labelledby="quote-title" onClose={() => setQuote(null)} onClick={event => { if (event.target === event.currentTarget) quoteDialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close quote request" onClick={() => quoteDialog.current.close()}><X/></button>{quote && <><div className="quote-product"><Preview product={quote}/><span>{quote.id}</span></div><div className="quote-content"><p className="eyebrow">Let’s Make It Yours</p><h2 id="quote-title">{quote.name}</h2>{quote.selectedColor && <p className="quote-selected-color">Selected color: {quote.selectedColor}</p>}<p className="quote-intro">Tell us about your collection. We’ll help you explore fabrics, sizing and custom branding.</p><form onSubmit={prepareQuote}><div className="quote-form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100}/></label><label>Work email<input name="email" type="email" autoComplete="email" required maxLength={200}/></label></div><div className="quote-form-row"><label>Company<input name="company" autoComplete="organization" maxLength={150}/></label><label>Quantity (pieces)<input name="quantity" type="number" min="1" max="10000000" step="1" required placeholder="e.g. 500"/></label></div><label>Requirements<textarea name="message" rows={3} maxLength={2500} placeholder="Fabric, colors, sizes, delivery date…"/></label><button className="button" type="submit">Prepare Email Enquiry<ArrowRight size={15}/></button><p className="quote-email-note" role="status">{emailReady ? 'Your email draft is ready in your email app. Review it and send it to complete your enquiry.' : 'Opens your email app with your request. Nothing is submitted from this website.'}</p></form></div></>}</dialog>
  </div>;
}
