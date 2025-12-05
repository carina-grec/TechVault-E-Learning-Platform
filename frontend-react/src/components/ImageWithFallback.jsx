import React, { useState } from 'react';
import { cn } from '../lib/cn.js';

const fallbackGradient =
  'linear-gradient(135deg, rgba(209,84,155,0.9) 0%, rgba(144,97,255,0.9) 50%, rgba(96,165,250,0.85) 100%)';

export function ImageWithFallback({ src, alt, className, rounded = 'rounded-lg' }) {
  const [hasError, setHasError] = useState(false);
  return hasError || !src ? (
    <div
      role="img"
      aria-label={alt}
      className={cn('flex items-center justify-center text-sm text-white', rounded, className)}
      style={{ backgroundImage: fallbackGradient }}
    >
      <span className="px-3 py-1 bg-black/40 rounded-md">Image</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={cn('object-cover', rounded, className)}
      onError={() => setHasError(true)}
    />
  );
}

export default ImageWithFallback;
