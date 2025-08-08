'use client';

import { useEffect } from 'react';

export function UmamiAnalytics() {
  useEffect(() => {
    // Always load in development for testing
    const analyticsUrl = (process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.domain8.com.au').trim();
    const websiteId = (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || 'tier-0-portfolio').trim();
    
    // Check if script is already loaded using a more robust approach
    const existingScript = Array.from(document.querySelectorAll('script')).find(
      script => script.getAttribute('data-website-id') === websiteId
    );
    if (existingScript) {
      console.log('Umami script already loaded');
      return;
    }
    
    // Create and inject the script
    const script = document.createElement('script');
    script.src = `${analyticsUrl}/script.js`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-website-id', websiteId);
    
    script.onload = () => {
      console.log('Umami analytics loaded with website ID:', websiteId);
    };
    
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      // Don't remove the script on cleanup to avoid re-adding on re-renders
    };
  }, []);
  
  return null;
}