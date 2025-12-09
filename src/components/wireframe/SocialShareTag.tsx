import React from 'react';

export interface SocialPlatform {
  id: string;
  label: string;
  icon?: string;
}

export interface SocialShareTagProps {
  /** Label before the share buttons */
  label?: string;
  /** Array of social platforms to display */
  platforms?: SocialPlatform[];
}

const defaultPlatforms: SocialPlatform[] = [
  { id: 'facebook', label: 'Facebook', icon: 'f' },
  { id: 'twitter', label: 'Twitter', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { id: 'email', label: 'Email', icon: '✉' },
];

/**
 * SocialShareTag
 * Social media sharing buttons for the current page.
 */
export const SocialShareTag: React.FC<SocialShareTagProps> = ({
  label = 'Share:',
  platforms = defaultPlatforms,
}) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="text-sm text-wire-600">{label}</span>
      <div className="flex gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            aria-label={`Share on ${platform.label}`}
            className="w-8 h-8 bg-wire-300 hover:bg-wire-400 text-wire-600 rounded flex items-center justify-center text-xs font-bold transition-colors"
          >
            {platform.icon || platform.label.charAt(0)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialShareTag;


