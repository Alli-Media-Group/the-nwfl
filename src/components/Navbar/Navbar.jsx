import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '/logo.webp';
import Sidebar from '../Sidebar/Sidebar';
import './Navbar.scss';

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'Stats',     to: '/stats'     },
  { label: 'Analytics', to: '/analytics' },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Navbar({ transparent = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  // lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const openSidebar  = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const linkClass    = ({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link';
  const isTransparent = transparent && !scrolled;

  return (
    <>
      <nav
        className={`navbar${isTransparent ? ' navbar--transparent' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar__inner">

          <NavLink to="/" className="navbar__logo" onClick={closeSidebar}>
            <img src={logo} alt="NWFL" className="navbar__logo-img" />
          </NavLink>

          {/* Desktop centre links */}
          <ul className="navbar__links">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass} end={to === '/'}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__right">
            <button className="navbar__search" aria-label="Search">
              <SearchIcon />
            </button>

            <button
              className={`navbar__menu-btn${sidebarOpen ? ' open' : ''}`}
              onClick={openSidebar}
              aria-expanded={sidebarOpen}
              aria-label="Open menu"
            >
              <MenuIcon open={sidebarOpen} />
            </button>
          </div>

        </div>
      </nav>

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}
