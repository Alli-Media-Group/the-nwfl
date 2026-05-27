import './SkeletonTableRow.scss';

/**
 * Skeleton loading placeholder for a standings table row.
 * Matches the exact layout of StandingsTable rows.
 */
export default function SkeletonTableRow() {
  return (
    <tr className="skeleton-table-row" aria-hidden="true">
      {/* Position # */}
      <td>
        <span className="skeleton skeleton--circle skeleton-table-row__pos" />
      </td>

      {/* Team: logo + name */}
      <td className="skeleton-table-row__col-team">
        <div className="skeleton-table-row__team">
          <span className="skeleton skeleton--circle skeleton-table-row__logo" />
          <span className="skeleton skeleton--text skeleton-table-row__name" />
        </div>
      </td>

      {/* MP */}
      <td><span className="skeleton skeleton--text skeleton-table-row__stat" /></td>

      {/* W */}
      <td><span className="skeleton skeleton--text skeleton-table-row__stat" /></td>

      {/* D */}
      <td><span className="skeleton skeleton--text skeleton-table-row__stat" /></td>

      {/* L */}
      <td><span className="skeleton skeleton--text skeleton-table-row__stat" /></td>

      {/* GD */}
      <td><span className="skeleton skeleton--text skeleton-table-row__stat" /></td>

      {/* PTS */}
      <td><span className="skeleton skeleton--text skeleton-table-row__stat skeleton-table-row__stat--pts" /></td>
    </tr>
  );
}
