import ContentImage from './ContentImage';

export default function GarmentPreview({ product }) {
  return product.image
    ? <ContentImage className="garment-preview product-photo" src={product.image} alt={product.name} loading="lazy"/>
    : <span className="garment-preview content-image-box" aria-hidden="true"/>;
}
