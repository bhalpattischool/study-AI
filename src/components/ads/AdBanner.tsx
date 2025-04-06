
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface AdBannerProps {
  className?: string;
}

// This component renders a Google AdSense banner ad
const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Skip rendering ads on login and signup pages
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup') || location.pathname.includes('/forgot-password');
  
  useEffect(() => {
    // Only attempt to load ads if not on auth pages
    if (isAuthPage || !adContainerRef.current) return;
    
    try {
      // Push the ad only when the component mounts
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error('Error loading ad:', error);
    }
  }, [isAuthPage]);
  
  if (isAuthPage) return null;
  
  return (
    <div className={`ad-container ${className}`}>
      <div ref={adContainerRef}>
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-7324281582833422"
          data-ad-slot="2453511167"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdBanner;
