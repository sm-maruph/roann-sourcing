import { useState } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import ProductSearch from './ProductSearch';
import LanguageSelector from './LanguageSelector';
import { usePublicData } from '../api/public';
import '../styles/navigation.css';
import { navigation } from '../data/site';
export default function Header() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const [menu, setMenu] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [search, setSearch] = useState(false);
  const { data: categoryData } = usePublicData('navigation/categories');
  const staticNavigation = navigation.filter(([, href]) => href !== '/products' && !['/mens', '/womens', '/girls'].includes(href));
  const collections = Object.entries(categoryData || {});
  const navLinks = [...staticNavigation.slice(0, 2), ...collections.map(([slug, collection]) => [collection.name, `/${slug}`]), ...staticNavigation.slice(2)];
  const collectionsByPath = Object.fromEntries(collections.map(([slug, collection]) => [`/${slug}`, collection]));
  return <header className="header"><div className="container header-inner"><Logo/><nav className={menu ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{navLinks.map(([name, href]) => {
    const collection = collectionsByPath[href];
    if (!collection) return <a className={href === currentPath ? 'active' : ''} aria-current={href === currentPath ? 'page' : undefined} href={href} key={href} onClick={() => setMenu(false)}>{name}</a>;
    const categories = collection?.categories || [];
    return <div className={`nav-category${openCategory === href ? ' is-expanded' : ''}`} key={href} onKeyDown={event => { if (event.key === 'Escape') { setOpenCategory(null); event.currentTarget.querySelector('button')?.focus(); } }}><div className="nav-category-heading"><a className={href === currentPath ? 'active' : ''} aria-current={href === currentPath ? 'page' : undefined} href={href} onClick={() => setMenu(false)}>{name}</a>{categories.length > 0 && <button className="nav-category-toggle" aria-label={`Show ${name} subcategories`} aria-expanded={openCategory === href} aria-controls={`nav-${href.slice(1)}`} onClick={() => setOpenCategory(openCategory === href ? null : href)}><ChevronDown size={13}/></button>}</div>{categories.length > 0 && <ul className="nav-subcategories" id={`nav-${href.slice(1)}`}>{categories.map(category => <li key={category.id}><a href={`${href}?category=${category.id}`} onClick={() => { setMenu(false); setOpenCategory(null); }}>{category.label}</a>{category.subcategories?.length > 0 && <ul className="nav-subcategory-children">{category.subcategories.map(subcategory => <li key={subcategory.id}><a href={`${href}?category=${category.id}&subcategory=${subcategory.id}`} onClick={() => { setMenu(false); setOpenCategory(null); }}>{subcategory.label}</a></li>)}</ul>}</li>)}</ul>}</div>;
  })}<a className="button" href="/contact" onClick={() => setMenu(false)}>Contact Us</a></nav><LanguageSelector/><button className="icon-button search-toggle" aria-label="Search products" aria-expanded={search} onClick={() => setSearch(!search)}>{search ? <X size={18}/> : <Search size={18}/>}</button><button className="icon-button menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div>{search && <ProductSearch onClose={() => setSearch(false)}/>}</header>;
}
