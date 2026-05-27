import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTeams, fetchStandings } from '../../lib/api';
import SkeletonTeamCard from '../../components/SkeletonTeamCard/SkeletonTeamCard';
import Footer from '../../components/Footer/Footer';
import './Teams.scss';

const FILTERS = ['All', 'Group A', 'Group B'];

const QUALIFY_COUNT  = { A: 3, B: 3 };
const RELEGATE_COUNT = { A: 3, B: 4 };

function rowStatus(index, total, group) {
  if (index < QUALIFY_COUNT[group])           return 'qualify';
  if (index >= total - RELEGATE_COUNT[group]) return 'relegate';
  return 'safe';
}

function MiniStandings({ group, highlightId, groupA, groupB }) {
  const rows  = group === 'A' ? groupA : groupB;
  const total = rows.length;

  return (
    <div className="team-panel__standings">
      <p className="team-panel__standings-title">Group {group} Standings</p>
      <table className="team-panel__table">
        <thead>
          <tr>
            <th>#</th>
            <th className="team-panel__table-name-col">Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const status   = rowStatus(i, total, group);
            const isActive = row.id === highlightId;
            return (
              <tr
                key={row.id}
                className={[
                  `team-panel__row--${status}`,
                  isActive ? 'team-panel__row--active' : '',
                ].join(' ')}
              >
                <td className="team-panel__pos">{i + 1}</td>
                <td className="team-panel__team-cell">
                  <img src={row.logoUrl} alt={row.name} className="team-panel__row-logo" />
                  <span className="team-panel__row-name">{row.name.replace(' FC', '').replace(' Ladies', '')}</span>
                </td>
                <td>{row.mp}</td>
                <td>{row.w}</td>
                <td>{row.d}</td>
                <td>{row.l}</td>
                <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                <td className="team-panel__pts">{row.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="team-panel__legend">
        <span className="team-panel__legend-dot team-panel__legend-dot--qualify" />
        <span className="team-panel__legend-label">Playoffs</span>
        <span className="team-panel__legend-dot team-panel__legend-dot--relegate" />
        <span className="team-panel__legend-label">Relegation</span>
      </div>
    </div>
  );
}

function TeamPanel({ team, onClose, groupA, groupB }) {
  if (!team) return null;
  return (
    <>
      <div className="team-panel__backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="team-panel">
        <button className="team-panel__close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="team-panel__header">
          <div className="team-panel__logo">
            <img src={team.logoUrl} alt={team.name} />
          </div>
          <div className="team-panel__header-info">
            <span className="team-panel__group-badge">Group {team.group}</span>
            <h2 className="team-panel__name">{team.name}</h2>
            <p className="team-panel__city">{team.city}, {team.state}</p>
          </div>
        </div>

        <MiniStandings group={team.group} highlightId={team.id} groupA={groupA} groupB={groupB} />

        <div className="team-panel__details">
          {team.manager && team.manager !== 'TBA' && (
            <div className="team-panel__detail-row">
              <span className="team-panel__detail-label">Manager</span>
              <span className="team-panel__detail-value">{team.manager}</span>
            </div>
          )}
          {team.founded && (
            <div className="team-panel__detail-row">
              <span className="team-panel__detail-label">Founded</span>
              <span className="team-panel__detail-value">{team.founded}</span>
            </div>
          )}
          {team.nextMatch && (
            <div className="team-panel__detail-row">
              <span className="team-panel__detail-label">Next Match</span>
              <span className="team-panel__detail-value">{team.nextMatch}</span>
            </div>
          )}
        </div>

        {team.honours.length > 0 && (
          <div className="team-panel__honours">
            {team.honours.map((h, i) => (
              <span key={i} className="team-panel__honour">{h}</span>
            ))}
          </div>
        )}

        {team.bio && <p className="team-panel__bio">{team.bio}</p>}

        <Link to="/analytics" className="btn btn--primary team-panel__cta">
          View Analytics
        </Link>
      </aside>
    </>
  );
}

function TeamCard({ team, isSelected, onClick }) {
  return (
    <button
      className={`teams-page__card${isSelected ? ' selected' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <div className="teams-page__card-logo">
        <img src={team.logoUrl} alt={team.name} />
      </div>
      <span className="teams-page__group-badge">Group {team.group}</span>
      <h3 className="teams-page__card-name">{team.shortName}</h3>
      <p className="teams-page__card-city">{team.city}</p>
    </button>
  );
}

export default function Teams() {
  const [teams, setTeams]         = useState([]);
  const [groupA, setGroupA]       = useState([]);
  const [groupB, setGroupB]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTeams(),
      fetchStandings(),
    ])
      .then(([teamsData, standingsData]) => {
        setTeams(teamsData);
        setGroupA(standingsData.groupA);
        setGroupB(standingsData.groupB);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filtered = teams.filter(t => {
    if (activeFilter === 'All') return true;
    return `Group ${t.group}` === activeFilter;
  });

  const handleCardClick = (team) => {
    setSelectedTeam(prev => prev?.id === team.id ? null : team);
  };

  return (
    <>
      <div className="teams-page">
        <div className="teams-page__hero">
          <p className="teams-page__season">NWFL Premiership · 2024/25 Season</p>
          <h1 className="teams-page__title">The Teams</h1>
        </div>

        <div className="teams-page__filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`teams-page__filter${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="teams-page__grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonTeamCard key={i} />
            ))
          ) : (
            filtered.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                isSelected={selectedTeam?.id === team.id}
                onClick={() => handleCardClick(team)}
              />
            ))
          )}
        </div>
      </div>

      <TeamPanel
        team={selectedTeam}
        onClose={() => setSelectedTeam(null)}
        groupA={groupA}
        groupB={groupB}
      />

      <Footer />
    </>
  );
}
