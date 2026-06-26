import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../lib/api';
import { useImageLoader } from '../../hooks/useImageLoader';
import './Blog.scss';

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
    <Link to={`/blog/${post.slug}`} className="blog-page__card">
      <div className={`blog-page__card-img${!loaded ? ' is-loading' : ''}`}>
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className={!loaded ? 'is-loading' : ''}
            onLoad={onLoad}
            onError={onError}
          />
        ) : (
          <div className="blog-page__card-img-placeholder">NWFL</div>
        )}
      </div>
      <div className="blog-page__card-body">
        <span className="blog-page__card-meta">
          {formatDate(post.published_at)} | {post.category}
        </span>
        <h3 className="blog-page__card-title">{post.title}</h3>
        {post.excerpt && (
          <p className="blog-page__card-excerpt">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPosts('blog')
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

  return (
    <section className="blog-page">
      <div className="blog-page__header">
        <h1 className="blog-page__title">Blog & Features</h1>
        <p className="blog-page__subtitle">
          In-depth stories, player profiles and features from the NWFL.
        </p>
      </div>

      {loading && <div className="blog-page__loading">Loading blog...</div>}
      {error && <div className="blog-page__error">{error}</div>}

      {posts.length > 0 && (
        <div className="blog-page__grid">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="blog-page__empty">No blog posts yet.</div>
      )}
    </section>
  );
}
