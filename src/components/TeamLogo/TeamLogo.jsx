import { useState } from 'react';
import './TeamLogo.scss';

function getInitials(name, shortName) {
  if (shortName) {
    return shortName
      .split(' ')
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  const words = name.split(' ').filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export default function TeamLogo({ src, name, shortName, className = '', alt }) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name || '', shortName);

  const showImage = src && !failed;

  return (
    <span className={`team-logo ${className}`.trim()} aria-label={alt || name}>
      {showImage ? (
        <img
          className="team-logo__image"
          src={src}
          alt={alt || name || 'Team logo'}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="team-logo__fallback">{initials}</span>
      )}
    </span>
  );
}
