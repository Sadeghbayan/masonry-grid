import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Photo } from '../types/Photo';
import { calculateMasonryLayout, useWindowSize } from '../utils/virtualization';
import PhotoCard from './PhotoCard';

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  loading: boolean;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ photos, onPhotoClick, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const windowSize = useWindowSize();
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [windowSize]);

  // Determine column count based on container width
  const columnCount = useMemo(() => {
    if (containerWidth < 640) return 1; // Mobile
    if (containerWidth < 768) return 2; // Small tablet
    if (containerWidth < 1024) return 3; // Tablet
    if (containerWidth < 1280) return 4; // Small desktop
    return 5; // Large desktop
  }, [containerWidth]);

  const columnGap = 16; // Gap between columns

  // Calculate masonry layout
  const layoutItems = useMemo(() => {
    if (!photos.length || !containerWidth) return [];
    return calculateMasonryLayout(photos, containerWidth, columnCount, columnGap);
  }, [photos, containerWidth, columnCount]);

  // Calculate container height based on the tallest column
  const containerHeight = useMemo(() => {
    if (!layoutItems.length) return 0;
    return Math.max(...layoutItems.map((item) => item.top + item.height));
  }, [layoutItems]);

  // Handle scrolling and virtualization
  const [scrollPosition, setScrollPosition] = useState(0);
  const viewportHeight = windowSize.height;
  const bufferSize = 1000; // Extra buffer to prevent flickering

  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Only render items that are in or near the viewport
  const visibleItems = useMemo(() => {
    return layoutItems.filter(
      (item) =>
        item.top + item.height >= scrollPosition - bufferSize &&
        item.top <= scrollPosition + viewportHeight + bufferSize
    );
  }, [layoutItems, scrollPosition, viewportHeight]);

  return (
    <div ref={containerRef} className="relative w-full px-4">
      <div
        style={{
          position: 'relative',
          height: `${containerHeight}px`,
          width: '100%',
        }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              width: `${item.width}px`,
              height: `${item.height}px`,
              top: `${item.top}px`,
              left: `${item.left}px`,
              padding: '8px',
            }}
          >
            <PhotoCard photo={item} onClick={onPhotoClick} />
          </div>
        ))}
        {loading && (
          <div className="flex items-center justify-center w-full py-8">
            <div className="w-12 h-12 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasonryGrid;