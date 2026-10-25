import ContentImage from './ContentImage';

export default function GarmentPreview({ product, zoomOnClick = false }) {
  return product.image
    ? <ContentImage className="garment-preview product-photo" src={product.image} alt={product.name} loading="lazy" zoomOnHover={false} zoomOnClick={zoomOnClick}/>
    : <span className="garment-preview content-image-box" aria-hidden="true"/>;
}
