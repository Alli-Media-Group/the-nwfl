import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './RootLayout.scss';

// Home page has a full-bleed hero — navbar floats over it transparently.
// All other pages need padding so content clears the fixed navbar.
const HERO_ROUTES = ['/'];

export default function RootLayout() {
  const { pathname } = useLocation();
  const isHeroPage = HERO_ROUTES.includes(pathname);

  return (
    <div className="root-layout">
      <Navbar transparent={isHeroPage} />
      <main className={`root-layout__main${isHeroPage ? '' : ' root-layout__main--padded'}`}>
        <Outlet />
      </main>
    </div>
  );
}
