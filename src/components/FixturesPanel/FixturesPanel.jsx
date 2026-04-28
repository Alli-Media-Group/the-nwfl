import { Link } from 'react-router-dom';
import './FixturesPanel.scss';

function TeamLogo({ logoUrl, name }) {
  return (
    <div className="fixtures-panel__logo">
      {logoUrl
        ? <img src={logoUrl} alt={name} />
        : <span>{name.charAt(0)}</span>
      }
    </div>
  );
}

function FixtureCard({ match }) {
  const isUpcoming = match.status === 'UPCOMING';

  return (
    <div className="fixtures-panel__card">
      <div className="fixtures-panel__card-header">
        <span className="fixtures-panel__matchday">{match.matchday} · {match.date}</span>
        {isUpcoming
          ? <span className="fixtures-panel__badge fixtures-panel__badge--upcoming">Upcoming</span>
          : <span className="fixtures-panel__badge fixtures-panel__badge--final">Final</span>
        }
      </div>

      <div className="fixtures-panel__matchup">
        <div className="fixtures-panel__team">
          <TeamLogo logoUrl={match.homeLogoUrl} name={match.homeTeam} />
          <span className="fixtures-panel__team-name">{match.homeTeam}</span>
        </div>

        <div className="fixtures-panel__score">
          {isUpcoming
            ? <span className="fixtures-panel__time">{match.time}</span>
            : <span className="fixtures-panel__scoreline">{match.homeScore} - {match.awayScore}</span>
          }
          <span className="fixtures-panel__status">{isUpcoming ? 'GMT+1' : 'FT'}</span>
        </div>

        <div className="fixtures-panel__team fixtures-panel__team--away">
          <TeamLogo logoUrl={match.awayLogoUrl} name={match.awayTeam} />
          <span className="fixtures-panel__team-name">{match.awayTeam}</span>
        </div>
      </div>
    </div>
  );
}

export default function FixturesPanel({ matches = [] }) {
  return (
    <div className="fixtures-panel">
      <h2 className="fixtures-panel__title">Fixtures &amp; Results</h2>

      <div className="fixtures-panel__list">
        {matches.map(match => (
          <FixtureCard key={match.id} match={match} />
        ))}
      </div>

      <Link to="/stats" className="fixtures-panel__cta">
        View All Fixtures
      </Link>
    </div>
  );
}
