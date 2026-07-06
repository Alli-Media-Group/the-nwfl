import './TeamStatCard.scss';

export default function TeamStatCard({ label, value, children }) {
  return (
    <div className="team-stat-card">
      <span className="team-stat-card__label">{label}</span>
      {children || <span className="team-stat-card__value">{value}</span>}
    </div>
  );
}
