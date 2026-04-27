import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'Stats',     to: '/stats'     },
  { label: 'Analytics', to: '/analytics' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu  = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? 'navbar__link active' : 'navbar__link';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">

        {/* Logo */}
        <NavLink to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-wordmark">
            NW<span>FL</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="navbar__links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="navbar__cta">
          <NavLink to="/stats" className="btn btn--primary">
            View Stats
          </NavLink>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass} end={to === '/'} onClick={closeMenu}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <NavLink to="/stats" className="btn btn--primary" onClick={closeMenu}>
          View Stats
        </NavLink>
      </div>
    </nav>
  );
}
