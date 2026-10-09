import Mens from './Mens';
import { girlsCategories, girlsProducts } from '../data/girls';
import GirlsGarmentPreview from '../components/GirlsGarmentPreview';
import '../styles/womens.css';
import '../styles/girls.css';
export default function Girls(){return <Mens categories={girlsCategories} catalogProducts={girlsProducts} basePath="/girls" audience="Girls’" Preview={GirlsGarmentPreview} women girls/>;}
