import LocalizedNumber from '../components/LocalizedNumber';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Boxes, ShieldCheck, Leaf, UsersRound, Globe2, Package, X } from 'lucide-react';
import { products } from '../data/site';
import { productServices, categoryRanges } from '../data/productServices';
import WorldMap from '../components/WorldMap';
import '../styles/products.css';

const benefits = [[Boxes, 'Wide Product Range'], [ShieldCheck, 'Custom Sourcing'], [Leaf, 'Sustainable Options'], [UsersRound, 'Global Supply Chain'], [ShieldCheck, 'Quality Assurance']];
const statistics = [[UsersRound, '15+', 'Years Experience'], [Globe2, '100+', 'Global Clients'], [Package, '500+', 'Products Developed'], [ShieldCheck, '12+', 'Sourcing Regions']];

function Action({ children, href, outline = false, onClick, className = '' }) {
  const styles = `button${outline ? ' button-outline' : ''} ${className}`;
  return onClick ? <button className={styles} onClick={onClick}>{children}<ArrowRight size={17}/></button> : <a className={styles} href={href}>{children}<ArrowRight size={17}/></a>;
}

export default function Products() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => { document.title = 'Our Product | Roann Sourcing'; return () => { document.title = 'Roann Sourcing | Global Apparel Sourcing Partner'; }; }, []);
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  const openCategory = product => { if (['mens', 'womens', 'girls'].includes(product.id)) { window.location.assign(`/${product.id}`); return; } setSelected({ title: `${product.name} Apparel`, image: product.image, alt: `${product.name} apparel collection`, detail: product.description, features: categoryRanges[product.id], kind: 'Product Categories' }); };

  return <div className="products-page">
    <section className="products-hero" aria-labelledby="products-title"><div className="container"><p className="eyebrow">Global Apparel Sourcing Partner</p><h1 id="products-title">Our Product</h1><p className="products-tagline">Apparel solutions for global brands.</p><p className="products-intro">From everyday essentials to fashion-forward collections, we source and develop high-quality apparel across multiple categories for global brands and retailers.</p><div className="button-group"><Action href="#categories">Explore Categories</Action><Action href="#contact" outline>Request Sourcing</Action></div></div></section>
    <div className="product-benefits"><div className="container">{benefits.map(([Icon, label]) => <div key={label}><Icon size={31} strokeWidth={1.3}/><span>{label}</span></div>)}</div></div>

    <section className="product-families" id="categories" aria-labelledby="families-title"><div className="container families-layout"><div className="section-copy"><p className="eyebrow">Product Categories</p><h2 id="families-title">Key Product <br/>Families</h2><p>Versatile apparel solutions across men’s, women’s and girls’ categories, tailored to meet diverse market needs.</p><Action className="categories-desktop-action" onClick={() => setSelected({ kind: 'Product Categories', title: 'Explore All Categories', allCategories: true })}>Explore All Categories</Action></div><div className="family-cards">{products.map(product => <button key={product.id} id={product.id} className={`family-card family-${product.id}`} onClick={() => openCategory(product)} aria-label={`Explore ${product.name} collection`}><img src={product.image} alt={`${product.name} apparel collection`}/><div className="family-card-content"><h3>{product.name}</h3><ul>{categoryRanges[product.id].map(range => <li key={range}>{range}</li>)}</ul></div><span className="family-arrow"><ArrowRight size={22}/></span></button>)}</div><Action className="categories-mobile-action" onClick={() => setSelected({ kind: 'Product Categories', title: 'Explore All Categories', allCategories: true })}>Explore All Categories</Action></div></section>

    <section className="product-ecosystem" id="apparel-solutions" aria-labelledby="ecosystem-title"><div className="container"><div className="ecosystem-heading"><div><p className="eyebrow">Our Product Ecosystem</p><h2 id="ecosystem-title">End-to-End Apparel Solutions</h2></div><p>We offer a complete product ecosystem, from concept and design to final production, giving global brands a reliable and flexible sourcing partner.</p></div><div className="ecosystem-grid">{productServices.map(service => { const Icon = service.icon; return <button className={`ecosystem-card service-${service.id}`} key={service.id} onClick={() => setSelected({ ...service, kind: 'Our Product Ecosystem' })} aria-label={`Learn about ${service.title}`}><img src={service.image} alt={service.alt} loading="lazy"/><div className="ecosystem-card-content"><Icon className="ecosystem-icon" size={28} strokeWidth={1.3}/><div><h3>{service.title}</h3><p>{service.description}</p></div><ArrowRight className="ecosystem-arrow" size={21} strokeWidth={1.4}/></div></button>; })}</div></div></section>

    <section className="product-strength" aria-labelledby="strength-title"><div className="container strength-layout"><WorldMap/><div className="strength-copy"><p className="eyebrow">Our Strength</p><h2 id="strength-title">Why Global Brands<br/>Choose ROANN</h2><p>We combine industry expertise, a trusted supply network and a commitment to quality to deliver apparel solutions that help our clients grow.</p></div><div className="product-statistics">{statistics.map(([Icon, number, label]) => <div key={label}><Icon size={32} strokeWidth={1.3}/><strong><LocalizedNumber value={parseInt(number, 10)} plus/></strong><span>{label}</span></div>)}</div></div></section>

    <section className="product-contact" id="contact"><div className="container"><p className="eyebrow">Let’s Work Together</p><h2>Source Your Next Collection</h2><p>Partner with ROANN for reliable, flexible and high-quality apparel sourcing<br/> solutions tailored to your brand’s needs.</p><div className="button-group"><Action href="mailto:info@roann-sourcing.com?subject=Apparel%20sourcing%20enquiry">Request Sourcing</Action><Action href="/#process" outline>Explore Our Process</Action></div></div></section>

    <dialog className={`product-details-dialog${selected?.allCategories ? ' all-categories-dialog' : ''}`} ref={dialog} aria-labelledby="product-detail-title" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) dialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close product details" onClick={() => dialog.current.close()}><X/></button>{selected && <>{selected.image && <img className="product-detail-image" src={selected.image} alt={selected.alt}/>}<div className="product-detail-copy"><p className="eyebrow">{selected.kind}</p><h2 id="product-detail-title">{selected.title}</h2>{selected.allCategories ? <div className="category-picker">{products.map(product => <button key={product.id} onClick={() => openCategory(product)}><img src={product.image} alt=""/><span>{product.name}<ArrowRight size={18}/></span></button>)}</div> : <><p>{selected.detail}</p><ul>{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Action href={`mailto:info@roann-sourcing.com?subject=${encodeURIComponent(`${selected.title} sourcing enquiry`)}`}>Request Sourcing</Action></>}</div></>}</dialog>
  </div>;
}
