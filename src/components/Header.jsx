import { useState } from 'react';
import { Menu, X, Search, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { navigation, products } from '../data/site';
export default function Header() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const results = products.filter(p => `${p.name} ${p.items}`.toLowerCase().includes(query.toLowerCase()));
  return <header className="header"><div className="container header-inner"><Logo/><nav className={menu ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{navigation.map(([name, href]) => <a className={(href === currentPath) ? 'active' : ''} aria-current={(href === currentPath) ? 'page' : undefined} href={href} key={href} onClick={() => setMenu(false)}>{name}</a>)}<a className="button" href="#contact" onClick={() => setMenu(false)}>Contact Us</a></nav><button className="icon-button search-toggle" aria-label="Search products" aria-expanded={search} onClick={() => setSearch(!search)}>{search ? <X size={18}/> : <Search size={18}/>}</button><button className="icon-button menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div>{search && <div className="search-panel"><div className="container"><label htmlFor="product-search">Find your apparel solution</label><input autoFocus id="product-search" placeholder="Search shirts, knitwear, dresses…" value={query} onChange={e => setQuery(e.target.value)}/><div className="search-results">{results.map(p => <a href={['mens', 'womens', 'girls'].includes(p.id) ? `/${p.id}` : `/products#${p.id}`} key={p.id} onClick={() => setSearch(false)}>{p.name}<ArrowRight size={16}/></a>)}{!results.length && <p>No matching collection. Try “shirts” or “knitwear”.</p>}</div></div></div>}</header>;
}
