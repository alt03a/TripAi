/**
 * Image Optimization Utilities
 * Provides helpers for lazy loading, responsive images, and performance optimization
 */

export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  quality?: number;
}

/**
 * Generate responsive image srcset for different screen sizes
 */
export function generateSrcSet(src: string, sizes: number[] = [640, 768, 1024, 1280, 1920]): string {
  return sizes
    .map((size) => `${src}?w=${size} ${size}w`)
    .join(", ");
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { max?: string; size: string }[]): string {
  return breakpoints
    .map(({ max, size }) => (max ? `(max-width: ${max}) ${size}` : size))
    .join(", ");
}

/**
 * Lazy load images using Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          const src = target.dataset.src;
          const srcset = target.dataset.srcset;

          if (src) target.src = src;
          if (srcset) target.srcset = srcset;

          target.classList.remove("lazy");
          observer.unobserve(target);
        }
      });
    },
    {
      rootMargin: "50px 0px", // Start loading 50px before entering viewport
      threshold: 0.01,
    }
  );

  observer.observe(img);
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Get optimized image URL with transformations
 * Note: This is a placeholder. In production, integrate with your CDN/image service
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
  } = {}
): string {
  const params = new URLSearchParams();

  if (options.width) params.append("w", options.width.toString());
  if (options.height) params.append("h", options.height.toString());
  if (options.quality) params.append("q", options.quality.toString());
  if (options.format) params.append("fm", options.format);

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Calculate aspect ratio for images
 */
export function getAspectRatio(width: number, height: number): string {
  return `${width} / ${height}`;
}

/**
 * Compress image on client-side before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    const img = new Image();
    img.onload = () => resolve(img.width === 2);
    img.onerror = () => resolve(false);
    img.src = webP;
  });
}

/**
 * Check if browser supports AVIF format
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    const img = new Image();
    img.onload = () => resolve(img.width === 2);
    img.onerror = () => resolve(false);
    img.src = avif;
  });
}

/**
 * Generate blurhash placeholder
 * Note: Requires blurhash library for full implementation
 */
export function generatePlaceholder(width: number = 32, height: number = 32): string {
  // Simple gradient placeholder
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect fill='%23f0f0f0' width='${width}' height='${height}' filter='url(%23b)'/%3E%3C/svg%3E`;
}
