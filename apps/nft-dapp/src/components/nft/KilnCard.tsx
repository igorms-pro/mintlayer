import React from 'react';
import { KILN_SOCIAL_LINKS, KILN_WEBSITE } from '@/config/constants';

/**
 * Kiln Card Component
 */
export const KilnCard: React.FC = () => {
  return (
    <div className="bg-white border border-grey-secondary p-5 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="relative mr-4">
          <div className="border border-grey-secondary rounded-full w-14 h-14 flex items-center justify-center">
            <img
              src="/kiln-logo.svg"
              alt="Kiln"
              className="h-6 w-[69px]"
              width={69}
              height={24}
            />
          </div>
          <img 
            src="/certified.svg" 
            alt="Verified" 
            className="absolute -bottom-0 -right-1 w-4 h-4" 
          />
        </div>
        <div>
          <div className="font-semibold text-black-secondary">KILN</div>
          <div className="flex items-center text-sm text-grey-primary">
            @Kiln
          </div>
        </div>
      </div>
      
      <p className="text-sm text-grey-primary mb-4 leading-6">
        Hundreds of companies use Kiln to earn rewards on their digital assets, or to whitelabel earning functionality into their products.
      </p>
      
      <div className="flex items-center space-x-4 mb-4">
        {KILN_SOCIAL_LINKS.map((social) => (
          <a 
            key={social.name}
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-base text-black-secondary hover:text-black-primary hover:scale-105 transition-all duration-150 ease-in-out"
          >
            <img src={social.icon} alt={social.name} className="w-5 h-5 mr-2" />
            {social.label}
          </a>
        ))}
      </div>
      
      <a 
        href={KILN_WEBSITE.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex space-x-2"
      >
        <div className="flex-1 bg-black-primary text-white py-2 px-4 text-sm font-medium flex items-center justify-center hover:bg-gray-800 transition-colors">
          {KILN_WEBSITE.name}
        </div>
        <div className="bg-white border border-grey-secondary p-2 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <img src={KILN_WEBSITE.icon} alt="Go to" className="w-4 h-4" />
        </div>
      </a>
    </div>
  );
}; 