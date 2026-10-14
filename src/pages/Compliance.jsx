import LocalizedNumber from '../components/LocalizedNumber';
import { useEffect } from 'react';
import { ArrowRight, ShieldCheck, HeartHandshake, Leaf, Baby, LockKeyhole, Scale, Clock3, Coins, Users, Ban, Building2, Flame, HeartPulse, Handshake, ClipboardCheck } from 'lucide-react';
import '../styles/compliance.css';

const groups = [
  { id: 'people', label: '01 / People & dignity', title: 'Respect starts with the people who make it.', intro: 'Every person deserves a safe workplace, fair treatment and the freedom to be heard.', icon: HeartHandshake, principles: [
    [Baby, 'No child labor', 'Partners must meet legal minimum working-age requirements and protect young workers. Child labor has no place in our supply chain.'],
    [LockKeyhole, 'Freely chosen employment', 'We do not accept forced, bonded or involuntary labor. Workers must be free to leave employment and retain their identity documents.'],
    [Handshake, 'Dignity at work', 'Harassment, intimidation, physical punishment and abuse are unacceptable. Disciplinary procedures must be fair and lawful.'],
    [Ban, 'Equal opportunity', 'Employment decisions should reflect skills and ability, without discrimination based on race, religion, gender or personal background.'],
    [Users, 'Freedom of association', 'We respect workers’ rights to organize, join associations and bargain collectively without retaliation.'],
  ] },
  { id: 'workplace', label: '02 / Fair & safe workplaces', title: 'Better conditions. Stronger partnerships.', intro: 'Responsible production means protecting workers’ wellbeing throughout the working day.', icon: ShieldCheck, principles: [
    [Clock3, 'Responsible working hours', 'Working hours and overtime must comply with applicable laws. Partners should plan reasonable schedules, rest periods and regular days off.'],
    [Coins, 'Fair wages & benefits', 'Workers must receive at least legally required wages and benefits, paid on time, with clear and transparent payment records.'],
    [HeartPulse, 'Health & safety', 'Workplaces must provide safe equipment, appropriate training, sanitation and access to drinking water and first aid.'],
    [Flame, 'Building & fire safety', 'Partners must maintain safe buildings, accessible exits and fire precautions, with emergency procedures and worker training.'],
  ] },
  { id: 'integrity', label: '03 / Integrity & environment', title: 'Accountability in every decision.', intro: 'Trust is built through transparent practices and care for the world we share.', icon: Leaf, principles: [
    [Scale, 'Legal compliance', 'Business partners must follow applicable labor, health, safety and environmental laws in the countries where they operate.'],
    [Handshake, 'Ethical business practices', 'We expect honest communication, respect for buyer codes of conduct and business decisions free from bribery or corruption.'],
    [Building2, 'Authorized production', 'Production must take place at approved facilities. Subcontracting requires prior approval and visibility into the manufacturing partner.'],
    [Leaf, 'Environmental responsibility', 'Partners should reduce waste, handle chemicals responsibly and use energy and water efficiently while meeting environmental requirements.'],
  ] },
];

export default function Compliance() {
  useEffect(() => { document.title = 'Compliance & Ethics | Roann Sourcing'; return () => { document.title = 'Roann Sourcing | Global Apparel Sourcing Partner'; }; }, []);
  return <div className="ethics-page">
    <section className="ethics-hero" aria-labelledby="ethics-title"><div className="container ethics-hero-grid"><div><p className="eyebrow">Responsible sourcing / Lasting trust</p><h1 id="ethics-title">Compliance<br/>& <span>Ethics</span></h1><p className="ethics-hero-copy">Quality begins with integrity. We believe great apparel should respect the people who make it and the world we all share.</p><a className="button" href="#our-principles">Explore Our Principles <ArrowRight size={16}/></a></div><div className="ethics-hero-note"><ShieldCheck size={36} strokeWidth={1.3}/><p>Our commitment</p><h2>Responsible by principle.<br/>Considered at every step.</h2><span>People. Partnerships. Planet.</span></div></div></section>
    <div className="ethics-pillars"><div className="container">{[[HeartHandshake, 'People first', 'Dignity, fairness & respect'], [ShieldCheck, 'Workplace wellbeing', 'Safe, responsible production'], [Leaf, 'Shared responsibility', 'Integrity & environmental care']].map(([Icon, title, copy]) => <div key={title}><Icon size={29} strokeWidth={1.4}/><div><strong>{title}</strong><span>{copy}</span></div></div>)}</div></div>
    <section className="ethics-intro container" id="our-principles"><div><p className="eyebrow">Our guiding principles</p><h2>A shared standard.<br/>A stronger supply chain.</h2></div><div><p>Our sourcing expectations are informed by internationally recognized human rights principles, core labor standards and applicable local laws. We seek manufacturing partners who share our commitment to ethical, safe and responsible production.</p><nav className="ethics-jump-links" aria-label="Compliance principles">{groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.id === 'people' ? 'People & dignity' : group.id === 'workplace' ? 'Fair & safe workplaces' : 'Integrity & environment'}<ArrowRight size={14}/></a>)}</nav></div></section>
    {groups.map(({ id, label, title, intro, icon: Icon, principles }) => <section className="ethics-group" id={id} key={id}><div className="container ethics-group-grid"><div className="ethics-group-heading"><Icon size={34} strokeWidth={1.3}/><p className="eyebrow">{label}</p><h2>{title}</h2><p>{intro}</p></div><div className="ethics-principles">{principles.map(([PrincipleIcon, name, description]) => <article key={name}><PrincipleIcon size={23} strokeWidth={1.5}/><div><h3>{name}</h3><p>{description}</p></div></article>)}</div></div></section>)}
    <section className="ethics-process"><div className="container"><div className="ethics-process-heading"><div><p className="eyebrow">From principles to practice</p><h2>Responsibility is an ongoing conversation.</h2></div><ClipboardCheck size={42} strokeWidth={1.3}/></div><div className="ethics-process-steps">{[['01', 'Align expectations', 'Discuss buyer requirements, codes of conduct and the standards each collection needs.'], ['02', 'Review the partner', 'Request relevant facility information and supporting compliance documentation.'], ['03', 'Address & improve', 'Discuss concerns, agree on corrective actions and follow up with manufacturing partners.']].map(([number, title, copy]) => <article key={number}><span><LocalizedNumber value={parseInt(number, 10)} minimumIntegerDigits={2}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div><p className="ethics-document-note">Certification and audit documentation depend on the facility and product. Contact our team to discuss requirements and request relevant records.</p></div></section>
    <section className="contact-banner ethics-contact" id="contact"><div className="container"><p className="eyebrow">Build trust. Create better.</p><h2>Let’s make responsible sourcing a shared priority.</h2><p>Discuss your compliance requirements or raise a sourcing concern with our team.</p><a className="button" href="mailto:info@roann-sourcing.com?subject=Compliance%20%26%20Ethics%20Enquiry">Talk to Our Team <ArrowRight size={16}/></a></div></section>
  </div>;
}
