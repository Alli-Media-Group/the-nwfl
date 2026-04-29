import { Link } from 'react-router-dom';
import { useImageLoader } from '../../hooks/useImageLoader';
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

// Featured image — shimmer on container, hidden img until loaded
function FeaturedImage({ src, alt }) {
  const { loaded, onLoad, onError } = useImageLoader();
  return (
    <div className={`news-section__featured-img${!loaded ? ' is-loading' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={!loaded ? 'is-loading' : ''}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}

// Article card image — shimmer on container only, card body text visible throughout
function ArticleCard({ article }) {
  const { loaded, onLoad, onError } = useImageLoader();
  return (
    <Link
      to={`/news/${article.slug}`}
      className="news-section__card"
      aria-label={article.title}
    >
      <div className={`news-section__card-img${!loaded ? ' is-loading' : ''}`}>
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className={!loaded ? 'is-loading' : ''}
            onLoad={onLoad}
            onError={onError}
          />
        )}
      </div>

      {/* Text always visible — shimmer is image-container only */}
      <div className="news-section__card-body">
        <span className="news-section__card-meta">
          {article.date} | {article.category}
        </span>
        <h4 className="news-section__card-title">{article.title}</h4>
      </div>
    </Link>
  );
}

/**
 * NewsSection
 * @param {string} bgImage   - stadium background image
 * @param {object} featured  - { image, photoCredit, date, category, title, slug }
 * @param {Array}  articles  - [{ id, image, date, category, title, slug }]
 * @param {string} brandName - highlighted name in featured title
 */
export default function NewsSection({
  bgImage,
  featured,
  articles = [],
  brandName = 'NWFL',
}) {
  return (
    <section className="news-section" aria-label="Latest News">

      <div className="news-section__bg">
        {bgImage && <img src={bgImage} alt="" aria-hidden="true" />}
      </div>

      <div className="news-section__inner">

        <h2 className="news-section__heading">
          Know what&apos;s happening around you
        </h2>

        {featured && (
          <div className="news-section__featured">
            {featured.image
              ? <FeaturedImage src={featured.image} alt={featured.title} />
              : <div className="news-section__featured-img news-section__featured-img--placeholder">No image</div>
            }

            <div className="news-section__featured-body">
              <h3 className="news-section__featured-title">
                Get the latest sports news updates, on the local and international sphere. Only on{' '}
                <span>{brandName}</span>
              </h3>

              <Link to="/news-log" className="news-section__featured-cta">
                See News Log <ArrowRightCircle />
              </Link>

              <div className="news-section__featured-meta">
                <span className="news-section__featured-credit">
                  Photo credit: {featured.photoCredit}
                </span>
                <span className="news-section__featured-tag">
                  {featured.date} | {featured.category}
                </span>
              </div>
            </div>
          </div>
        )}

        {articles.length > 0 && (
          <div className="news-section__grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
