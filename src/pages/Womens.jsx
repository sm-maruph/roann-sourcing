import Mens from './Mens';
import { womensCategories, womensProducts } from '../data/womens';
import WomensGarmentPreview from '../components/WomensGarmentPreview';
import '../styles/womens.css';
export default function Womens() {
  return <Mens categories={womensCategories} catalogProducts={womensProducts} basePath="/womens" audience="Women’s" Preview={WomensGarmentPreview} women/>;
}
