import React from 'react';

export interface InfoItem {
  id: string;
  title: string;
  description?: string;
}

export interface InformationOverviewInlineProps {
  /** Optional heading above the overview */
  heading?: string;
  /** Array of information items */
  items?: InfoItem[];
  /** Layout style */
  layout?: 'list' | 'grid';
}

const defaultItems: InfoItem[] = [
  { id: '1', title: 'Information overview title' },
  { id: '2', title: 'Information overview title' },
  { id: '3', title: 'Information overview title' },
  { id: '4', title: 'Information overview title' },
];

/**
 * InformationOverviewInline
 * A list or grid of information items with titles and optional descriptions.
 */
export const InformationOverviewInline: React.FC<InformationOverviewInlineProps> = ({
  heading,
  items = defaultItems,
  layout = 'list',
}) => {
  return (
    <div>
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      {layout === 'list' ? (
        <ul className="border border-wire-200 rounded overflow-hidden divide-y divide-wire-200">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-wire-50 hover:bg-wire-100 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-wire-800">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-wire-500 mt-1">{item.description}</p>
                )}
              </div>
              <span className="text-wire-400">→</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-wire-100 border border-wire-200 rounded hover:bg-wire-200 transition-colors cursor-pointer"
            >
              <h3 className="font-medium text-wire-800">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-wire-500 mt-1">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InformationOverviewInline;


