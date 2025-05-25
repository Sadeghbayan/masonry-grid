import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoCard from '../components/PhotoCard';
import { Photo } from '../types/Photo';

describe('PhotoCard', () => {
  const mockPhoto: Photo = {
    id: 1,
    width: 800,
    height: 600,
    url: 'https://example.com/photo',
    photographer: 'John Doe',
    photographer_url: 'https://example.com/johndoe',
    photographer_id: 1,
    avg_color: '#FFFFFF',
    src: {
      original: 'https://example.com/photo/original',
      large2x: 'https://example.com/photo/large2x',
      large: 'https://example.com/photo/large',
      medium: 'https://example.com/photo/medium',
      small: 'https://example.com/photo/small',
      portrait: 'https://example.com/photo/portrait',
      landscape: 'https://example.com/photo/landscape',
      tiny: 'https://example.com/photo/tiny'
    },
    liked: false,
    alt: 'Test Photo'
  };

  const mockOnClick = vi.fn();

  it('renders the photo card correctly', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);
    
    // Check that the image is rendered with the correct src
    const image = screen.getByAltText('Test Photo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPhoto.src.medium);
    
    // Check that the photographer name is in the document
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);
    
    // Click on the photo card
    fireEvent.click(screen.getByAltText('Test Photo'));
    
    // Check that onClick was called with the photo
    expect(mockOnClick).toHaveBeenCalledWith(mockPhoto);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});