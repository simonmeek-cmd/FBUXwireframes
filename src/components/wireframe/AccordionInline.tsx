import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  body: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionInlineProps {
  /** Optional heading above the accordion */
  heading?: string;
  /** Array of accordion items */
  items?: AccordionItem[];
  /** Allow multiple items to be open at once */
  allowMultiple?: boolean;
}

const defaultItems: AccordionItem[] = [
  {
    id: '1',
    title: 'Enim cillum dolore eu fugiat nulla pariatur',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    defaultOpen: true,
  },
  {
    id: '2',
    title: 'Enim cillum dolore eu fugiat nulla pariatur',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
  },
  {
    id: '3',
    title: 'Enim cillum dolore eu fugiat nulla pariatur',
    body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
  },
];

/**
 * AccordionInline
 * Expandable/collapsible content sections for FAQ-style content.
 */
export const AccordionInline: React.FC<AccordionInlineProps> = ({
  heading,
  items = defaultItems,
  allowMultiple = false,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const defaultOpen = new Set<string>();
    items.forEach((item) => {
      if (item.defaultOpen) {
        defaultOpen.add(item.id);
      }
    });
    return defaultOpen;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      <div className="border border-wire-300 rounded overflow-hidden divide-y divide-wire-300">
        {items.map((item) => {
          const isOpen = openItems.has(item.id);
          return (
            <div key={item.id} className="bg-wire-50">
              <h3>
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-panel-${item.id}`}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-wire-800 hover:bg-wire-100 transition-colors"
                >
                  <span className="font-medium">{item.title}</span>
                  <span
                    className={`shrink-0 w-6 h-6 flex items-center justify-center text-wire-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={`accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
                hidden={!isOpen}
                className={`px-4 pb-4 text-wire-600 ${isOpen ? '' : 'hidden'}`}
              >
                {item.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccordionInline;


