import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPhotos, searchPhotos } from '../services/api';
import { Photo } from '../types/Photo';
import MasonryGrid from '../components/MasonryGrid';
import SearchBar from '../components/SearchBar';
import ErrorBoundary from '../components/ErrorBoundary';
import { Camera } from 'lucide-react';

const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const loadPhotos = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      const newPage = reset ? 1 : page;
      
      const response = searchQuery
        ? await searchPhotos(searchQuery, newPage)
        : await fetchPhotos(newPage);
      
      const newPhotos = response.photos;
      
      setPhotos(prev => (reset ? newPhotos : [...prev, ...newPhotos]));
      setHasMore(newPhotos.length > 0 && response.page < Math.ceil(response.total_results / response.per_page));
      setPage(prev => (reset ? 2 : prev + 1));
      setError(null);
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('Failed to load photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    loadPhotos(true);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadPhotos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadPhotos]);

  const handlePhotoClick = useCallback((photo: Photo) => {
    navigate(`/photo/${photo.id}`);
  }, [navigate]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Camera className="w-8 h-8 mr-3 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Pixel Perfect Gallery</h1>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <ErrorBoundary>
          {error ? (
            <div className="p-6 mx-auto max-w-lg bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-red-600">Error</h2>
              <p className="mb-4 text-gray-700">{error}</p>
              <button
                onClick={() => loadPhotos(true)}
                className="px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-6 px-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {photos.length > 0 
                      ? `Search results for "${searchQuery}"`
                      : `No results found for "${searchQuery}"`}
                  </h2>
                </div>
              )}
              
              <MasonryGrid
                photos={photos}
                onPhotoClick={handlePhotoClick}
                loading={loading}
              />
              
              {!hasMore && photos.length > 0 && (
                <div className="mt-8 text-center text-gray-600">
                  You've reached the end of the results.
                </div>
              )}
            </>
          )}
        </ErrorBoundary>
      </main>

      <footer className="py-6 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 text-center">
          <p>Photos provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Pexels</a></p>
          <p className="mt-2 text-sm">Created for demonstration purposes only</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;