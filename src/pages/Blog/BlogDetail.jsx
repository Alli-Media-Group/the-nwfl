import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPost } from '../../lib/api';
import './BlogDetail.scss';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
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
    return <div className="blog-detail__loading">Loading article...</div>;
  }

  if (error || !post) {
    return (
      <div className="blog-detail__error">
        <h1>Article not found</h1>
        <Link to="/blog" className="blog-detail__back">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="blog-detail">
      <div className="blog-detail__header">
        <Link to="/blog" className="blog-detail__back">← Back to Blog</Link>
        <span className="blog-detail__meta">
          {formatDate(post.published_at)} | {post.category}
        </span>
        <h1 className="blog-detail__title">{post.title}</h1>
        {post.tags?.length > 0 && (
          <div className="blog-detail__tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-detail__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {post.featured_image_url && (
        <div className="blog-detail__image-wrap">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="blog-detail__image"
          />
        </div>
      )}

      <div
        className="blog-detail__content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.source_url && (
        <div className="blog-detail__source">
          <a href={post.source_url} target="_blank" rel="noopener noreferrer">
            Read original article on thenwfl.com →
          </a>
        </div>
      )}
    </article>
  );
}
