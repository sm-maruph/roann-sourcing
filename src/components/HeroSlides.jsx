import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export default function HeroSlides({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hovered, setHovered] = useState(false);
  const active = index % slides.length;
  useEffect(() => {
    if (paused || hovered || slides.length < 2) return;
    const timer = window.setInterval(() => setIndex(value => (value + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, slides.length, index]);
  return <>
    <div className="hero-slides" aria-hidden="true">{slides.map((slide, position) => <div key={slide.id} className={`hero-slide${position === active ? ' is-active' : ''}`} style={{ backgroundImage: `url("${slide.image_url}")` }}/>)}</div>
    {slides.length > 1 && <div className="hero-slider-controls" role="group" aria-label="Homepage slideshow" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}>
      <button aria-label="Previous slide" onClick={() => setIndex(value => (value - 1 + slides.length) % slides.length)}><ChevronLeft size={18}/></button>
      <div className="hero-slide-dots">{slides.map((slide, position) => <button key={slide.id} aria-label={`Show slide ${position + 1}`} aria-pressed={position === active} onClick={() => setIndex(position)}/>)}</div>
      <button aria-label="Next slide" onClick={() => setIndex(value => (value + 1) % slides.length)}><ChevronRight size={18}/></button>
      <button aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>
    </div>}
  </>;
}
