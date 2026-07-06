import './FormIndicator.scss';

const RESULT_META = {
  W: { label: 'Win', modifier: 'win' },
  D: { label: 'Draw', modifier: 'draw' },
  L: { label: 'Loss', modifier: 'loss' },
};

export default function FormIndicator({ results = [], emptyLabel = 'No recent results' }) {
  if (!results.length) {
    return <span className="form-indicator__empty">{emptyLabel}</span>;
  }

  return (
    <span className="form-indicator" aria-label={`Recent form: ${results.join(', ')}`}>
      {results.map((result, i) => {
        const meta = RESULT_META[result] ?? { label: result, modifier: 'unknown' };
        return (
          <span
            key={i}
            className={`form-indicator__dot form-indicator__dot--${meta.modifier}`}
            aria-label={meta.label}
            title={meta.label}
          >
            {result}
          </span>
        );
      })}
    </span>
  );
}
