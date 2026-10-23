import { publicRequest } from '../api/public';
import { useEffect, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { contactEmail } from '../data/contact';
import '../styles/contact.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    document.title = 'Contact Us | Roann Sourcing';
    return () => { document.title = 'Roann Sourcing | Global Apparel Sourcing Partner'; };
  }, []);

  async function prepareEmail(event) {
    event.preventDefault();
    if (busy || submitted) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setError('');
    try {
      await publicRequest('quotes', { method: 'POST', body: JSON.stringify({
        name: data.get('name'), email: data.get('email'), company: data.get('company'),
        product_name: data.get('subject'), message: data.get('message'), quantity: null,
        website: data.get('website') || '',
      }) });
      setSubmitted(true);
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  return <section className="contact-page" aria-labelledby="contact-title">
    <div className="container contact-page-grid">
      <div className="contact-page-copy">
        <p className="eyebrow">Let’s Work Together</p>
        <h1 id="contact-title">Contact Us</h1>
        <p>Tell us about your collection, ask a question or discuss your sourcing needs with our team.</p>
        <a className="contact-email" href={`mailto:${contactEmail}`}><Mail size={19}/>{contactEmail}</a>
        <img src="/images/fabric.jpg" alt="Apparel fabrics and garment details"/>
      </div>
      <form className="contact-form" onSubmit={prepareEmail}>
        <h2>Send an Enquiry</h2>
        <p className="contact-form-note">Send your enquiry directly to our sourcing team.</p>
        <fieldset disabled={busy || submitted} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }}/><div className="contact-form-row">
          <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span><input id="contact-name" name="name" autoComplete="name" required maxLength={100}/></label>
          <label htmlFor="contact-email">Your email <span aria-hidden="true">*</span><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={200}/></label>
        </div>
        <label htmlFor="contact-company">Company (optional)<input id="contact-company" name="company" autoComplete="organization" maxLength={150}/></label>
        <label htmlFor="contact-subject">Subject <span aria-hidden="true">*</span><input id="contact-subject" name="subject" required maxLength={120}/></label>
        <label htmlFor="contact-message">Your message <span aria-hidden="true">*</span><textarea id="contact-message" name="message" required rows={6} maxLength={2500}/></label>
        <button className="button" type="submit">{busy ? 'Sending?' : submitted ? 'Enquiry sent' : 'Send Enquiry'}<ArrowRight size={16}/></button>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        {submitted && <p role="status">Thank you. Your enquiry has been received. Our team will contact you.</p>}
      </form>
    </div>
  </section>;
}
