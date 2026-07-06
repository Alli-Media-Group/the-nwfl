import { Link } from "react-router-dom";
import refImage from "../../data/images/ref.webp";
import "./NotFound.scss";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__inner">
        <div className="not-found__media">
          <div className="not-found__image-wrap">
            <img
              src={refImage}
              alt="Referee holding up a red card under stadium floodlights"
              className="not-found__image"
            />
          </div>
        </div>

        <div className="not-found__content">
          <p className="not-found__eyebrow">Error Code: 404</p>

          <h1 className="not-found__title">
            You&apos;ve Been
            <span> Sent Off</span>
          </h1>

          <p className="not-found__copy">
            That page doesn&apos;t exist. Even VAR couldn&apos;t pull it back into play.
          </p>

          <Link to="/" className="btn btn--outline not-found__cta">
            <HomeIcon />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
