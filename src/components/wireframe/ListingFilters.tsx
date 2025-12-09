import React from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface ListingFiltersProps {
  /** Filter configurations */
  filters?: FilterConfig[];
  /** Filter button label */
  filterButtonLabel?: string;
  /** Clear filters label */
  clearFiltersLabel?: string;
  /** Show the filters row label */
  showFiltersLabel?: boolean;
  /** Filters row label */
  filtersLabel?: string;
}

const defaultFilters: FilterConfig[] = [
  {
    id: 'type',
    label: 'Type',
    options: [
      { value: '', label: 'Any' },
      { value: 'type1', label: 'Type 1' },
      { value: 'type2', label: 'Type 2' },
    ],
  },
  {
    id: 'topic',
    label: 'Topic',
    options: [
      { value: '', label: 'Any' },
      { value: 'topic1', label: 'Topic 1' },
      { value: 'topic2', label: 'Topic 2' },
    ],
  },
];

/**
 * ListingFilters
 * Configurable filter row for listing pages.
 */
export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters = defaultFilters,
  filterButtonLabel = 'Filter',
  clearFiltersLabel = 'Clear filters',
  showFiltersLabel = true,
  filtersLabel = 'Filters',
}) => {
  return (
    <div className="bg-wire-50 border-b border-wire-200 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filters label */}
          {showFiltersLabel && (
            <span className="text-sm font-medium text-wire-700 shrink-0">
              {filtersLabel}
            </span>
          )}

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {filters.map((filter) => (
              <div key={filter.id} className="flex flex-col gap-1 min-w-[150px] flex-1 max-w-[200px]">
                <label className="text-xs text-wire-500">{filter.label}</label>
                <select className="px-3 py-2 bg-white border border-wire-300 rounded text-sm text-wire-700 focus:outline-none focus:border-wire-500">
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Filter actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="px-4 py-2 bg-wire-800 text-wire-100 text-sm rounded hover:bg-wire-900 transition-colors">
              {filterButtonLabel}
            </button>
            <button className="text-sm text-wire-600 hover:text-wire-800 underline underline-offset-2">
              {clearFiltersLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;

