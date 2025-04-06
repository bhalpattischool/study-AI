
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';

interface AdBannerProps {
  className?: string;
}

// This component renders a Google AdSense banner ad with enhanced UI and error handling
const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  
  // Skip rendering ads on login and signup pages
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup') || location.pathname.includes('/forgot-password');
  
  useEffect(() => {
    // Only attempt to load ads if not on auth pages
    if (isAuthPage || !adContainerRef.current) return;
    
    try {
      // Add a small timeout to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        // Push the ad only when the component mounts
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
        
        // Set a timeout to check if ad was successfully loaded
        // This is a simple heuristic since AdSense doesn't provide direct callbacks
        setTimeout(() => {
          const adContainer = adContainerRef.current;
          if (adContainer && adContainer.querySelector('iframe')) {
            setIsAdLoaded(true);
          } else {
            setAdError(true);
          }
        }, 2000);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error loading ad:', error);
      setAdError(true);
    }
  }, [isAuthPage]);
  
  if (isAuthPage) return null;
  if (adError) return null; // Don't show anything if there's an error
  
  return (
    <div className={`ad-container ${className} transition-all duration-300 ${isAdLoaded ? 'opacity-100' : 'opacity-60'}`}>
      <div className="relative">
        {!isAdLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-purple-400 animate-pulse">Loading sponsor content...</div>
          </div>
        )}
        
        <div className="border border-purple-100 dark:border-purple-900 rounded-md overflow-hidden" ref={adContainerRef}>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-7324281582833422"
            data-ad-slot="2453511167"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
        
        {isAdLoaded && (
          <div className="flex justify-between items-center mt-1 px-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Sponsored Content</span>
            <span className="text-xs text-purple-500 dark:text-purple-400">
              Supporting free education
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
