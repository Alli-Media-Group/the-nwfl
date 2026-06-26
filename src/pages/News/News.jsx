import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../lib/api';
import { useImageLoader } from '../../hooks/useImageLoader';
import './News.scss';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ArticleCard({ post }) {
  const { loaded, onLoad, onError } = useImageLoader();
  return (
    <Link to={`/news/${post.slug}`} className="news-page__card">
      <div className={`news-page__card-img${!loaded ? ' is-loading' : ''}`}>
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className={!loaded ? 'is-loading' : ''}
            onLoad={onLoad}
            onError={onError}
          />
        ) : (
          <div className="news-page__card-img-placeholder">NWFL</div>
        )}
      </div>
      <div className="news-page__card-body">
        <span className="news-page__card-meta">
          {formatDate(post.published_at)} | {post.category}
        </span>
        <h3 className="news-page__card-title">{post.title}</h3>
        {post.excerpt && (
          <p className="news-page__card-excerpt">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPosts('news')
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="news-page">
      <div className="news-page__header">
        <h1 className="news-page__title">Latest News</h1>
        <p className="news-page__subtitle">
          Updates, announcements and stories from the Nigeria Women Football League.
        </p>
      </div>

      {loading && <div className="news-page__loading">Loading news...</div>}
      {error && <div className="news-page__error">{error}</div>}

      {!loading && !error && featured && (
        <div className="news-page__featured">
          <Link to={`/news/${featured.slug}`} className="news-page__featured-link">
            {featured.featured_image_url ? (
              <img
                src={featured.featured_image_url}
                alt={featured.title}
                className="news-page__featured-img"
              />
            ) : (
              <div className="news-page__featured-img news-page__featured-img--placeholder">NWFL</div>
            )}
            <div className="news-page__featured-body">
              <span className="news-page__featured-meta">
                {formatDate(featured.published_at)} | {featured.category}
              </span>
              <h2 className="news-page__featured-title">{featured.title}</h2>
              {featured.excerpt && (
                <p className="news-page__featured-excerpt">{featured.excerpt}</p>
              )}
            </div>
          </Link>
        </div>
      )}

      {rest.length > 0 && (
        <div className="news-page__grid">
          {rest.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
