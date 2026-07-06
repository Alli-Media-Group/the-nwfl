import { Link } from 'react-router-dom';
import TeamLogo from '../TeamLogo/TeamLogo';
import './TeamListItem.scss';

export default function TeamListItem({ team }) {
  const location = [team.city, team.state].filter(Boolean).join(', ');

  return (
    <Link
      to={`/teams/${team.slug}`}
      className="team-list-item"
      aria-label={`View ${team.name} profile`}
    >
      <div className="team-list-item__mobile-header">
        <span className="team-list-item__group team-list-item__group--mobile badge badge--accent">
          Group {team.group}
        </span>
        <span className="team-list-item__chevron team-list-item__chevron--mobile" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>

      <TeamLogo
        src={team.logoUrl}
        name={team.name}
        shortName={team.shortName}
        className="team-list-item__logo"
      />

      <div className="team-list-item__info">
        <h3 className="team-list-item__name">{team.name}</h3>
        {location && <p className="team-list-item__meta">{location}</p>}
      </div>

      <span className="team-list-item__group team-list-item__group--desktop badge badge--accent">
        Group {team.group}
      </span>

      <span className="team-list-item__chevron team-list-item__chevron--desktop" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
    </Link>
  );
}
