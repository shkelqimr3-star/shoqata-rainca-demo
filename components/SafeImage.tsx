"use client";

import { useState } from "react";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  imgClassName?: string;
};

function isSupportedUrl(src?: string | null) {
  if (!src) return false;
  return src.startsWith("https://") || src.startsWith("/uploads/") || src.startsWith("/demo/");
}

export function SafeImage({ src, alt, className = "", fallbackClassName = "asset-fallback", imgClassName = "object-cover" }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src || "";

  if (!isSupportedUrl(imageSrc) || failed) {
    return (
      <div className={`${className} ${fallbackClassName} grid place-items-center bg-skywash`} aria-label={alt}>
        <span className="text-xs font-black uppercase tracking-wide text-white/80">Shoqata Rainca</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageSrc} alt={alt} className={`${className} ${imgClassName}`} onError={() => setFailed(true)} />
  );
}
