import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useRef } from "react";
import MatchCarousel from "../MatchCarousel/MatchCarousel";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import "./Hero.scss";

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/**
 * Hero — full-viewport section with floating navbar overlay
 *
 * @param {string} bgImage         - hero background image path
 * @param {string} titleHtml       - heading HTML (use <span> for gradient word)
 * @param {string} subtitle        - subtitle paragraph
 * @param {Array}  matches         - match data for score carousel
 * @param {boolean} matchesLoading - whether matches are still loading
 */
export default function Hero({
  bgImage,
  titleHtml = "We Are <span>NWFL</span>",
  subtitle = "Follow every fixture, standing, and performance from the Nigeria Women Football League Premiership.",
  matches = [],
  matchesLoading = false,
}) {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoplay.current],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="hero" aria-label="Hero">
      {/* Background */}
      <div className="hero__bg">
        <img
          src={bgImage}
          alt="NWFL match action"
          fetchpriority="high"
          decoding="async"
        />
      </div>
      <div className="hero__overlay" aria-hidden="true" />

      {/* Main text content */}
      <div className="hero__content">
        <h1
          className="hero__title"
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
        <p className="hero__subtitle">{subtitle}</p>
        <div className="hero__actions">
          <Link to="/stats" className="btn btn--primary">
            Apply Now
          </Link>
        </div>
      </div>

      {/* Score carousel + arrows */}
      <div className="hero__scores-wrapper">
        <div className="hero__scores">
          <button
            className="hero__arrow"
            onClick={scrollPrev}
            aria-label="Previous matches"
          >
            <ChevronLeft />
          </button>
          <div className="hero__carousel-wrapper">
            {matchesLoading ? (
              <div className="hero__skeleton-carousel">
                <div className="hero__skeleton-container">
                  <div className="hero__skeleton-slide"><SkeletonCard /></div>
                  <div className="hero__skeleton-slide"><SkeletonCard /></div>
                  <div className="hero__skeleton-slide"><SkeletonCard /></div>
                  <div className="hero__skeleton-slide"><SkeletonCard /></div>
                </div>
              </div>
            ) : (
              <MatchCarousel matches={matches} emblaRef={emblaRef} />
            )}
          </div>
          <button
            className="hero__arrow"
            onClick={scrollNext}
            aria-label="Next matches"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
