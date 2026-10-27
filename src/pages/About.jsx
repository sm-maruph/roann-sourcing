import { usePublicData } from '../api/public';
import LocalizedNumber from '../components/LocalizedNumber';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Target, Eye, X, ArrowUp } from 'lucide-react';
import AboutGallery from '../components/AboutGallery';
import WorldMap from '../components/WorldMap';
import { strengths, values } from '../data/about';
import '../styles/about.css';

const images = {
  sewing: { src: '/images/sewing.jpg', alt: 'A garment being stitched on a sewing machine' },
  apparel: { src: '/images/hero.jpg', alt: 'A carefully selected collection of apparel on a clothing rail' },
  fabric: { src: '/images/textile.jpg', alt: 'Thread, scissors and measuring tape for apparel development' },
  export: { src: '/images/export.webp', alt: 'Shipping containers ready for export by cargo ship' },
  studio: { src: '/images/fabric.jpg', alt: 'A collection of garments arranged on hangers' },
  team: { src: '/images/mens/denim.jpg', alt: 'Folded denim garments showing fabric and construction details' },
};

function LinkButton({ href, children, outline = false, onClick }) {
  const className = `button${outline ? ' button-outline' : ''}`;
  return onClick ? <button className={className} onClick={onClick}>{children}<ArrowRight size={15}/></button> : <a className={className} href={href}>{children}<ArrowRight size={15}/></a>;
}

export default function About() {
  const { data: content } = usePublicData('content');
  const hero = content?.heroes.find(item => item.page === 'about');
  const [details, setDetails] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    document.title = 'About Us | Roann Sourcing';
    return () => { document.title = 'Roann Sourcing | Global Apparel Sourcing Partner'; };
  }, []);
  useEffect(() => { if (details) dialog.current?.showModal(); }, [details]);

  return <div className="about-page">
    <section style={hero?.image_url ? { '--about-hero-image': `url("${hero.image_url}")` } : undefined} className="about-hero" id="about-top" aria-labelledby="about-title">
      <div className="container">
        <p className="eyebrow">About Roann Sourcing</p>
        <h1 id="about-title">About Us</h1>
        <p className="about-hero-tagline">Sourcing today<br/>for a stronger tomorrow</p>
        <p className="about-hero-description">We connect global brands with trusted manufacturing partners, delivering quality, sustainability and long-term value through apparel sourcing.</p>
        <LinkButton href="#our-story">Our Story</LinkButton>
      </div>
    </section>

    <section className="about-company about-section" id="our-company">
      <div className="container about-content-grid">
        <div className="section-copy"><p className="eyebrow">Our Company</p><h2>Your apparel sourcing partner</h2><p>ROANN SOURCING is a global apparel sourcing company connecting international brands with reliable manufacturing partners. We deliver high-quality products, ethical production and tailored solutions — from concept to delivery.</p><LinkButton href="#mission">Learn More</LinkButton></div>
        <AboutGallery images={[images.sewing, images.apparel]} statement={['People', 'Products', 'Partnerships', 'A stronger', 'tomorrow']}/>
      </div>
    </section>

    <section className="about-ceo" aria-labelledby="ceo-message-title">
      <div className="container">
        <h2 id="ceo-message-title">Message from<span>CEO</span></h2>
        <img className="ceo-portrait" src="/images/Professional%20CEO%20Portrait%20on%20Charcoal%20Black.png" alt="Nazim Akter, CEO of Roann Sourcing" loading="lazy"/>
        <figure className="ceo-message">
          <figcaption>Nazim Akter<span className="ceo-role">CEO, Roann Sourcing</span></figcaption>
          <blockquote><p>“Every garment carries a promise—to the brand that imagines it, the people who make it, and the person who wears it. At Roann Sourcing, we honor that promise, from the first conversation to the final stitch.”</p></blockquote>
        </figure>
        <address className="ceo-contact">
          <p>House: 42 (2nd Floor), Road: 17, Sector: 13.<br/>Uttara, Dhaka-1230, Bangladesh.</p>
          <a href="mailto:nazim@roannsourcing.com">nazim@roannsourcing.com</a>
          <a href="tel:+8801711370097">+880 1711-370097</a>
        </address>
      </div>
    </section>

    <section className="about-mission" id="mission" aria-label="Our mission and vision">
      <div className="container mission-grid">
        <article><Target className="mission-icon" size={37} strokeWidth={1.5}/><h2>Our Mission</h2><p>To provide world-class apparel sourcing solutions that create value for our partners through quality, innovation and responsible manufacturing.</p></article>
        <article><Eye className="mission-icon" size={38} strokeWidth={1.5}/><h2>Our Vision</h2><p>To be a leading global sourcing partner recognized for integrity, excellence and a more sustainable fashion industry.</p></article>
        <div className="mission-art" aria-hidden="true"><img src="/images/fabric.jpg" alt=""/><span>People<br/>Fashion<br/>Sustainability<br/>Global impact<i/></span></div>
      </div>
    </section>

    <section className="about-story about-section" id="our-story">
      <div className="container about-content-grid">
        <div className="section-copy"><p className="eyebrow">Our Story</p><h2>A Journey Built on Partnership<br/>and Collaboration</h2><p>Founded with a simple belief — better fashion is possible through stronger partnerships. ROANN SOURCING brings together global brands and experienced manufacturers to create high-quality apparel that people love to wear.</p><LinkButton href="#our-people" outline>Our Story</LinkButton></div>
        <AboutGallery images={[images.fabric, images.sewing, images.apparel, images.export]}/>
      </div>
    </section>

    <section className="about-strengths" id="our-strengths">
      <div className="container"><p className="eyebrow">Our Strengths</p><h2>What Sets Us Apart</h2><div className="strengths-grid">{strengths.map(({ icon: Icon, title, description }) => <article key={title}><Icon size={39} strokeWidth={1.25}/><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div>
    </section>

    <section className="about-reach" id="global-reach">
      <div className="container"><WorldMap/><div className="reach-copy"><p className="eyebrow">Global Reach</p><h2>A Truly Global Sourcing Network</h2><p>We work with a trusted network of manufacturing partners across key sourcing regions, helping brands bring their ideas to life with reliability, efficiency and transparency.</p></div><div className="stats">{[['22+', 'Years Experience'], ['30+', 'Global Clients'], ['1000+', 'Products Developed'], ['7+', 'Sourcing Regions']].map(([number, label]) => <div key={label}><strong><LocalizedNumber value={parseInt(number, 10)} plus/></strong><span>{label}</span></div>)}</div></div>
    </section>

    <section className="about-people about-section" id="our-people">
      <div className="container about-content-grid"><div className="section-copy"><p className="eyebrow">Our People & Partners</p><h2>People Behind<br/>A Stronger Tomorrow</h2><p>Our success is built on the people we work with — our team, manufacturing partners and global clients who share our commitment to quality and a more responsible fashion industry.</p><LinkButton outline onClick={() => setDetails('team')}>Meet Our Team</LinkButton></div><AboutGallery images={[images.team, images.studio, images.apparel]}/></div>
    </section>

    <section className="about-values" aria-labelledby="values-title"><div className="container"><h2 className="eyebrow" id="values-title">Our Values</h2><div className="values-list">{values.map(({icon: Icon, title, description}) => <article key={title}><Icon size={31} strokeWidth={1.4}/><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>


    <section className="contact-banner about-contact" id="contact"><div className="container"><p className="eyebrow">Let’s Work Together</p><h2>Build Something Greater Together</h2><p>Partner with ROANN SOURCING for reliable, innovative and responsible apparel sourcing solutions.</p><LinkButton href="/contact">Contact Us</LinkButton></div></section>
    <a className="about-back-top" href="#about-top" aria-label="Back to top"><ArrowUp size={18}/></a>

    <dialog className="about-dialog" ref={dialog} aria-labelledby="about-dialog-title" onClose={() => setDetails(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><button className="icon-button dialog-close" aria-label="Close details" onClick={() => dialog.current.close()}><X/></button>{details === 'team' ? <><p className="eyebrow">Our People & Partners</p><h2 id="about-dialog-title">Let’s meet your sourcing team</h2><p>Great collections start with a conversation. Connect with us to discuss product development, manufacturing partnerships, quality assurance and your next apparel collection.</p><LinkButton href="mailto:nazim@roannsourcing.com?subject=Meet%20the%20Roann%20Sourcing%20team">Introduce Yourself</LinkButton></> : <><p className="eyebrow">Responsible Manufacturing</p><h2 id="about-dialog-title">Confidence at every stage</h2><p>Quality control, responsible working conditions and environmental practices are central to our approach to sourcing.</p><p>Certification requirements and documentation depend on the manufacturing partner and product. Contact our team to discuss the standards your collection needs and request supporting documentation.</p><LinkButton href="mailto:nazim@roannsourcing.com?subject=Manufacturing%20compliance%20enquiry">Discuss Your Requirements</LinkButton></>}</dialog>
  </div>;
}
