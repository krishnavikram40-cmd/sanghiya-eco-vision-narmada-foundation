import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

interface CustomEmblemProps {
  className?: string;
  customLogoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

export const CustomEmblem: React.FC<CustomEmblemProps> = ({
  className = '',
  customLogoUrl,
  size = 'md',
  title = `${SITE_CONFIG.hindiName} — आधिकारिक प्रतीक चिन्ह (${SITE_CONFIG.englishName} Logo)`,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-36 sm:h-36',
  }[size];

  // Primary source: user uploaded custom URL or official logo path from configuration
  const logoSrc = customLogoUrl || SITE_CONFIG.logo.primaryPath || '/file_00000000306082118bbb5f0c42339ad4.png';

  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden aspect-square flex items-center justify-center shadow-md border-2 border-amber-400/90 bg-[#1c3f60] transition-transform hover:scale-[1.02] ${sizeClasses} ${className}`}
      title={title}
    >
      <img
        src={logoSrc}
        alt={SITE_CONFIG.logo.altText}
        className="w-full h-full object-cover rounded-full select-none"
        loading="eager"
        decoding="async"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== '/file_00000000306082118bbb5f0c42339ad4.png') {
            target.src = '/file_00000000306082118bbb5f0c42339ad4.png';
          }
        }}
      />
    </div>
  );
};
