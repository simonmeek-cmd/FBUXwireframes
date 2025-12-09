import React from 'react';

export interface DownloadItem {
  id: string;
  label: string;
  fileType?: string;
  fileSize?: string;
  description?: string;
}

export interface DownloadInlineProps {
  /** Optional heading above the downloads */
  heading?: string;
  /** Array of download items */
  items?: DownloadItem[];
  /** Show file icons */
  showIcons?: boolean;
  /** Layout style */
  layout?: 'list' | 'grid';
}

const defaultItems: DownloadItem[] = [
  { id: '1', label: 'Annual Report 2024', fileType: 'PDF', fileSize: '2.4 MB' },
  { id: '2', label: 'Volunteer Handbook', fileType: 'PDF', fileSize: '1.1 MB' },
  { id: '3', label: 'Impact Data Spreadsheet', fileType: 'XLSX', fileSize: '450 KB' },
];

const fileIcons: Record<string, string> = {
  PDF: '📄',
  DOC: '📝',
  DOCX: '📝',
  XLS: '📊',
  XLSX: '📊',
  PPT: '📑',
  PPTX: '📑',
  ZIP: '📦',
  default: '📎',
};

/**
 * DownloadInline
 * A list of downloadable files with file type and size information.
 */
export const DownloadInline: React.FC<DownloadInlineProps> = ({
  heading,
  items = defaultItems,
  showIcons = true,
  layout = 'list',
}) => {
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return fileIcons.default;
    return fileIcons[fileType.toUpperCase()] || fileIcons.default;
  };

  return (
    <div>
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      {layout === 'list' ? (
        <ul className="border border-wire-200 rounded overflow-hidden divide-y divide-wire-200">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className="flex items-center gap-4 p-4 bg-wire-50 hover:bg-wire-100 transition-colors no-underline"
              >
                {showIcons && (
                  <span className="text-2xl shrink-0" role="img" aria-label={item.fileType || 'File'}>
                    {getFileIcon(item.fileType)}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-wire-800 block truncate underline underline-offset-2">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-sm text-wire-500 block truncate">
                      {item.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.fileType && (
                    <span className="px-2 py-0.5 bg-wire-200 text-wire-600 text-xs rounded">
                      {item.fileType}
                    </span>
                  )}
                  {item.fileSize && (
                    <span className="text-xs text-wire-500">{item.fileSize}</span>
                  )}
                  <svg className="w-5 h-5 text-wire-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
          <a
            key={item.id}
            href="#"
            className="block p-4 bg-wire-100 border border-wire-200 rounded hover:bg-wire-200 transition-colors no-underline"
          >
              <div className="flex items-start gap-3">
                {showIcons && (
                  <span className="text-3xl" role="img" aria-label={item.fileType || 'File'}>
                    {getFileIcon(item.fileType)}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-wire-800 block mb-1 underline underline-offset-2">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    {item.fileType && (
                      <span className="px-2 py-0.5 bg-wire-200 text-wire-600 rounded">
                        {item.fileType}
                      </span>
                    )}
                    {item.fileSize && (
                      <span className="text-wire-500">{item.fileSize}</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadInline;

