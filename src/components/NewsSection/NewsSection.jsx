import { Link } from 'react-router-dom';
import ArticleCard from '../ArticleCard/ArticleCard';
import './NewsSection.scss';

function ArrowRightCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 16 16 12 12 8" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="news-section__skeleton-card">
      <div className="news-section__skeleton-img skeleton" />
      <div className="news-section__skeleton-body">
        <span className="news-section__skeleton-meta skeleton skeleton--text" />
        <span className="news-section__skeleton-title skeleton skeleton--text" />
      </div>
    </div>
  );
}

/**
 * NewsSection
 * @param {string} bgImage   - stadium background image
 * @param {Array}  articles  - [{ id, image, date, category, title, slug }]
 * @param {boolean} loading  - whether articles are loading
 * @param {string} ctaText   - CTA label
 * @param {string} ctaTo     - CTA route
 */
export default function NewsSection({
  bgImage,
  articles = [],
  loading = false,
  ctaText = 'See News Log',
  ctaTo = '/news',
}) {
  const displayArticles = articles.slice(0, 4);

  return (
    <section className="news-section" aria-label="Latest News">

      <div className="news-section__bg">
        {bgImage && <img src={bgImage} alt="" aria-hidden="true" />}
      </div>

      <div className="news-section__inner">

        <h2 className="news-section__heading">
          Know what&apos;s happening around you
        </h2>

        {loading ? (
          <div className="news-section__grid">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        ) : displayArticles.length > 0 ? (
          <div className="news-section__grid">
            {displayArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="light" />
            ))}
          </div>
        ) : null}

        {!loading && (
          <div className="news-section__footer">
            <Link to={ctaTo} className="news-section__cta">
              {ctaText} <ArrowRightCircle />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
