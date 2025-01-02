import { useState, useEffect, useRef, RefObject } from 'react';

interface UseVideoLoaderProps {
  isMobile: boolean;
}

export const useVideoLoader = ({ isMobile }: UseVideoLoaderProps) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      setIsVideoVisible(false);
      return;
    }

    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Silently handle video play error
            });
          }
        }
      });
    }, options);

    const currentRef = videoContainerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMobile]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setIsVideoLoaded(false);
  };

  return {
    isVideoVisible,
    isVideoLoaded,
    videoRef,
    videoContainerRef,
    handleVideoLoad,
    handleVideoError
  };
};
