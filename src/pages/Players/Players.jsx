import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPlayers, fetchTeamsList } from '../../lib/api';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PlayerFilters from '../../components/PlayerFilters/PlayerFilters';
import PlayerCardSkeleton from '../../components/PlayerCardSkeleton/PlayerCardSkeleton';
import Modal from '../../components/ui/Modal/Modal';
import './Players.scss';

const SKELETON_COUNT = 12;

const Players = () => {
  const [searchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [count, setCount] = useState(0);
  const [retryTick, setRetryTick] = useState(0);
  const prevFiltersRef = useRef({});

  const filters = useMemo(
    () => ({
      team: searchParams.get('team') || undefined,
      position: searchParams.get('position') || undefined,
      group: searchParams.get('group') || undefined,
      search: searchParams.get('search') || undefined,
    }),
    [searchParams]
  );

  // Reset pagination whenever filters change
  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (
      prev.team !== filters.team ||
      prev.position !== filters.position ||
      prev.group !== filters.group ||
      prev.search !== filters.search
    ) {
      setPage(1);
      setPlayers([]);
      setHasMore(false);
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const isFirstPage = page === 1;

    const load = async () => {
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const [teamsData, { players: pagePlayers, count: total, next }] = await Promise.all([
          fetchTeamsList(),
          fetchPlayers(filters, page),
        ]);
        if (cancelled) return;

        setTeams(teamsData);
        setCount(total);
        setPlayers((prev) => (isFirstPage ? pagePlayers : [...prev, ...pagePlayers]));
        setHasMore(Boolean(next));
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Failed to load players.');
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [filters, page, retryTick]);

  return (
    <section className="players-page section">
      <div className="container">
        <header className="players-page__header">
          <h1 className="section-title">Player Registry</h1>
          <p className="players-page__subtitle">
            Discover every NWFL Premiership player, their club, and goal record.
          </p>
        </header>

        <div className="players-page__filters">
          <PlayerFilters teams={teams} />
        </div>

        {loading ? (
          <>
            <div className="players-page__count" aria-hidden="true">
              Loading players…
            </div>
            <div className="players-page__grid">
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <PlayerCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : players.length === 0 ? (
          <div className="players-page__empty">
            <h2>No players found</h2>
            <p>Try adjusting the filters or search.</p>
          </div>
        ) : (
          <>
            <p className="players-page__count">
              Showing {players.length} of {count} player{count !== 1 ? 's' : ''}
            </p>
            <div className="players-page__grid">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            {hasMore && (
              <div className="players-page__load-more">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading…' : 'Load more players'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={Boolean(error)}
        onClose={() => setError(null)}
        title="Couldn’t load players"
      >
        <p>{error}</p>
        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setRetryTick((t) => t + 1)}
          >
            Try again
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Players;
