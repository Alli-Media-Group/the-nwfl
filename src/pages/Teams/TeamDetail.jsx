import { useParams, Link } from 'react-router-dom';
import { mockTeams } from '../../data/mockTeams';
import Footer from '../../components/Footer/Footer';
import './TeamDetail.scss';

export default function TeamDetail() {
  const { slug } = useParams();
  const team = mockTeams.find(t => t.slug === slug);

  if (!team) {
    return (
      <div className="team-detail team-detail--not-found">
        <h1>Team not found</h1>
        <Link to="/teams" className="btn btn--primary">Back to Teams</Link>
      </div>
    );
  }

  return (
    <>
      <div className="team-detail">
        {/* Hero */}
        <div className="team-detail__hero">
          <div className="team-detail__hero-inner">
            <div className="team-detail__logo">
              <img src={team.logoUrl} alt={team.name} />
            </div>
            <div className="team-detail__hero-info">
              <span className="team-detail__group-badge">Group {team.group}</span>
              <h1 className="team-detail__name">{team.name}</h1>
              <p className="team-detail__location">{team.city}, {team.state}</p>
              {team.founded && (
                <p className="team-detail__founded">Est. {team.founded}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="team-detail__body">
          <div className="team-detail__inner">

            {/* Bio */}
            {team.bio && (
              <section className="team-detail__section">
                <h2 className="team-detail__section-title">About the Club</h2>
                <p className="team-detail__bio">{team.bio}</p>
              </section>
            )}

            {/* Honours */}
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

          </div>
        </div>

        <div className="team-detail__back">
          <Link to="/teams" className="btn btn--outline">← All Teams</Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
