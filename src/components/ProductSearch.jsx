import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { publicRequest } from '../api/public';

const collections = ['mens', 'womens', 'girls'];
const normalize = value => String(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export default function ProductSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled(collections.map(id => publicRequest(`catalog/${id}`, { signal: controller.signal }).then(data => {
      const audience = data.collection?.name || id;
      return data.categories.flatMap(category => {
        const href = `/${id}?category=${encodeURIComponent(category.id)}`;
        return [{ name: category.label || category.title, context: audience, href }, ...data.products
          .filter(product => product.category === category.id)
          .sort((a, b) => a.order - b.order)
          .map(product => ({ name: product.name, context: `${audience} · ${category.label || category.title}`, keywords: `${product.type || ''} ${Object.values(product.attributes || {}).flat().join(' ')}`, href: `${href}&product=${encodeURIComponent(product.id)}#product-${encodeURIComponent(product.id)}` }))];
      });
    }))).then(results => {
      if (controller.signal.aborted) return;
      setEntries(results.flatMap(result => result.status === 'fulfilled' ? result.value : []));
      setFailed(results.some(result => result.status === 'rejected'));
      setLoading(false);
    });
    return () => controller.abort();
  }, []);
  const terms = normalize(query).split(' ').filter(Boolean);
  const results = entries.filter(entry => terms.every(term => normalize(`${entry.name} ${entry.context} ${entry.keywords || ''}`).includes(term)))
    .sort((a, b) => Number(normalize(b.name).startsWith(normalize(query))) - Number(normalize(a.name).startsWith(normalize(query))))
    .slice(0, 8);
  return <div className="search-panel" onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); document.querySelector('.search-toggle')?.focus(); }
  }}><div className="container">
    <label htmlFor="product-search">Find your apparel solution</label>
    <input autoFocus id="product-search" type="search" placeholder="Search shirts, knitwear, dresses…" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={results.length > 0} aria-controls="product-suggestions" aria-activedescendant={active >= 0 ? `product-suggestion-${active}` : undefined} value={query} onChange={event => { setQuery(event.target.value); setActive(-1); }} onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (results.length) setActive(previous => event.key === 'ArrowDown' ? (previous + 1) % results.length : (previous <= 0 ? results.length - 1 : previous - 1));
      }
      if (event.key === 'Enter' && results.length) { event.preventDefault(); window.location.assign(results[active >= 0 ? active : 0].href); }
    }}/>
    <p className="search-feedback" role="status">{loading ? 'Loading suggestions…' : !results.length ? (failed ? 'Some suggestions could not load. Please try again.' : 'No matching items. Try another product name.') : terms.length ? 'Suggested items' : 'Explore our catalog'}</p>
    <ul className="product-suggestions" id="product-suggestions" role="listbox" aria-label="Suggested items">{results.map((result, index) => <li id={`product-suggestion-${index}`} role="option" aria-selected={active === index} key={result.href}><a href={result.href} tabIndex={-1} onClick={onClose} onMouseEnter={() => setActive(index)}><span><strong>{result.name}</strong><small>{result.context}</small></span><ArrowRight size={16}/></a></li>)}</ul>
  </div></div>;
}
