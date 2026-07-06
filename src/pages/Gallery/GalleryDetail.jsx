import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGallery } from '../../lib/api';
import { useImageLoader } from '../../hooks/useImageLoader';
import './GalleryDetail.scss';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function GalleryImage({ image }) {
  const { loaded, onLoad, onError } = useImageLoader();
  return (
    <div className={`gallery-detail__item${!loaded ? ' is-loading' : ''}`}>
      <img
        src={image.image_url}
        alt={image.caption || 'Gallery image'}
        className={!loaded ? 'is-loading' : ''}
        onLoad={onLoad}
        onError={onError}
      />
      {image.caption && <span className="gallery-detail__caption">{image.caption}</span>}
    </div>
  );
}

export default function GalleryDetail() {
  const { slug } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchGallery(slug)
      .then((data) => {
        if (cancelled) return;
        setGallery(data);
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
    return <div className="gallery-detail__loading">Loading gallery...</div>;
  }

  if (error || !gallery) {
    return (
      <div className="gallery-detail__error">
        <h1>Gallery not found</h1>
        <Link to="/gallery" className="gallery-detail__back">Back to Gallery</Link>
      </div>
    );
  }

  return (
    <section className="gallery-detail">
      <Link to="/gallery" className="gallery-detail__back">← Back to Gallery</Link>
      <div className="gallery-detail__header">
        <h1 className="gallery-detail__title">{gallery.title}</h1>
        {gallery.description && (
          <p className="gallery-detail__description">{gallery.description}</p>
        )}
        <span className="gallery-detail__meta">
          {formatDate(gallery.published_at)} | {gallery.images?.length || 0} photos
        </span>
      </div>

      {gallery.images?.length > 0 && (
        <div className="gallery-detail__grid">
          {gallery.images.map((image) => (
            <GalleryImage key={image.id} image={image} />
          ))}
        </div>
      )}
    </section>
  );
}
