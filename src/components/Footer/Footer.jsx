import { FaFacebookF, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import logo from '/logo.webp';
import './Footer.scss';

const NAV_LINKS = [
  { label: 'About',         href: '#' },
  { label: 'Help',          href: '#' },
  { label: 'FAQs',          href: '#' },
  { label: 'Feedback',      href: '#' },
  { label: 'Terms of Use',  href: '#' },
  { label: 'Privacy Policy',href: '#' },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF,  href: '#', label: 'Facebook'  },
  { icon: FaXTwitter,   href: '#', label: 'Twitter'   },
  { icon: FaInstagram,  href: '#', label: 'Instagram' },
  { icon: FaYoutube,    href: '#', label: 'YouTube'   },
];

const Footer = () => {
  return (
    <footer className="footer" aria-label="Site footer">

      {/* Top row — logo + nav */}
      <div className="footer__top">
        <Link to="/" className="footer__logo">
          <img src={logo} alt="NWFL logo" />
        </Link>

        <ul className="footer__nav">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="footer__nav-link">{label}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Social icons */}
      <div className="footer__social">
        {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            className="footer__social-link"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon />
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div className="footer__copy">
        © 2023 All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;
