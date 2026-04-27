import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useImageLoader } from '../../hooks/useImageLoader';
import './RisingStars.scss';

function PlayerCard({ player }) {
  const { loaded, onLoad, onError } = useImageLoader();

  return (
    <div className="rising-stars__card">
      <div className={`rising-stars__card-img${!loaded ? ' is-loading' : ''}`}>
        <img
          src={player.image}
          alt={player.name}
          loading="lazy"
          className={!loaded ? 'is-loading' : ''}
          onLoad={onLoad}
          onError={onError}
        />
      </div>
      <span className="rising-stars__card-name">{player.name}</span>
      {(player.position || player.team) && (
        <span className="rising-stars__card-meta">
          {[player.position, player.team].filter(Boolean).join(' · ')}
        </span>
      )}
    </div>
  );
}

/**
 * RisingStars
 * @param {Array}  players  - [{ id, name, position, team, image }]
 * @param {string} ctaTo    - route for "View Gallery" button
 */
export default function RisingStars({ players = [], ctaTo = '/stats' }) {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [autoplay.current]
  );

  if (!players.length) return null;

  return (
    <section className="rising-stars" aria-label="Rising Stars">
      <div className="rising-stars__pattern" aria-hidden="true" />

      <div className="rising-stars__inner">
        <h2 className="rising-stars__heading">Meet rising stars</h2>

        <div className="rising-stars__carousel" ref={emblaRef}>
          <div className="rising-stars__track">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>

        <div className="rising-stars__footer">
          <Link to={ctaTo} className="btn btn--primary">
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
