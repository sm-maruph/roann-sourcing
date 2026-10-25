import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ContentImage({ className = '', src, alt = '', zoomOnHover = true, zoomOnClick = false, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const lastTap = useRef(0);
  useEffect(() => {
    if (!zoomed) return undefined;
    const closeOnEscape = event => { if (event.key === 'Escape') setZoomed(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [zoomed]);
  if (!src || failed) return <span className={`content-image-box ${className}`} aria-hidden="true"/>;
  const touchCapable = () => window.matchMedia('(hover: none)').matches;
  const touchEnd = event => {
    if (!touchCapable()) return;
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - lastTap.current < 350) setZoomed(true);
    lastTap.current = now;
  };
  return <span className={`content-image-box ${loaded ? 'is-loaded' : ''} ${className}`}>
    {!loaded && <span className="content-image-loader" aria-hidden="true"/>}
    <img {...props} src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} onMouseEnter={() => { if (zoomOnHover && !touchCapable() && loaded) setZoomed(true); }} onClick={event => { if (zoomOnClick && loaded) { event.stopPropagation(); setZoomed(true); } else if (touchCapable()) event.stopPropagation(); }} onTouchEnd={touchEnd}/>
    {zoomed && createPortal(<div className="image-zoom-viewer" role="dialog" aria-modal="true" aria-label={`${alt || 'Image'} enlarged view`} onMouseLeave={() => { if (!touchCapable() && !zoomOnClick) setZoomed(false); }} onClick={() => setZoomed(false)}><button className="image-zoom-close" aria-label="Close enlarged image" onClick={() => setZoomed(false)}>×</button><img src={src} alt={alt}/></div>, document.body)}
  </span>;
}
