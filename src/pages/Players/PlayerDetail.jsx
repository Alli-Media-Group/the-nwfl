import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPlayer, fetchPlayerGoals, fetchPlayerTopScorers } from '../../lib/api';
import { useImageLoader } from '../../hooks/useImageLoader';
import Modal from '../../components/ui/Modal/Modal';
import './PlayerDetail.scss';

function teamLogoUrl(team) {
  return team?.logo_url || `/team-logos/thenwfl_2425_teams/${team?.slug}.png`;
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const Stat = ({ label, value }) => (
  <div className="player-detail__stat surface">
    <span className="player-detail__stat-value">{value}</span>
    <span className="player-detail__stat-label">{label}</span>
  </div>
);

const GoalRow = ({ goal }) => {
  const opponent = goal.opponent;
  const score =
    goal.home_score != null && goal.away_score != null
      ? `${goal.home_score}–${goal.away_score}`
      : '—';

  return (
    <div className="player-detail__goal surface">
      <span className={`player-detail__goal-result player-detail__goal-result--${goal.result?.toLowerCase() || 'na'}`}>
        {goal.result || '—'}
      </span>
      <div className="player-detail__goal-match">
        <div className="player-detail__goal-opponent">
          <img
            src={teamLogoUrl(opponent)}
            alt={opponent?.name}
            className="player-detail__goal-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="player-detail__goal-team">{opponent?.name}</span>
        </div>
        <span className="player-detail__goal-meta">
          MD{goal.matchday} · {formatDate(goal.date)}
        </span>
      </div>
      <div className="player-detail__goal-detail">
        <span className="player-detail__goal-score">{score}</span>
        <span className="player-detail__goal-minute">
          {goal.minute_str || goal.minute}'{goal.is_own_goal ? ' (OG)' : ''}
        </span>
      </div>
    </div>
  );
};

const PlayerDetail = () => {
  const { slug } = useParams();
  const [player, setPlayer] = useState(null);
  const [goals, setGoals] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTick, setRetryTick] = useState(0);
  const { loaded, onLoad } = useImageLoader();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [teamBadgeFailed, setTeamBadgeFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const playerData = await fetchPlayer(slug);
        if (cancelled) return;
        setPlayer(playerData);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Failed to load player profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, retryTick]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const goalsData = await fetchPlayerGoals(slug);
        if (cancelled) return;
        setGoals(goalsData);
      } catch {
        // Goal log is a nice-to-have; don't block the profile.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const scorersData = await fetchPlayerTopScorers();
        if (cancelled) return;
        setTopScorers(scorersData.slice(0, 5));
      } catch {
        // Top scorers are a nice-to-have; don't block the profile.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="player-detail section">
        <div className="container">
          <div className="player-detail__hero player-detail__hero--loading surface" aria-busy="true">
            <div className="player-detail__avatar player-detail__avatar--loading" />
            <div className="player-detail__loading-text">Loading player profile…</div>
          </div>
        </div>
      </section>
    );
  }

  if (!player) {
    return (
      <section className="player-detail section">
        <div className="container">
          <div className="player-detail__empty">
            <h1>Player not found</h1>
            <Link to="/players" className="btn btn--primary">
              Back to registry
            </Link>
          </div>
        </div>
        <Modal
          isOpen={Boolean(error)}
          onClose={() => setError(null)}
          title="Something went wrong"
        >
          <p>{error}</p>
        </Modal>
      </section>
    );
  }

  const teamLogo = teamLogoUrl(player.team);
  const stats = player.stats || {};

  return (
    <section className="player-detail section">
      <div className="container">
        <Link to="/players" className="player-detail__back">
          ← Back to registry
        </Link>

        <div className="player-detail__hero surface">
          <div className="player-detail__avatar">
            {player.photo && !photoFailed ? (
              <>
                {!loaded && <div className="player-detail__avatar-skeleton" />}
                <img
                  src={player.photo}
                  alt={player.name}
                  onLoad={onLoad}
                  onError={() => setPhotoFailed(true)}
                  className={`player-detail__img ${loaded ? 'is-visible' : ''}`}
                />
              </>
            ) : (
              <img
                src="/no-profile.png"
                alt=""
                className="player-detail__fallback"
              />
            )}
            {!teamBadgeFailed && (
              <div className="player-detail__avatar-badge">
                <img
                  src={teamLogo}
                  alt={player.team?.name}
                  onError={() => setTeamBadgeFailed(true)}
                />
              </div>
            )}
          </div>

          <div className="player-detail__header-info">
            <h1 className="player-detail__name">{player.name}</h1>
            <div className="player-detail__team">
              <img
                src={teamLogo}
                alt={player.team?.name}
                className="player-detail__team-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span>{player.team?.name}</span>
            </div>
            <div className="player-detail__badges">
              {player.position && (
                <span className="player-detail__badge player-detail__badge--position">
                  {player.position}
                </span>
              )}
              {player.jersey_number && (
                <span className="player-detail__badge">#{player.jersey_number}</span>
              )}
              {player.nationality && (
                <span className="player-detail__badge">{player.nationality}</span>
              )}
            </div>
          </div>
        </div>

        <div className="player-detail__stats">
          <Stat label="Goals" value={stats.goals ?? 0} />
          <Stat label="Penalties" value={stats.penalties ?? 0} />
          <Stat label="Own Goals" value={stats.own_goals ?? 0} />
          <Stat label="Matches Scored In" value={stats.matches_scored_in ?? 0} />
        </div>

        {player.bio && (
          <div className="player-detail__section">
            <h2 className="player-detail__section-title">About</h2>
            <p className="player-detail__bio">{player.bio}</p>
          </div>
        )}

        <div className="player-detail__columns">
          <div className="player-detail__main">
            <h2 className="player-detail__section-title">Goal Record</h2>
            {goals.length > 0 ? (
              <div className="player-detail__goals-list">
                {goals.map((goal) => (
                  <GoalRow key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <div className="player-detail__placeholder">
                No recorded goals yet. Match-by-match goal logs will appear here as event
                data is confirmed.
              </div>
            )}
          </div>

          <aside className="player-detail__sidebar surface">
            <h2 className="player-detail__section-title">Top Scorers</h2>
            {topScorers.length > 0 ? (
              <ol className="player-detail__top-scorers">
                {topScorers.map((scorer, index) => (
                  <li key={scorer.id} className="player-detail__top-scorer">
                    <span className="player-detail__top-scorer-rank">{index + 1}</span>
                    <span className="player-detail__top-scorer-name">
                      <Link to={`/players/${scorer.slug}`}>{scorer.name}</Link>
                    </span>
                    <span className="player-detail__top-scorer-goals">{scorer.goals}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="player-detail__placeholder-text">Top scorers unavailable.</p>
            )}
          </aside>
        </div>
      </div>

      <Modal
        isOpen={Boolean(error)}
        onClose={() => setError(null)}
        title="Couldn’t load profile"
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

export default PlayerDetail;
