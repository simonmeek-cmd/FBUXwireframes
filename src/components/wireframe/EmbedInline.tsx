import React from 'react';

export interface EmbedInlineProps {
  /** Optional heading above the embed */
  heading?: string;
  /** Type of embed content */
  embedType?: 'video' | 'map' | 'form' | 'generic';
  /** Aspect ratio of the embed container */
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  /** Caption or description below the embed */
  caption?: string;
}

/**
 * EmbedInline
 * Placeholder for embedded content like videos, maps, or external forms.
 */
export const EmbedInline: React.FC<EmbedInlineProps> = ({
  heading,
  embedType = 'video',
  aspectRatio = '16:9',
  caption,
}) => {
  const aspectStyles = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    'auto': 'min-h-[200px]',
  };

  const embedIcons = {
    video: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    map: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    form: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
      </svg>
    ),
    generic: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10z"/>
      </svg>
    ),
  };

  const embedLabels = {
    video: 'Video Embed',
    map: 'Map Embed',
    form: 'Form Embed',
    generic: 'Embedded Content',
  };

  return (
    <div>
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      <div className={`bg-wire-300 rounded flex flex-col items-center justify-center text-wire-500 ${aspectStyles[aspectRatio]}`}>
        {embedIcons[embedType]}
        <span className="mt-2 text-sm">[ {embedLabels[embedType]} ]</span>
      </div>
      {caption && (
        <p className="mt-2 text-sm text-wire-500 text-center">{caption}</p>
      )}
    </div>
  );
};

export default EmbedInline;


