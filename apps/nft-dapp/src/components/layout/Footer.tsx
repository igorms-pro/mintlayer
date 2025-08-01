import React from 'react';

/**
 * Footer Component
 * Displays copyright information at the bottom of the page
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4 mt-12">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center text-sm space-y-1">
          <p>All rights reserved.</p>
          <p>Kiln Fullstack Team, Inc. 2025</p>
        </div>
      </div>
    </footer>
  );
}; 