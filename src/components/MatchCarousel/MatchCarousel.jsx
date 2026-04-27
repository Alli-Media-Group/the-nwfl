import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import './MatchCarousel.scss';

/**
 * MatchCarousel — card-style score ticker
 *
 * @param {Array}  matches  - [{ id, homeTeam, homeScore, awayTeam, awayScore,
 *                              status, matchday, homeLogoUrl?, awayLogoUrl? }]
 * @param {React.Ref} emblaRef      - forwarded from parent for prev/next control
 * @param {Function}  scrollPrev    - called by parent arrow button
 * @param {Function}  scrollNext    - called by parent arrow button
 */
export default function MatchCarousel({ matches = [], emblaRef }) {
  if (!matches.length) return null;

  return (
    <div className="match-carousel">
      <div className="match-carousel__viewport" ref={emblaRef}>
        <div className="match-carousel__container">
          {matches.map((match) => (
            <div className="match-carousel__slide" key={match.id}>
              <div className="match-carousel__card">

                {/* Teams + Score */}
                <div className="match-carousel__matchup">

                  {/* Home */}
                  <div className="match-carousel__team">
                    <div className="match-carousel__team-logo">
                      {match.homeLogoUrl
                        ? <img src={match.homeLogoUrl} alt={match.homeTeam} />
                        : match.homeTeam.charAt(0)
                      }
                    </div>
                    <span className="match-carousel__team-name">{match.homeTeam}</span>
                  </div>

                  {/* Score */}
                  <div className="match-carousel__score">
                    <div className="match-carousel__score-line">
                      <span className="match-carousel__score-num">{match.homeScore}</span>
                      <span className="match-carousel__score-sep">-</span>
                      <span className="match-carousel__score-num">{match.awayScore}</span>
                    </div>
                    <span className="match-carousel__score-status">{match.status}</span>
                  </div>

                  {/* Away */}
                  <div className="match-carousel__team">
                    <div className="match-carousel__team-logo">
                      {match.awayLogoUrl
                        ? <img src={match.awayLogoUrl} alt={match.awayTeam} />
                        : match.awayTeam.charAt(0)
                      }
                    </div>
                    <span className="match-carousel__team-name">{match.awayTeam}</span>
                  </div>

                </div>

                {/* CTA — "Match Centre" or "Match Preview" */}
                <button className="match-carousel__cta">
                  {match.status === 'FT' ? 'Match Centre' : 'Match Preview'}
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
