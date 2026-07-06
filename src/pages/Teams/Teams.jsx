import { useState, useEffect } from 'react';
import { fetchTeams } from '../../lib/api';
import TeamListItem from '../../components/TeamListItem/TeamListItem';
import SkeletonTeamCard from '../../components/SkeletonTeamCard/SkeletonTeamCard';
import Modal from '../../components/ui/Modal/Modal';
import Footer from '../../components/Footer/Footer';
import { useSeason } from '../../hooks/useSeason';
import './Teams.scss';

const FILTERS = ['All', 'Group A', 'Group B'];

export default function Teams() {
  const { season, ready } = useSeason();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!ready || !season) return;
    let cancelled = false;

    fetchTeams(season)
      .then((data) => {
        if (cancelled) return;
        setTeams(data);
        setLoading(false);
        setError('');
      })
      .catch(() => {
        if (cancelled) return;
        setTeams([]);
        setLoading(false);
        setError('Unable to load teams right now. Please check your connection and try again.');
      });

    return () => { cancelled = true; };
  }, [season, ready, retryCount]);

  const filtered = teams.filter((t) => {
    if (activeFilter === 'All') return true;
    return `Group ${t.group}` === activeFilter;
  });

  const handleRetry = () => {
    setError('');
    setLoading(true);
    setRetryCount((c) => c + 1);
  };

  const handleClearFilter = () => setActiveFilter('All');

  return (
    <>
      <div className="teams-page">
        <div className="teams-page__hero">
          <p className="teams-page__season">NWFL Premiership · {season || '2024/25'} Season</p>
          <h1 className="teams-page__title">The Teams</h1>
        </div>

        <div className="teams-page__filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`teams-page__filter${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="teams-page__list">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonTeamCard key={i} />
            ))
          ) : filtered.length === 0 ? (
            <div className="teams-page__empty">
              <p className="teams-page__empty-title">
                {activeFilter === 'All'
                  ? 'No teams available for this season.'
                  : `No teams found in ${activeFilter}.`}
              </p>
              {activeFilter !== 'All' && (
                <button className="btn btn--ghost" onClick={handleClearFilter}>
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            filtered.map((team) => (
              <TeamListItem key={team.id} team={team} />
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={!!error}
        onClose={() => setError('')}
        title="Something went wrong"
      >
        <p>{error}</p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={() => setError('')}>
            Close
          </button>
          <button className="btn btn--primary" onClick={handleRetry}>
            Try again
          </button>
        </div>
      </Modal>

      <Footer />
    </>
  );
}
