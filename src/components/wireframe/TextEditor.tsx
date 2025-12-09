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
    <div className="prose-wire px-4 py-6 max-w-4xl mx-auto">
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      <div 
        className="text-wire-700 leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:list-inside prose-ul:mb-4 prose-ul:space-y-1 prose-li:text-wire-700 prose-strong:font-bold prose-em:italic"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    </div>
  );
};

export default TextEditor;
