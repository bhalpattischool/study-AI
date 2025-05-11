
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  slot?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  className = "", 
  slot = "2406295156" 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Initialize ads when component mounts
    if (isVisible && window.adsbygoogle && !adLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [isVisible, adLoaded]);

  if (!isVisible) return null;

  return (
    <div className={`ad-container relative overflow-hidden rounded-lg border mb-4 mt-2 ${className}`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-1 top-1 z-10 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full hover:bg-white dark:hover:bg-gray-700"
        aria-label="Close advertisement"
      >
        <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
      
      <ins 
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7122053316163276"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
