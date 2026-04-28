import FixturesPanel from '../FixturesPanel/FixturesPanel';
import StandingsTable from '../StandingsTable/StandingsTable';
import './LeagueSection.scss';

export default function LeagueSection({ matches = [] }) {
  return (
    <section className="league-section" aria-label="Fixtures and Standings">
      <div className="league-section__inner">
        <div className="league-section__fixtures">
          <FixturesPanel matches={matches} />
        </div>
        <div className="league-section__standings">
          <StandingsTable />
        </div>
      </div>
    </section>
  );
}
