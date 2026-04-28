import './MatchCarousel.scss';

function TeamLogo({ logoUrl, name }) {
  return (
    <div className="match-carousel__team-logo">
      {logoUrl
        ? <img src={logoUrl} alt={name} />
        : <span>{name.charAt(0)}</span>
      }
    </div>
  );
}

export default function MatchCarousel({ matches = [], emblaRef }) {
  if (!matches.length) return null;

  return (
    <div className="match-carousel">
      <div className="match-carousel__viewport" ref={emblaRef}>
        <div className="match-carousel__container">
          {matches.map((match) => {
            const isUpcoming = match.status === 'UPCOMING';
            return (
              <div className="match-carousel__slide" key={match.id}>
                <div className="match-carousel__card">

                  {/* Status top-right */}
                  <div className="match-carousel__header">
                    <span className="match-carousel__matchday">{match.matchday}</span>
                    <span className={`match-carousel__status match-carousel__status--${isUpcoming ? 'upcoming' : 'ft'}`}>
                      {isUpcoming ? `${match.date} · ${match.time}` : 'Full Time'}
                    </span>
                  </div>

                  {/* Teams + Score */}
                  <div className="match-carousel__matchup">
                    <div className="match-carousel__team">
                      <TeamLogo logoUrl={match.homeLogoUrl} name={match.homeTeam} />
                    </div>

                    <div className="match-carousel__score">
                      {isUpcoming
                        ? <span className="match-carousel__score-vs">VS</span>
                        : (
                          <div className="match-carousel__score-line">
                            <span className="match-carousel__score-num">{match.homeScore}</span>
                            <span className="match-carousel__score-sep">—</span>
                            <span className="match-carousel__score-num">{match.awayScore}</span>
                          </div>
                        )
                      }
                    </div>

                    <div className="match-carousel__team">
                      <TeamLogo logoUrl={match.awayLogoUrl} name={match.awayTeam} />
                    </div>
                  </div>

                  {/* CTA */}
                  <button className={`match-carousel__cta${isUpcoming ? ' match-carousel__cta--outline' : ''}`}>
                    {isUpcoming ? 'Tickets' : 'Stats'}
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
