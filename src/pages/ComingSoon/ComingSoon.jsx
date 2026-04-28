import { Link } from 'react-router-dom';
import './ComingSoon.scss';

export default function ComingSoon({ title = 'Coming Soon' }) {
  return (
    <div className="coming-soon">
      <p className="coming-soon__label">Under Construction</p>
      <h1 className="coming-soon__title">{title}</h1>
      <p className="coming-soon__sub">This section is being built. Check back soon.</p>
      <Link to="/" className="btn btn--primary">Back to Home</Link>
    </div>
  );
}
