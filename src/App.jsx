import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Mens from './pages/Mens';
import Womens from './pages/Womens';
import Girls from './pages/Girls';
import Compliance from './pages/Compliance';
export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const pages = { '/': Home, '/about': About, '/products': Products, '/mens': Mens, '/womens': Womens, '/girls': Girls, '/compliance': Compliance };
  const Page = pages[path] || Home;
  return <MainLayout><Page /></MainLayout>;
}
