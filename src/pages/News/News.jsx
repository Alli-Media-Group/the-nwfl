import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../lib/api';
import { useImageLoader } from '../../hooks/useImageLoader';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Modal from '../../components/ui/Modal/Modal';
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

function FeaturedArticle({ post }) {
  const { loaded, onLoad, onError } = useImageLoader();

  return (
    <div className="news-page__featured">
      <Link to={`/news/${post.slug}`} className="news-page__featured-link">
        <div
          className={`news-page__featured-media${!loaded ? ' is-loading' : ''}`}
        >
          {post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className={!loaded ? 'is-loading' : ''}
              onLoad={onLoad}
              onError={onError}
            />
          ) : (
            <div className="news-page__featured-placeholder">NWFL</div>
          )}
        </div>

        <div className="news-page__featured-body">
          <span className="news-page__featured-meta">
            {formatDate(post.published_at)} | {post.category}
          </span>
          <h2 className="news-page__featured-title">{post.title}</h2>
          {post.excerpt && (
            <p className="news-page__featured-excerpt">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </div>
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
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="news-page">
      <div className="news-page__inner">
        <div className="news-page__header">
          <h1 className="news-page__title">Latest News</h1>
          <p className="news-page__subtitle">
            Updates, announcements and stories from the Nigeria Women Football League.
          </p>
        </div>

        {loading && <div className="news-page__loading">Loading news...</div>}

        {!loading && error && (
          <Modal
            isOpen
            onClose={() => setError(null)}
            title="Unable to load news"
          >
            <p>{error}</p>
            <p>Please check your connection and try again later.</p>
          </Modal>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="news-page__empty">
            No news articles available right now.
          </div>
        )}

        {!loading && !error && featured && (
          <FeaturedArticle post={featured} />
        )}

        {!loading && !error && rest.length > 0 && (
          <div className="news-page__grid">
            {rest.map((post) => (
              <ArticleCard
                key={post.id}
                article={post}
                variant="dark"
                showExcerpt
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
