import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/mens.css';

export default function Kids() {
  useEffect(() => {
    document.title = 'Kids | Roann Sourcing';
    return () => { document.title = 'Roann Sourcing | Global Apparel Sourcing Partner'; };
  }, []);

  return <div className="mens-page">
    <section className="mens-hero" style={{ '--mens-hero-image': 'url("/images/fabric.jpg")' }} aria-labelledby="kids-title">
      <div className="container">
        <p className="eyebrow">Kids’ Collection</p>
        <h1 id="kids-title">Kids</h1>
        <p className="mens-hero-description">Comfortable apparel for growing children. Discuss fabrics, sizing and custom designs for your next kids’ collection with our sourcing team.</p>
        <a className="button" href="#contact">Discuss Your Collection<ArrowRight size={16}/></a>
      </div>
    </section>
    <section className="mens-contact" id="contact">
      <div className="container">
        <p className="eyebrow">Kids’ Apparel Sourcing</p>
        <h2>Your next collection starts here.</h2>
        <p>Tell us about your kids’ apparel requirements.</p>
        <a className="button" href="/contact">Contact Us<ArrowRight size={16}/></a>
      </div>
    </section>
  </div>;
}
