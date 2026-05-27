import './SkeletonTeamCard.scss';

/**
 * Skeleton loading placeholder for a team card.
 * Matches the exact layout of TeamCard on the Teams page.
 */
export default function SkeletonTeamCard() {
  return (
    <div className="skeleton-team-card" aria-hidden="true">
      <span className="skeleton skeleton--circle skeleton-team-card__logo" />
      <span className="skeleton skeleton--pill skeleton-team-card__badge" />
      <span className="skeleton skeleton--text skeleton-team-card__name" />
      <span className="skeleton skeleton--text-sm skeleton-team-card__city" />
    </div>
  );
}
