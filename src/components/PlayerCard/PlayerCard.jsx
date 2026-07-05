import { Link } from 'react-router-dom';
import { useImageLoader } from '../../hooks/useImageLoader';
import { useState } from 'react';
import './PlayerCard.scss';

const POSITION_NAMES = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};

const PlayerCard = ({ player }) => {
  const { loaded, onLoad } = useImageLoader();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const teamLogo =
    player.team?.logo_url || `/team-logos/thenwfl_2425_teams/${player.team?.slug}.png`;
  const positionLabel = POSITION_NAMES[player.position] || player.position || '—';
  const teamFallback = (player.team?.short_name || player.team?.name || '?')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link to={`/players/${player.slug}`} className="player-card surface surface--interactive">
      <div className="player-card__media">
        {player.photo && !photoFailed ? (
          <>
            {!loaded && <div className="player-card__skeleton" aria-hidden="true" />}
            <img
              src={player.photo}
              alt={player.name}
              onLoad={onLoad}
              onError={() => setPhotoFailed(true)}
              className={`player-card__img ${loaded ? 'is-visible' : ''}`}
            />
          </>
        ) : (
          <img
            src="/no-profile.png"
            alt=""
            className="player-card__fallback"
          />
        )}

        {player.jersey_number && (
          <span className="player-card__jersey">#{player.jersey_number}</span>
        )}

        <div className="player-card__overlay">
          {logoFailed ? (
            <span className="player-card__team-fallback">{teamFallback}</span>
          ) : (
            <img
              src={teamLogo}
              alt={player.team?.name}
              className="player-card__team-logo"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>
      </div>

      <div className="player-card__body">
        <h3 className="player-card__name">{player.name}</h3>
        <div className="player-card__row">
          {player.position && (
            <span className="player-card__position">{positionLabel}</span>
          )}
          <span className="player-card__goals">
            <strong>{player.goals ?? 0}</strong> goals
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;
