import React from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  sizes?: string; // e.g., "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  srcSet?: string; // e.g., "image-320w.jpg 320w, image-640w.jpg 640w"
  fallback?: string; // Fallback image if WebP is not supported
}

/**
 * OptimizedImage Component
 * 
 * Provides optimized image loading with:
 * - Lazy loading support
 * - Async decoding
 * - Responsive images with srcset (when provided)
 * - WebP support preparation (when images are converted)
 * 
 * Usage:
 * <OptimizedImage
 *   src="/img/property.jpg"
 *   alt="Property image"
 *   className="w-full h-full object-cover"
 *   loading="lazy"
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  decoding = "async",
  sizes,
  srcSet,
  fallback,
}) => {
  // Generate WebP src if available (assumes .webp version exists)
  // This is a placeholder - actual WebP conversion requires build tools
  const getWebPSrc = (originalSrc: string): string | null => {
    // If src already includes .webp, return as is
    if (originalSrc.includes(".webp")) {
      return originalSrc;
    }
    
    // In production, you would check if the file exists
    // For now, we'll use the original src as fallback
    return null; // Return null to use original format
  };

  const webpSrc = getWebPSrc(src);
  const finalSrc = webpSrc || src;

  return (
    <picture>
      {/* WebP source (when available) */}
      {webpSrc && (
        <source
          srcSet={srcSet ? srcSet.replace(/\.(jpg|jpeg|png)/gi, ".webp") : webpSrc}
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      {/* Fallback image */}
      <img
        src={fallback || finalSrc}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        srcSet={srcSet}
        sizes={sizes}
        // Add fetchpriority for above-the-fold images
        {...(loading === "eager" && { fetchPriority: "high" })}
      />
    </picture>
  );
};

export default OptimizedImage;

