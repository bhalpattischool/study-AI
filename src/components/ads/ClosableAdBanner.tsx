
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface ClosableAdBannerProps {
  className?: string;
}

const ClosableAdBanner: React.FC<ClosableAdBannerProps> = ({ className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!adRef.current) return;
    try {
      const timer = setTimeout(() => {
        // Google adsbygoogle push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // Simple check if loaded
        setTimeout(() => {
          const hasFrame = !!adRef.current?.querySelector("iframe");
          setAdLoaded(hasFrame);
        }, 2000);
      }, 500);
      return () => clearTimeout(timer);
    } catch {
      // ignore ad errors
    }
  }, []);

  if (closed) return null;

  return (
    <div className={`relative ${className} group transition-all duration-500`}>
      {/* Close button */}
      <button
        aria-label="Close Ad"
        onClick={() => setClosed(true)}
        className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        style={{ background: "rgba(255,255,255,0.8)" }}
      >
        <X className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
      </button>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7324281582833422"
          data-ad-slot="4781389084"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
      {!adLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/50">
          <span className="text-xs text-purple-500 animate-pulse">Ad loading...</span>
        </div>
      )}
      {adLoaded && (
        <div className="text-center mt-1 text-xs text-gray-400">Sponsored • Click to support us</div>
      )}
    </div>
  );
};

export default ClosableAdBanner;
