import React from 'react';

export interface TextEditorProps {
  /** Main content - HTML string */
  content?: string;
  /** Optional heading above the content */
  heading?: string;
}

const defaultContent = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<ul>
<li>First bullet point item</li>
<li>Second bullet point item</li>
<li>Third bullet point item with more detail</li>
</ul>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>`;

/**
 * TextEditor
 * Rich text content block for body copy, lists, and inline elements.
 */
export const TextEditor: React.FC<TextEditorProps> = ({
  heading,
  content,
}) => {
  const displayContent = content || defaultContent;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {heading && (
        <h2 className="text-wire-700" style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#243b53',
          marginTop: 0,
          marginBottom: '0.75rem',
          lineHeight: 1.3,
        }}>{heading}</h2>
      )}
      <div 
        className="text-wire-700 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
      <style>{`
        .text-wire-700 p {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .text-wire-700 p:first-child {
          margin-top: 0;
        }
        .text-wire-700 p:last-child {
          margin-bottom: 0;
        }
        .text-wire-700 h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #243b53;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .text-wire-700 h2:first-child {
          margin-top: 0;
        }
        .text-wire-700 h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #243b53;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .text-wire-700 ul,
        .text-wire-700 ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          list-style-position: outside;
        }
        .text-wire-700 ul {
          list-style-type: disc;
        }
        .text-wire-700 ol {
          list-style-type: decimal;
        }
        .text-wire-700 li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: list-item;
          line-height: 1.6;
        }
        .text-wire-700 li:first-child {
          margin-top: 0;
        }
        .text-wire-700 li:last-child {
          margin-bottom: 0;
        }
        .text-wire-700 strong {
          font-weight: 600;
        }
        .text-wire-700 em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
