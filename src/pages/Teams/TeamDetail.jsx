import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeams } from '../../lib/api';
import TeamLogo from '../../components/TeamLogo/TeamLogo';
import TeamStatCard from '../../components/TeamStatCard/TeamStatCard';
import FormIndicator from '../../components/FormIndicator/FormIndicator';
import Modal from '../../components/ui/Modal/Modal';
import Footer from '../../components/Footer/Footer';
import './TeamDetail.scss';

export default function TeamDetail() {
  const { slug } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchTeams()
      .then((teams) => {
        if (cancelled) return;
        const found = teams.find((t) => t.slug === slug) ?? null;
        setTeam(found);
        setError('');
      })
      .catch(() => {
        if (cancelled) return;
        setTeam(null);
        setError('Unable to load this team profile. Please check your connection and try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug, retryCount]);

  const handleRetry = () => {
    setError('');
    setLoading(true);
    setRetryCount((c) => c + 1);
  };

  if (loading) {
    return (
      <div className="team-detail team-detail--not-found">
        <p>Loading…</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="team-detail team-detail--not-found">
        <h1>Team not found</h1>
        <Link to="/teams" className="btn btn--primary">Back to Teams</Link>
      </div>
    );
  }

  const stats = [
    { label: 'Position', value: team.position ? `#${team.position}` : '—' },
    { label: 'Points', value: team.points ?? 0 },
    { label: 'Record', value: `${team.w ?? 0}-${team.d ?? 0}-${team.l ?? 0}` },
    { label: 'Goal Difference', value: (team.gd ?? 0) > 0 ? `+${team.gd}` : team.gd ?? 0 },
  ];

  return (
    <>
      <div className="team-detail">
        <div className="team-detail__hero">
          <div className="team-detail__hero-inner">
            <TeamLogo
              src={team.logoUrl}
              name={team.name}
              shortName={team.shortName}
              className="team-detail__logo"
            />
            <div className="team-detail__hero-info">
              <span className="team-detail__group-badge badge badge--accent">
                Group {team.group}
              </span>
              <h1 className="team-detail__name">{team.name}</h1>
              <div className="team-detail__meta-row">
                {[team.city, team.state].filter(Boolean).join(', ')}
                {team.founded && <span className="team-detail__meta-dot">·</span>}
                {team.founded && <span>Est. {team.founded}</span>}
                {team.manager && team.manager !== 'TBA' && <span className="team-detail__meta-dot">·</span>}
                {team.manager && team.manager !== 'TBA' && <span>Manager: {team.manager}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="team-detail__body">
          <div className="team-detail__inner">
            <section className="team-detail__section">
              <h2 className="team-detail__section-title">Season Snapshot</h2>
              <div className="team-detail__stats">
                {stats.map((s) => (
                  <TeamStatCard key={s.label} label={s.label} value={s.value} />
                ))}
                <TeamStatCard label="Form">
                  <FormIndicator results={team.form} />
                </TeamStatCard>
                <TeamStatCard
                  label="Next Match"
                  value={team.nextMatch || '—'}
                />
              </div>
            </section>

            {team.bio && (
              <section className="team-detail__section">
                <h2 className="team-detail__section-title">About the Club</h2>
                <p className="team-detail__bio">{team.bio}</p>
              </section>
            )}

            {team.honours.length > 0 && (
              <section className="team-detail__section">
                <h2 className="team-detail__section-title">Honours</h2>
                <ul className="team-detail__honours">
                  {team.honours.map((h, i) => (
                    <li key={i} className="team-detail__honour-item">{h}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="team-detail__back">
              <Link to="/teams" className="btn btn--outline">← All Teams</Link>
            </div>
          </div>
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
