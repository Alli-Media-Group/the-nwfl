import { useSearchParams } from 'react-router-dom';
import './PlayerFilters.scss';

const POSITIONS = [
  { value: '', label: 'All' },
  { value: 'GK', label: 'GK' },
  { value: 'DF', label: 'DF' },
  { value: 'MF', label: 'MF' },
  { value: 'FW', label: 'FW' },
];

const GROUPS = [
  { value: '', label: 'All groups' },
  { value: 'A', label: 'Group A' },
  { value: 'B', label: 'Group B' },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

const PlayerFilters = ({ teams }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const team = searchParams.get('team') || '';
  const position = searchParams.get('position') || '';
  const group = searchParams.get('group') || '';
  const search = searchParams.get('search') || '';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const hasFilters = Boolean(team || position || group || search);

  return (
    <div className="player-filters surface">
      <div className="player-filters__search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search players, teams..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          className="player-filters__input"
          aria-label="Search players"
        />
      </div>

      <div className="player-filters__row">
        <div className="player-filters__group" role="group" aria-label="Filter by position">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`player-filters__pill ${position === p.value ? 'is-active' : ''}`}
              onClick={() => updateParam('position', p.value)}
              aria-pressed={position === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="player-filters__group" role="group" aria-label="Filter by group">
          {GROUPS.map((g) => (
            <button
              key={g.value}
              type="button"
              className={`player-filters__pill ${group === g.value ? 'is-active' : ''}`}
              onClick={() => updateParam('group', g.value)}
              aria-pressed={group === g.value}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="player-filters__select-wrap">
          <select
            value={team}
            onChange={(e) => updateParam('team', e.target.value)}
            className="player-filters__select"
            aria-label="Filter by team"
          >
            <option value="">All teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            className="player-filters__clear"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerFilters;
