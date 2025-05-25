import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MasonryGrid from '../components/MasonryGrid';
import { Photo } from '../types/Photo';

// Mock the virtualization utility
vi.mock('../utils/virtualization', () => ({
  calculateMasonryLayout: (items: any[]) => items.map((item, index) => ({
    ...item,
    width: 300,
    height: 200,
    top: index * 200,
    left: 0
  })),
  useWindowSize: () => ({ width: 1200, height: 800 })
}));

describe('MasonryGrid', () => {
  const mockPhotos: Photo[] = [
    {
      id: 1,
      width: 800,
      height: 600,
      url: 'https://example.com/photo1',
      photographer: 'John Doe',
      photographer_url: 'https://example.com/johndoe',
      photographer_id: 1,
      avg_color: '#FFFFFF',
      src: {
        original: 'https://example.com/photo1/original',
        large2x: 'https://example.com/photo1/large2x',
        large: 'https://example.com/photo1/large',
        medium: 'https://example.com/photo1/medium',
        small: 'https://example.com/photo1/small',
        portrait: 'https://example.com/photo1/portrait',
        landscape: 'https://example.com/photo1/landscape',
        tiny: 'https://example.com/photo1/tiny'
      },
      liked: false,
      alt: 'Test Photo 1'
    },
    {
      id: 2,
      width: 800,
      height: 600,
      url: 'https://example.com/photo2',
      photographer: 'Jane Smith',
      photographer_url: 'https://example.com/janesmith',
      photographer_id: 2,
      avg_color: '#000000',
      src: {
        original: 'https://example.com/photo2/original',
        large2x: 'https://example.com/photo2/large2x',
        large: 'https://example.com/photo2/large',
        medium: 'https://example.com/photo2/medium',
        small: 'https://example.com/photo2/small',
        portrait: 'https://example.com/photo2/portrait',
        landscape: 'https://example.com/photo2/landscape',
        tiny: 'https://example.com/photo2/tiny'
      },
      liked: false,
      alt: 'Test Photo 2'
    }
  ];

  const mockOnPhotoClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
  });

  it('renders the grid with photos', () => {
    render(
      <MasonryGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        loading={false}
      />
    );
    
    // Since we've mocked the virtualization to return all items
    // we should see all photos rendered
    expect(screen.getByAltText('Test Photo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test Photo 2')).toBeInTheDocument();
  });

  it('shows loading indicator when loading', () => {
    render(
      <MasonryGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        loading={true}
      />
    );
    
    // Check for loading indicator (we're looking for the spinner div)
    const loadingElement = document.querySelector('.animate-spin');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders empty grid when no photos', () => {
    render(
      <MasonryGrid
        photos={[]}
        onPhotoClick={mockOnPhotoClick}
        loading={false}
      />
    );
    
    // There should be no photos in the document
    const photos = document.querySelectorAll('img');
    expect(photos.length).toBe(0);
  });
});