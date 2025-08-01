import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Simple Loader Component
 */
export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-black-primary`} />
    </div>
  );
}; 