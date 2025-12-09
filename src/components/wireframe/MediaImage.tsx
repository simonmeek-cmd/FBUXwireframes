import React from 'react';

export interface MediaImageProps {
  /** Alt text for the image */
  alt?: string;
  /** Caption below the image */
  caption?: string;
  /** Aspect ratio of the image */
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'auto';
  /** Image alignment */
  alignment?: 'left' | 'center' | 'right';
  /** Maximum width constraint */
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * MediaImage
 * A single image component with optional caption and layout options.
 */
export const MediaImage: React.FC<MediaImageProps> = ({
  alt = 'Placeholder image',
  caption,
  aspectRatio = '16:9',
  alignment = 'center',
  maxWidth = 'full',
}) => {
  const aspectStyles = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:2': 'aspect-[3/2]',
    'auto': '',
  };

  const alignStyles = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full',
  };

  return (
    <figure className={`${alignStyles[alignment]} ${maxWidthStyles[maxWidth]}`}>
      <div className={`bg-wire-300 rounded overflow-hidden flex items-center justify-center ${aspectStyles[aspectRatio]} ${aspectRatio === 'auto' ? 'min-h-[200px]' : ''}`}>
        <div className="text-center text-wire-500">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span className="text-sm">[ {alt} ]</span>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-wire-500 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default MediaImage;


