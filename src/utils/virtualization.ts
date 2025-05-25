import { useCallback, useEffect, useState } from 'react';

interface VirtualizationOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization(options: VirtualizationOptions) {
  const { itemCount, itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const items = Array.from({ length: endIndex - startIndex + 1 }, (_, index) => startIndex + index);

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    },
    []
  );

  return {
    items,
    startIndex,
    endIndex,
    onScroll,
    totalHeight: itemCount * itemHeight,
    offsetY: startIndex * itemHeight,
  };
}

export function calculateMasonryLayout(
  items: any[],
  containerWidth: number,
  columnCount: number,
  columnGap: number
) {
  const columnWidth = (containerWidth - (columnCount - 1) * columnGap) / columnCount;
  const columns = Array.from({ length: columnCount }, () => ({
    items: [],
    height: 0,
  }));

  items.forEach((item) => {
    // Find the shortest column
    const shortestColumn = columns.reduce(
      (shortest, column, index) => (column.height < columns[shortest].height ? index : shortest),
      0
    );

    // Calculate the height based on aspect ratio
    const aspectRatio = item.width / item.height;
    const height = columnWidth / aspectRatio;

    // Add the item to the shortest column
    columns[shortestColumn].items.push({
      ...item,
      width: columnWidth,
      height,
      top: columns[shortestColumn].height,
      left: shortestColumn * (columnWidth + columnGap),
    });

    // Update the column height
    columns[shortestColumn].height += height + columnGap;
  });

  // Flatten the columns into a single array
  return columns.flatMap((column) => column.items);
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}