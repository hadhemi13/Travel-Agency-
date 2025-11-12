'use client'
import { useState } from 'react';

interface ProgramImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProgramImage = ({ src, alt, className = '' }: ProgramImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const defaultImage = '/assets/images/default-trip.jpg';
  
  // Utiliser l'image par défaut si l'URL est vide ou en cas d'erreur
  const imageSrc = !src || imageError ? defaultImage : src;

  return (
    <div className="relative w-full h-full">
      {/* Skeleton de chargement */}
      {isLoading && !imageError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
      )}
      
      {/* Image principale */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading && !imageError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
      
      {/* Badge AI Generated */}
      {!imageError && src && src.includes('pollinations.ai') && !isLoading && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <span>✨</span>
          <span>AI Generated</span>
        </div>
      )}
    </div>
  );
};