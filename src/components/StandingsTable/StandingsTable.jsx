import { useState } from 'react';
import SkeletonTableRow from '../SkeletonTableRow/SkeletonTableRow';
import './StandingsTable.scss';

const QUALIFY_COUNT = 3;
const RELEGATE_A    = 3;
const RELEGATE_B    = 4;

function getRowStatus(index, total, relegateCount) {
  if (index < QUALIFY_COUNT)               return 'qualify';
  if (index >= total - relegateCount)      return 'relegate';
  return 'safe';
}

function TeamLogo({ logoUrl, name }) {
  return (
    <div className="standings-table__logo">
      {logoUrl
        ? <img src={logoUrl} alt={name} loading="lazy" />
        : <span>{name.charAt(0)}</span>
      }
    </div>
  );
}

function Table({ data, relegateCount }) {
  return (
    <div className="standings-table__wrapper">
      <table className="standings-table__table">
        <thead>
          <tr>
            <th>#</th>
            <th className="standings-table__col-team">Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((team, index) => {
            const status = getRowStatus(index, data.length, relegateCount);
            return (
              <tr key={team.id} className={`standings-table__row standings-table__row--${status}`}>
                <td>
                  <span className={`standings-table__pos standings-table__pos--${status}`}>
                    {index + 1}
                  </span>
                </td>
                <td className="standings-table__col-team">
                  <div className="standings-table__team">
                    <TeamLogo logoUrl={team.logoUrl} name={team.name} />
                    <span className="standings-table__name">{team.name}</span>
                  </div>
                </td>
                <td>{team.mp}</td>
                <td>{team.w}</td>
                <td>{team.d}</td>
                <td>{team.l}</td>
                <td className={team.gd > 0 ? 'standings-table__gd--pos' : team.gd < 0 ? 'standings-table__gd--neg' : ''}>
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>
                <td className="standings-table__pts">{team.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="standings-table__wrapper">
      <table className="standings-table__table">
        <thead>
          <tr>
            <th>#</th>
            <th className="standings-table__col-team">Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StandingsTable({ groupA = [], groupB = [], loading = false }) {
  const [activeGroup, setActiveGroup] = useState('A');

  return (
    <div className="standings-table">
      <div className="standings-table__header">
        <h2 className="standings-table__title">League Standings</h2>
        <div className="standings-table__tabs">
          <button
            className={`standings-table__tab${activeGroup === 'A' ? ' active' : ''}`}
            onClick={() => setActiveGroup('A')}
          >
            Group A
          </button>
          <button
            className={`standings-table__tab${activeGroup === 'B' ? ' active' : ''}`}
            onClick={() => setActiveGroup('B')}
          >
            Group B
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : activeGroup === 'A' ? (
        <Table data={groupA} relegateCount={RELEGATE_A} />
      ) : (
        <Table data={groupB} relegateCount={RELEGATE_B} />
      )}

      <div className="standings-table__legend">
        <span className="standings-table__legend-item standings-table__legend-item--qualify">
          Qualifies for Playoffs
        </span>
        <span className="standings-table__legend-item standings-table__legend-item--relegate">
          Relegated
        </span>
      </div>
    </div>
  );
}
