import AdminLoading from './admin/AdminLoading';
import MainLayout from './layouts/MainLayout';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Mens from './pages/Mens';
import Womens from './pages/Womens';
import Girls from './pages/Girls';
import Kids from './pages/Kids';
import Compliance from './pages/Compliance';
import Contact from './pages/Contact';
const Admin = lazy(() => import('./admin/Admin'));
export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/admin' || path.startsWith('/admin/')) return <Suspense fallback={<AdminLoading/>}><Admin/></Suspense>;
  const pages = { '/': Home, '/about': About, '/products': Products, '/mens': Mens, '/womens': Womens, '/girls': Girls, '/kids': Kids, '/compliance': Compliance, '/contact': Contact };
  const Page = pages[path];
  if (!Page && /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) return <MainLayout><Mens basePath={path}/></MainLayout>;
  if (!Page) return <MainLayout><Home/></MainLayout>;
  return <MainLayout><Page /></MainLayout>;
}
