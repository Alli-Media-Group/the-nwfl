import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPost } from '../../lib/api';
import './NewsDetail.scss';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPost(slug)
      .then((data) => {
        if (cancelled) return;
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <div className="news-detail__loading">Loading article...</div>;
  }

  if (error || !post) {
    return (
      <div className="news-detail__error">
        <h1>Article not found</h1>
        <Link to="/news" className="news-detail__back">Back to News</Link>
      </div>
    );
  }

  return (
    <article className="news-detail">
      <div className="news-detail__header">
        <Link to="/news" className="news-detail__back">← Back to News</Link>
        <span className="news-detail__meta">
          {formatDate(post.published_at)} | {post.category}
        </span>
        <h1 className="news-detail__title">{post.title}</h1>
        {post.tags?.length > 0 && (
          <div className="news-detail__tags">
            {post.tags.map((tag) => (
              <span key={tag} className="news-detail__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {post.featured_image_url && (
        <div className="news-detail__image-wrap">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="news-detail__image"
          />
        </div>
      )}

      <div
        className="news-detail__content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.source_url && (
        <div className="news-detail__source">
          <a href={post.source_url} target="_blank" rel="noopener noreferrer">
            Read original article on thenwfl.com →
          </a>
        </div>
      )}
    </article>
  );
}
