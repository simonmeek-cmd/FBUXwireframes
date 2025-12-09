import React from 'react';

export interface MediaVideoProps {
  /** Title of the video */
  title?: string;
  /** Caption below the video */
  caption?: string;
  /** Video source platform label */
  platform?: string;
  /** Aspect ratio of the video */
  aspectRatio?: '16:9' | '4:3' | '1:1';
  /** Show video controls placeholder */
  showControls?: boolean;
}

/**
 * MediaVideo
 * A video player placeholder component.
 */
export const MediaVideo: React.FC<MediaVideoProps> = ({
  title = 'Video title',
  caption,
  platform = 'YouTube',
  aspectRatio = '16:9',
  showControls = true,
}) => {
  const aspectStyles = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  return (
    <figure>
      <div className={`bg-wire-800 rounded overflow-hidden relative ${aspectStyles[aspectRatio]}`}>
        {/* Video placeholder content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-wire-400">
          {/* Play button */}
          <div className="w-16 h-16 rounded-full bg-wire-600 flex items-center justify-center mb-3 hover:bg-wire-500 transition-colors cursor-pointer">
            <svg className="w-8 h-8 text-wire-100 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className="text-sm">[ {platform} Video ]</span>
          {title && (
            <span className="text-xs mt-1 text-wire-500">{title}</span>
          )}
        </div>

        {/* Controls bar placeholder */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-wire-900/75 flex items-center px-3 gap-3">
            <button className="text-wire-300 hover:text-wire-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <div className="flex-1 h-1 bg-wire-600 rounded">
              <div className="w-1/3 h-full bg-wire-400 rounded"></div>
            </div>
            <span className="text-xs text-wire-400">0:00 / 3:45</span>
            <button className="text-wire-300 hover:text-wire-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            </button>
            <button className="text-wire-300 hover:text-wire-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-wire-500 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default MediaVideo;


