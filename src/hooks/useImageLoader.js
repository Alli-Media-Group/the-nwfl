import { useState } from 'react';

/**
 * Returns { loaded, onLoad, onError } to track image load state.
 * Attach onLoad/onError to the <img> element.
 * `loaded` flips true once the image fires onLoad or onError.
 */
export function useImageLoader() {
  const [loaded, setLoaded] = useState(false);
  return {
    loaded,
    onLoad:  () => setLoaded(true),
    onError: () => setLoaded(true), // stop shimmer even if image fails
  };
}
