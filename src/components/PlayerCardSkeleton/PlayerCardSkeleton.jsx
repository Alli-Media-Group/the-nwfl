import './PlayerCardSkeleton.scss';

const PlayerCardSkeleton = () => (
  <div className="player-card-skeleton" aria-hidden="true">
    <div className="player-card-skeleton__media">
      <div className="player-card-skeleton__circle" />
      <div className="player-card-skeleton__jersey" />
      <div className="player-card-skeleton__logo" />
    </div>
    <div className="player-card-skeleton__body">
      <div className="player-card-skeleton__title" />
      <div className="player-card-skeleton__row">
        <div className="player-card-skeleton__badge" />
        <div className="player-card-skeleton__goals" />
      </div>
    </div>
  </div>
);

export default PlayerCardSkeleton;
