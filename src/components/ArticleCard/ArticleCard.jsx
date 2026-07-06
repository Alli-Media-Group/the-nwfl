import { Link } from "react-router-dom";
import { useImageLoader } from "../../hooks/useImageLoader";
import "./ArticleCard.scss";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * ArticleCard
 * @param {object} article         - { slug, title, image, date | published_at, category, excerpt }
 * @param {string} variant         - "dark" | "light"
 * @param {boolean} showExcerpt    - whether to render the excerpt
 */
export default function ArticleCard({
  article,
  variant = "dark",
  showExcerpt = false,
}) {
  const { loaded, onLoad, onError } = useImageLoader();
  const dateValue = article.date || article.published_at;
  const imageUrl = article.image || article.featured_image_url || article.image_url;

  return (
    <Link
      to={`/news/${article.slug}`}
      className={`article-card article-card--${variant}`}
      aria-label={article.title}
    >
      <div
        className={`article-card__media${!loaded && imageUrl ? " is-loading" : ""}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className={!loaded ? "is-loading" : ""}
            onLoad={onLoad}
            onError={onError}
          />
        ) : (
          <div className="article-card__placeholder">NWFL</div>
        )}
      </div>

      <div className="article-card__body">
        <span className="article-card__meta">
          {formatDate(dateValue)} | {article.category}
        </span>
        <h3 className="article-card__title">{article.title}</h3>
        {showExcerpt && article.excerpt && (
          <p className="article-card__excerpt">{article.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
