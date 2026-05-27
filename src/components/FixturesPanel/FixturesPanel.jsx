import { Link } from 'react-router-dom';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import './FixturesPanel.scss';

function TeamLogo({ logoUrl, name }) {
  return (
    <div className="fixtures-panel__logo">
      {logoUrl
        ? <img src={logoUrl} alt={name} loading="lazy" />
        : <span>{name.charAt(0)}</span>
      }
    </div>
  );
}

function FixtureCard({ match }) {
  const isUpcoming = match.status === 'UPCOMING';

  return (
    <div className="fixtures-panel__card">
      {/* Header: matchday + date + status */}
      <div className="fixtures-panel__card-header">
        <div className="fixtures-panel__meta">
          <span className="fixtures-panel__matchday">{match.matchday}</span>
          <span className="fixtures-panel__dot">·</span>
          <span className="fixtures-panel__date">
            {match.date
              ? new Date(match.date).toLocaleDateString('en-GB', {
                  weekday: 'short', day: 'numeric', month: 'short'
                })
              : 'Date TBD'}
          </span>
        </div>
        <span className={`fixtures-panel__badge fixtures-panel__badge--${isUpcoming ? 'upcoming' : 'final'}`}>
          {isUpcoming ? 'Upcoming' : 'Full Time'}
        </span>
      </div>

      {/* Matchup row */}
      <div className="fixtures-panel__matchup">
        {/* Home */}
        <div className="fixtures-panel__team fixtures-panel__team--home">
          <TeamLogo logoUrl={match.homeLogoUrl} name={match.homeTeam} />
          <span className="fixtures-panel__team-name">{match.homeShortName}</span>
          <span className="fixtures-panel__team-role">Home</span>
        </div>

        {/* Center */}
        <div className="fixtures-panel__center">
          {isUpcoming ? (
            <>
              <span className="fixtures-panel__vs">VS</span>
              {match.time && <span className="fixtures-panel__time">{match.time}</span>}
            </>
          ) : (
            <div className="fixtures-panel__scoreline">
              <span className="fixtures-panel__score-num">{match.homeScore ?? 0}</span>
              <span className="fixtures-panel__score-sep">:</span>
              <span className="fixtures-panel__score-num">{match.awayScore ?? 0}</span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="fixtures-panel__team fixtures-panel__team--away">
          <TeamLogo logoUrl={match.awayLogoUrl} name={match.awayTeam} />
          <span className="fixtures-panel__team-name">{match.awayShortName}</span>
          <span className="fixtures-panel__team-role">Away</span>
        </div>
      </div>

      {/* Footer: venue */}
      {match.venue && (
        <div className="fixtures-panel__footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="fixtures-panel__venue">{match.venue}</span>
        </div>
      )}
    </div>
  );
}

export default function FixturesPanel({ matches = [], loading = false }) {
  return (
    <div className="fixtures-panel">
      <h2 className="fixtures-panel__title">Fixtures &amp; Results</h2>

      <div className="fixtures-panel__list">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          matches.map(match => (
            <FixtureCard key={match.id} match={match} />
          ))
        )}
      </div>

      <Link to="/stats" className="fixtures-panel__cta">
        View All Fixtures
      </Link>
    </div>
  );
}
