import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateSrcSet, generateSizes, lazyLoadImage, getOptimizedImageUrl } from "@/lib/imageOptimization";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  quality?: number;
  responsiveSizes?: { max?: string; size: string }[];
  widths?: number[];
}

export const OptimizedImage = ({
  src,
  alt,
  lazy = true,
  aspectRatio,
  objectFit = "cover",
  quality = 80,
  className,
  responsiveSizes,
  widths,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && lazy) {
      lazyLoadImage(img);
    }
  }, [lazy]);

  const optimizedSrc = getOptimizedImageUrl(src, { quality });
  const srcSet = widths ? generateSrcSet(src, widths) : undefined;
  const sizesAttr = responsiveSizes ? generateSizes(responsiveSizes) : undefined;

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", className)}
      style={{
        aspectRatio: aspectRatio || undefined,
      }}
    >
      <img
        ref={imgRef}
        src={lazy ? undefined : optimizedSrc}
        data-src={lazy ? optimizedSrc : undefined}
        srcSet={lazy ? undefined : srcSet}
        data-srcset={lazy ? srcSet : undefined}
        sizes={sizesAttr}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          lazy && "lazy"
        )}
        style={{
          objectFit,
        }}
        {...props}
      />
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <p className="text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
};
