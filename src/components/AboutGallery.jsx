export default function AboutGallery({ images, statement }) {
  return <div className={`about-gallery${statement ? ' about-gallery-statement' : ''}`}>
    {images.map(({ src, alt, position }) => <img key={src} src={src} alt={alt} style={position ? { objectPosition: position } : undefined} loading="lazy" />)}
    {statement && <div className="gallery-statement">{statement.map(line => <span key={line}>{line}</span>)}<i /></div>}
  </div>;
}
