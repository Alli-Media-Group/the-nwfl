import './SkeletonCard.scss';

/**
 * Skeleton loading placeholder for a fixture card.
 * Matches the exact layout of MatchCarousel / FixturesPanel cards
 * so there is zero layout shift when real data loads.
 */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      {/* Header: matchday + date */}
      <div className="skeleton-card__header">
        <span className="skeleton skeleton--text skeleton-card__matchday" />
        <span className="skeleton skeleton--text skeleton-card__date" />
      </div>

      {/* Matchup row: home | center | away */}
      <div className="skeleton-card__matchup">
        {/* Home team */}
        <div className="skeleton-card__team skeleton-card__team--home">
          <span className="skeleton skeleton--circle skeleton-card__logo" />
          <span className="skeleton skeleton--text skeleton-card__team-name" />
          <span className="skeleton skeleton--text-sm skeleton-card__team-role" />
        </div>

        {/* Center: VS + time */}
        <div className="skeleton-card__center">
          <span className="skeleton skeleton--text skeleton-card__vs" />
          <span className="skeleton skeleton--text-sm skeleton-card__kickoff" />
        </div>

        {/* Away team */}
        <div className="skeleton-card__team skeleton-card__team--away">
          <span className="skeleton skeleton--circle skeleton-card__logo" />
          <span className="skeleton skeleton--text skeleton-card__team-name" />
          <span className="skeleton skeleton--text-sm skeleton-card__team-role" />
        </div>
      </div>

      {/* Footer: venue + status */}
      <div className="skeleton-card__footer">
        <span className="skeleton skeleton--text-sm skeleton-card__venue" />
        <span className="skeleton skeleton--pill skeleton-card__status" />
      </div>
    </div>
  );
}
