import './MatchCarousel.scss';

function TeamLogo({ logoUrl, name }) {
  return (
    <div className="match-carousel__team-logo">
      {logoUrl
        ? <img src={logoUrl} alt={name} loading="lazy" />
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

                  {/* Top meta: matchday + date */}
                  <div className="match-carousel__header">
                    <span className="match-carousel__matchday">{match.matchday}</span>
                    <span className="match-carousel__date">
                      {match.date ? new Date(match.date).toLocaleDateString('en-GB', {
                        weekday: 'short', day: 'numeric', month: 'short'
                      }) : 'TBD'}
                    </span>
                  </div>

                  {/* Main matchup row */}
                  <div className="match-carousel__matchup">
                    {/* Home team */}
                    <div className="match-carousel__team match-carousel__team--home">
                      <TeamLogo logoUrl={match.homeLogoUrl} name={match.homeTeam} />
                      <span className="match-carousel__team-name">{match.homeShortName}</span>
                      <span className="match-carousel__team-role">Home</span>
                    </div>

                    {/* Center: VS or score */}
                    <div className="match-carousel__center">
                      {isUpcoming || (match.homeScore == null && match.awayScore == null) ? (
                        <>
                          <span className="match-carousel__vs">VS</span>
                          {match.time && (
                            <span className="match-carousel__kickoff">{match.time}</span>
                          )}
                        </>
                      ) : (
                        <div className="match-carousel__scoreline">
                          <span className="match-carousel__score-num">{match.homeScore ?? 0}</span>
                          <span className="match-carousel__score-sep">:</span>
                          <span className="match-carousel__score-num">{match.awayScore ?? 0}</span>
                        </div>
                      )}
                    </div>

                    {/* Away team */}
                    <div className="match-carousel__team match-carousel__team--away">
                      <TeamLogo logoUrl={match.awayLogoUrl} name={match.awayTeam} />
                      <span className="match-carousel__team-name">{match.awayShortName}</span>
                      <span className="match-carousel__team-role">Away</span>
                    </div>
                  </div>

                  {/* Bottom: venue + status */}
                  <div className="match-carousel__footer">
                    {match.venue && (
                      <span className="match-carousel__venue">{match.venue}</span>
                    )}
                    <span className={`match-carousel__status match-carousel__status--${isUpcoming ? 'upcoming' : 'ft'}`}>
                      {isUpcoming ? 'Upcoming' : 'Full Time'}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
