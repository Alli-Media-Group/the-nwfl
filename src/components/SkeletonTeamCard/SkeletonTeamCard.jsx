import './SkeletonTeamCard.scss';

/**
 * Skeleton loading placeholder for a team list item.
 * Matches the responsive layout of TeamListItem on the Teams page.
 */
export default function SkeletonTeamCard() {
  return (
    <div className="skeleton-team-card" aria-hidden="true">
      <span className="skeleton skeleton--circle skeleton-team-card__logo" />
      <div className="skeleton-team-card__info">
        <span className="skeleton skeleton--text skeleton-team-card__name" />
        <span className="skeleton skeleton--text-sm skeleton-team-card__city" />
      </div>
      <span className="skeleton skeleton--pill skeleton-team-card__badge" />
      <span className="skeleton skeleton--circle skeleton-team-card__chevron" />
    </div>
  );
}
