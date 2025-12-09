import React from 'react';

export interface GalleryItem {
  id: string;
  title?: string;
  caption?: string;
}

export interface GalleryInlineProps {
  /** Optional heading above the gallery */
  heading?: string;
  /** Array of gallery items */
  items?: GalleryItem[];
  /** Number of columns on desktop */
  columns?: 2 | 3 | 4 | 6;
  /** Show captions below images */
  showCaptions?: boolean;
}

const defaultItems: GalleryItem[] = [
  { id: '1', title: 'Image 1', caption: 'Caption for image 1' },
  { id: '2', title: 'Image 2', caption: 'Caption for image 2' },
  { id: '3', title: 'Image 3', caption: 'Caption for image 3' },
  { id: '4', title: 'Image 4', caption: 'Caption for image 4' },
  { id: '5', title: 'Image 5', caption: 'Caption for image 5' },
  { id: '6', title: 'Image 6', caption: 'Caption for image 6' },
];

/**
 * GalleryInline
 * An image gallery grid with optional captions.
 */
export const GalleryInline: React.FC<GalleryInlineProps> = ({
  heading,
  items = defaultItems,
  columns = 3,
  showCaptions = false,
}) => {
  const columnStyles = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    6: 'md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div>
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      <div className={`grid grid-cols-2 ${columnStyles[columns]} gap-3`}>
        {items.map((item) => (
          <figure key={item.id} className="group cursor-pointer">
            <div className="aspect-square bg-wire-300 rounded overflow-hidden flex items-center justify-center relative group-hover:bg-wire-400 transition-colors">
              <svg className="w-8 h-8 text-wire-400 group-hover:text-wire-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <div className="absolute inset-0 bg-wire-800/0 group-hover:bg-wire-800/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-wire-100 bg-wire-800/75 px-2 py-1 rounded text-xs transition-opacity">
                  View
                </span>
              </div>
            </div>
            {showCaptions && item.caption && (
              <figcaption className="mt-2 text-sm text-wire-600 text-center">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
};

export default GalleryInline;


