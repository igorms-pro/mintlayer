import React from 'react';

export interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Reusable Divider component
 */
export const Divider: React.FC<DividerProps> = ({ 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const baseClasses = orientation === 'horizontal' 
    ? 'border-t border-grey-secondary my-4 lg:my-6' 
    : 'border-l border-grey-secondary mx-6 h-full';

  return (
    <div className={`${baseClasses} ${className}`.trim()} />
  );
}; 