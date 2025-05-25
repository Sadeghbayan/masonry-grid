import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, User, Calendar, Image, ExternalLink } from 'lucide-react';
import { getPhoto } from '../services/api';
import { Photo } from '../types/Photo';

const PhotoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function loadPhoto() {
      if (!id) return;
      
      try {
        setLoading(true);
        const photoData = await getPhoto(parseInt(id));
        setPhoto(photoData);
        setError(null);
      } catch (err) {
        console.error('Error loading photo:', err);
        setError('Failed to load photo details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadPhoto();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && !photo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-red-600">Error</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          <button
            onClick={handleBackClick}
            className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (!photo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center px-4 py-2 mb-6 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Gallery
        </button>

        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="relative bg-gray-200">
            {!imageLoaded && (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: photo.avg_color }}
              >
                <div className="w-12 h-12 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
              </div>
            )}
            <img
              src={photo.src.large2x}
              alt={photo.alt || 'Photo'}
              className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {photo.alt || 'Untitled Photo'}
              </h1>
              
              <a
                href={photo.src.original}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
              >
                <Download className="w-5 h-5 mr-2" /> Download Original
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Photo Details</h2>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="font-medium mr-2">Photographer:</span>
                    <a 
                      href={photo.photographer_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      {photo.photographer}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="font-medium mr-2">Date Added:</span>
                    {/* Since Pexels API doesn't provide date, we'll display a placeholder */}
                    <span>Information not available</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Image className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="font-medium mr-2">Resolution:</span>
                    <span>{photo.width} × {photo.height}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Description</h2>
                <p className="text-gray-700">
                  {photo.alt || 'No description available for this photo.'}
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="mb-3 text-lg font-medium text-gray-800">Source</h3>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:underline"
                  >
                    View on Pexels <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;