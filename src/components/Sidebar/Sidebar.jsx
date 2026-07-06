import { NavLink } from 'react-router-dom';
import sidebarBg from '../../data/images/sidebar-bg.webp';
import './Sidebar.scss';

const SIDEBAR_LINKS = [
  { label: 'Home',          to: '/',             icon: <HomeIcon /> },
  { label: 'About',         to: '/about',         icon: <AboutIcon /> },
  { label: 'News',          to: '/news',          icon: <NewsIcon /> },
  { label: 'Match Center',  to: '/match-center',  icon: <MatchIcon /> },
  { label: 'Teams',         to: '/teams',         icon: <TeamsIcon /> },
  { label: 'Analytics',     to: '/analytics',     icon: <AnalyticsIcon /> },
  { label: 'Media Channel', to: '/media',         icon: <MediaIcon /> },
];

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <line x1="16" y1="6" x2="12" y2="6" />
      <line x1="16" y1="10" x2="10" y2="10" />
      <line x1="16" y1="14" x2="10" y2="14" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const linkClass = ({ isActive }) =>
    `sidebar__link${isActive ? ' active' : ''}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sidebar__backdrop${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Site menu">

        {/* Background image with overlay */}
        <div className="sidebar__bg">
          <img src={sidebarBg} alt="" aria-hidden="true" />
          <div className="sidebar__bg-overlay" />
        </div>

        {/* Close button */}
        <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Nav links */}
        <nav className="sidebar__nav">
          <ul>
            {SIDEBAR_LINKS.map(({ label, to, icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass} onClick={onClose} end={to === '/'}>
                  <span className="sidebar__link-icon">{icon}</span>
                  <span className="sidebar__link-label">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer tag */}
        <div className="sidebar__footer">
          <span>NWFL © 2023</span>
        </div>

      </aside>
    </>
  );
}
