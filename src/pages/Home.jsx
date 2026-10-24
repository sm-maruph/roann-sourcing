import HeroSlides from '../components/HeroSlides';
import { usePublicData } from '../api/public';
import LocalizedNumber from '../components/LocalizedNumber';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Award, ShieldCheck, Globe2, UsersRound, ScanLine, Boxes, Truck, X, Leaf, BadgeDollarSign } from 'lucide-react';
import { products, steps } from '../data/site';
import WorldMap from '../components/WorldMap';
const processIcons = [UsersRound, ScanLine, Boxes, UsersRound, ShieldCheck, Truck];
function Button({ children, href, outline = false }) { return <a className={`button${outline ? ' button-outline' : ''}`} href={href}>{children}<ArrowRight size={16}/></a>; }
function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }
export default function Home() {
  const { data: content } = usePublicData('content');
  const homeSlides = content?.heroes.filter(item => item.page === 'home' && item.image_url) || [];
  const slides = homeSlides;
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  return <>
    <section className="hero" id="home" ><HeroSlides slides={slides}/><div className="hero-shade"/><div className="container hero-content"><p className="hero-eyebrow">Global apparel sourcing partner</p><h1>Quality<br/>manufacturing<br/><span>for a stronger<br/>tomorrow</span></h1><div className="button-group"><Button href="#process">Our Process</Button><Button href="#contact" outline>Get in Touch</Button></div></div><div className="values-bar"><div className="container values-grid">{[[Award,'Quality','Manufacturing'],[Leaf,'Ethical','Production'],[Globe2,'Global','Supply Chain'],[UsersRound,'Long-term','Partnership']].map(([Icon,a,b]) => <div className="value" key={a}><Icon strokeWidth={1.2}/><span>{a}<br/>{b}</span></div>)}</div></div></section>
    <section className="about section" id="about"><div className="container about-grid"><div className="section-copy"><Eyebrow>About Roann Sourcing</Eyebrow><h2>Your apparel sourcing partner</h2><p>ROANN SOURCING is a global apparel sourcing company connecting international brands with reliable manufacturing partners. We deliver high-quality products, ethical production and tailored solutions — from concept to delivery.</p><Button href="/about">Learn More</Button></div><div className="about-collage"><img className="about-main" src="/images/mens/sweater.jpg" alt="Carefully crafted apparel and tailoring details" loading="lazy"/><div className="about-note">People<br/>Process<br/>Quality<br/>Partnership<span/></div><img className="about-detail" src="/images/fabric.jpg" alt="Premium textile textures" loading="lazy"/></div></div></section>
    <section className="sourcing-benefits section" aria-labelledby="sourcing-benefits-title">
      <div className="container">
        <Eyebrow>The Roann Advantage</Eyebrow>
        <h2 id="sourcing-benefits-title">Why Work With Us</h2>
        <div className="sourcing-benefits-grid">
          {[
            [BadgeDollarSign, 'Best Price', 'Competitive sourcing that balances your budget with the quality your collection deserves.'],
            [Truck, 'Quality & On-Time Shipping', 'Careful quality checks and coordinated shipping to keep your collection on schedule.'],
            [ShieldCheck, 'Compliance', 'Responsible manufacturing with attention to your production and compliance requirements.'],
            [Award, 'Experience', 'Practical apparel expertise to guide your collection from development through delivery.'],
          ].map(([Icon, title, description]) => <article key={title}><Icon size={32} strokeWidth={1.5}/><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </div>
    </section>
    <section className="network" id="network"><div className="container network-inner"><WorldMap/><div className="network-copy"><h2>A Global<br/>Sourcing Network</h2><p>Working with a trusted network of manufacturing partners across key sourcing regions, we help brands bring their ideas to life with reliability, efficiency and transparency.</p></div><div className="stats">{[['22+','Years Experience'],['30+','Global Clients'],['1000+','Products Developed'],['7+','Sourcing Regions']].map(([n,t]) => <div key={t}><strong><LocalizedNumber value={parseInt(n, 10)} plus/></strong><span>{t}</span></div>)}</div></div></section>
    <section className="products section" id="products"><div className="container product-grid"><div className="section-copy"><Eyebrow>Our Product</Eyebrow><h2>Apparel Solutions<br/>for Every Market</h2><p>From everyday essentials to fashion-forward collections, we source and develop high-quality apparel across multiple categories for global brands and retailers.</p><Button href="/products" outline>View All Products</Button></div><div className="product-cards" id="collections">{products.map(p => <button className="product-card" key={p.id} id={p.id} onClick={() => ['mens', 'womens', 'girls'].includes(p.id) ? window.location.assign(`/${p.id}`) : setSelected(p)} aria-label={`Explore ${p.name} collection`}><img src={p.image} alt={`${p.name} apparel collection`} loading="lazy"/><span>{p.name}<ArrowRight size={21}/></span></button>)}</div></div></section>
    <section className="process section" id="process"><div className="container process-grid"><div className="section-copy"><Eyebrow>Our Process</Eyebrow><h2>A Seamless Journey<br/>From Concept to Delivery</h2><p>Our proven sourcing process ensures quality, transparency and on-time delivery — every step of the way.</p><Button href="#contact" outline>Our Process</Button></div><ol className="process-steps">{steps.map((step,i) => { const Icon = processIcons[i]; return <li key={step}><div className="step-icon"><Icon size={23} strokeWidth={1.3}/></div><span className="step-number"><LocalizedNumber value={i + 1} minimumIntegerDigits={2}/></span><span className="step-name">{step}</span>{i<5 && <ArrowRight className="step-arrow" size={19} strokeWidth={1}/>}</li>; })}</ol></div></section>
    <section className="brands section"><div className="container brands-grid"><div className="section-copy"><Eyebrow>Trusted by Global Brands</Eyebrow><h2>Building Long-Term<br/>Partnerships</h2><p>We’re proud to work with leading global brands and retailers who trust us for our commitment to quality, integrity and consistent delivery.</p></div><div className="brand-logos" aria-label="Partner brands">{content ? content.partners.map(partner => partner.image_url ? <a key={partner.id} href={partner.website_url || undefined} aria-label={partner.name}><img src={partner.image_url} alt={partner.name} loading="lazy" style={{ width: '100%', maxWidth: 150, height: 80, objectFit: 'contain' }}/></a> : <span key={partner.id}>{partner.name}</span>) : <><span className="primark">PRIMARK</span><span className="salling">salling<span>group</span></span><span className="kmart"><b>K</b>mart</span><span className="nutmeg">Nutmeg</span><span className="matalan">MATALAN</span><span className="tally">TALLY</span><span className="next">next</span><span className="hm">H&M</span></>}</div></div></section>
    <section className="contact-banner" id="contact"><div className="container"><h2>Let’s Build Something Greater Together</h2><p>Whether you’re developing a new collection or looking for a reliable sourcing partner,<br/> ROANN SOURCING is here to support your growth.</p><Button href="/contact">Contact Us</Button></div></section>
    <dialog ref={dialog} className="collection-dialog" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) dialog.current.close(); }}>{selected && <><button className="dialog-close icon-button" aria-label="Close collection" onClick={() => dialog.current.close()}><X/></button><img src={selected.image} alt={`${selected.name} collection`}/><div><Eyebrow>Our collections</Eyebrow><h2>{selected.name} Apparel</h2><p>{selected.description}</p><p>{selected.items}</p><a className="button" href={`mailto:info@roann-sourcing.com?subject=${encodeURIComponent(`${selected.name} apparel sourcing enquiry`)}`}>Discuss Your Collection <ArrowRight size={16}/></a></div></>}</dialog>
  </>;
}
