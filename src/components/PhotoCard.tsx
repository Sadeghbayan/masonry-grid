import React, { memo } from 'react';
import { PhotoCardProps } from '../types/Photo';

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
  return (
    <div 
      className="relative overflow-hidden transition-transform duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02]"
      onClick={() => onClick(photo)}
      style={{
        width: '100%',
        aspectRatio: `${photo.width}/${photo.height}`,
      }}
    >
      <img
        src={photo.src.medium}
        alt={photo.alt || 'Pexels Photo'}
        loading="lazy"
        className="object-cover w-full h-full transition-opacity duration-300"
        style={{ backgroundColor: photo.avg_color }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end p-4 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100">
        <div className="text-white">
          <p className="text-sm font-medium">{photo.photographer}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(PhotoCard);