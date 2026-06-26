import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleries } from '../../lib/api';
import { useImageLoader } from '../../hooks/useImageLoader';
import './Gallery.scss';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function GalleryCard({ gallery }) {
  const { loaded, onLoad, onError } = useImageLoader();
  return (
    <Link to={`/gallery/${gallery.slug}`} className="gallery-page__card">
      <div className={`gallery-page__card-img${!loaded ? ' is-loading' : ''}`}>
        {gallery.cover_image_url ? (
          <img
            src={gallery.cover_image_url}
            alt={gallery.title}
            className={!loaded ? 'is-loading' : ''}
            onLoad={onLoad}
            onError={onError}
          />
        ) : (
          <div className="gallery-page__card-img-placeholder">NWFL</div>
        )}
      </div>
      <div className="gallery-page__card-body">
        <span className="gallery-page__card-meta">
          {formatDate(gallery.published_at)} | {gallery.image_count} photos
        </span>
        <h3 className="gallery-page__card-title">{gallery.title}</h3>
      </div>
    </Link>
  );
}

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchGalleries()
      .then((data) => {
        if (cancelled) return;
        setGalleries(data.galleries);
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
    <section className="gallery-page">
      <div className="gallery-page__header">
        <h1 className="gallery-page__title">Gallery</h1>
        <p className="gallery-page__subtitle">
          Matchday photos, moments and highlights from the NWFL.
        </p>
      </div>

      {loading && <div className="gallery-page__loading">Loading galleries...</div>}
      {error && <div className="gallery-page__error">{error}</div>}

      {galleries.length > 0 && (
        <div className="gallery-page__grid">
          {galleries.map((gallery) => (
            <GalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>
      )}

      {!loading && !error && galleries.length === 0 && (
        <div className="gallery-page__empty">No galleries yet.</div>
      )}
    </section>
  );
}
