import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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

export default function Navbar({ transparent = false }) {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    if (!transparent) return;

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu  = () => setMenuOpen(false);
  const linkClass  = ({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link';

  // transparent mode: start clear, become solid once user scrolls past 60px
  const isTransparent = transparent && !scrolled;

  return (
    <nav
      className={`navbar${isTransparent ? ' navbar--transparent' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">

        <NavLink to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-wordmark">
            NW<span>FL</span>
          </span>
        </NavLink>

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
            className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>

      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass} end={to === '/'} onClick={closeMenu}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
