import { useEffect, useState } from 'react';
import { co2, hosting } from '@tgwf/co2';
import './CarbonBadge.scss';

const swd = new co2({ model: 'swd', version: 4 });
const CACHE_KEY = 'nwfl-carbon-badge';

function getTransferSize() {
  if (typeof window === 'undefined' || !window.performance) return 0;

  const nav = performance.getEntriesByType?.('navigation')?.[0];
  if (nav) {
    // transferSize is 0 when cached; fall back to encoded/decoded body size.
    const size = nav.transferSize || nav.encodedBodySize || nav.decodedBodySize || 0;
    if (size > 0) return size;
  }

  return performance
    .getEntriesByType?.('resource')
    ?.reduce((sum, entry) => {
      const size = entry.transferSize || entry.encodedBodySize || entry.decodedBodySize || 0;
      return sum + size;
    }, 0) || 0;
}

function getCleanerThan(grams) {
  // Approximate percentile mapping based on Website Carbon / HTTP Archive benchmarks.
  if (grams < 0.1) return 0.9;
  if (grams < 0.25) return 0.75;
  if (grams < 0.5) return 0.55;
  if (grams < 0.8) return 0.35;
  if (grams < 1.2) return 0.2;
  return 0.1;
}

async function computeFootprint() {
  const bytes = getTransferSize();
  if (!bytes || bytes < 1) return null;

  let isGreen = false;
  try {
    const host = window.location.hostname;
    const greenHosts = await hosting.check([host]);
    isGreen = greenHosts.includes(host);
  } catch {
    // keep default false
  }

  const grams = swd.perVisit(bytes, isGreen);
  const cleanerThan = getCleanerThan(grams);

  return {
    grams: Number(grams.toFixed(3)),
    cleanerThan,
    isGreen,
  };
}

const CarbonBadge = () => {
  const [data, setData] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (data) return;

    let cancelled = false;
    computeFootprint().then((result) => {
      if (cancelled || !result) return;
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
      } catch {
        // ignore storage errors
      }
      setData(result);
    });

    return () => {
      cancelled = true;
    };
  }, [data]);

  if (!data) return null;

  const { grams, cleanerThan, isGreen } = data;
  const percent = Math.round(cleanerThan * 100);

  return (
    <div className="carbon-badge" aria-label={`Carbon footprint: ${grams} grams of CO2 per page view`}>
      <span
        className={`carbon-badge__dot ${isGreen ? 'carbon-badge__dot--green' : 'carbon-badge__dot--neutral'}`}
        aria-hidden="true"
      />
      <span className="carbon-badge__text">
        <strong>{grams}g CO₂</strong> / page view
      </span>
      <span className="carbon-badge__divider" aria-hidden="true" />
      <span className="carbon-badge__rating">
        cleaner than {percent}% of web pages
      </span>
    </div>
  );
};

export default CarbonBadge;
