import FixturesPanel from '../FixturesPanel/FixturesPanel';
import StandingsTable from '../StandingsTable/StandingsTable';
import './LeagueSection.scss';

export default function LeagueSection({
  matches = [],
  matchesLoading = false,
  standings = { groupA: [], groupB: [] },
  standingsLoading = false,
}) {
  return (
    <section className="league-section" aria-label="Fixtures and Standings">
      <div className="league-section__inner">
        <div className="league-section__fixtures">
          <FixturesPanel matches={matches} loading={matchesLoading} />
        </div>
        <div className="league-section__standings">
          <StandingsTable
            groupA={standings.groupA}
            groupB={standings.groupB}
            loading={standingsLoading}
          />
        </div>
      </div>
    </section>
  );
}
