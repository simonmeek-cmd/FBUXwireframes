import type { NavigationConfig, NavItem } from '../types/navigation';

/**
 * Parse navigation structure from structured text formats:
 * 
 * Format 1: CSV/TSV (tab or comma separated)
 * - First row: Top-level nav items (headers)
 * - Subsequent rows: Child items under each column
 * - Empty cells indicate no child for that column
 * 
 * Example:
 * About Us,What We Do,News,Contact
 * Our Mission,Service One,Latest Updates,Get in Touch
 * Our Team,Service Two,,Contact Form
 * ,Service Three,,
 * 
 * Format 2: Indented text (hierarchical)
 * - Top-level items: no indent
 * - Children: 2 spaces or 1 tab
 * - Grandchildren: 4 spaces or 2 tabs
 * 
 * Example:
 * About Us
 *   Our Mission
 *     Vision & Values
 *     History
 *   Our Team
 * What We Do
 *   Service One
 * News
 * Contact
 * 
 * Format 3: Markdown-style lists
 * - Uses - or * for list items
 * - Indentation indicates hierarchy
 * 
 * Example:
 * - About Us
 *   - Our Mission
 *     - Vision & Values
 *     - History
 *   - Our Team
 * - What We Do
 *   - Service One
 * - News
 * - Contact
 */

export const parseNavigationFromStructuredText = (
  text: string
): { config: NavigationConfig; error?: string } => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    return {
      config: getDefaultConfig(),
      error: 'No content found in the text.',
    };
  }

  // Detect format by analyzing first few lines
  const firstLine = lines[0];
  
  // Check if it's CSV/TSV (contains tabs or commas with multiple columns)
  if (firstLine.includes('\t') || (firstLine.includes(',') && firstLine.split(',').length > 1)) {
    return parseCSVFormat(lines);
  }
  
  // Check if it's markdown-style (starts with - or *)
  if (firstLine.match(/^[-*]\s/)) {
    return parseMarkdownFormat(lines);
  }
  
  // Default to indented text format
  return parseIndentedFormat(lines);
};

// Parse CSV/TSV format
// Format: First row = top-level items, subsequent rows = children
// For 3-level: Use empty cells or indentation to indicate hierarchy
// Example:
// About Us,What We Do
// Our Mission,Service One
//   Vision,  Service A
//   History, Service B
// Our Team,Service Two
const parseCSVFormat = (lines: string[]): { config: NavigationConfig; error?: string } => {
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const rows = lines.map(line => {
    // Simple CSV parsing (doesn't handle quoted values with commas)
    // Preserve empty cells - split and map, but don't filter
    const cells = line.split(delimiter);
    // Find the max number of columns to ensure consistent row lengths
    return cells.map(cell => cell.trim());
  });
  
  // Find max columns to pad rows
  const maxCols = Math.max(...rows.map(row => row.length));
  const paddedRows = rows.map(row => {
    while (row.length < maxCols) {
      row.push('');
    }
    return row;
  });

  if (paddedRows.length === 0) {
    return {
      config: getDefaultConfig(),
      error: 'No rows found in CSV format.',
    };
  }

  // First row contains top-level nav items
  const headerRow = paddedRows[0];
  const primaryItems: NavItem[] = [];

  for (let colIndex = 0; colIndex < headerRow.length; colIndex++) {
    const topLevelLabel = headerRow[colIndex];
    if (!topLevelLabel || topLevelLabel.length < 2) continue;

    // Collect children from subsequent rows in this column
    const children: NavItem[] = [];
    let currentChild: NavItem | null = null;

    for (let rowIndex = 1; rowIndex < paddedRows.length; rowIndex++) {
      const row = paddedRows[rowIndex];
      if (colIndex >= row.length) continue;

      const cellValue = row[colIndex]?.trim();
      if (!cellValue || cellValue.length < 2) {
        // Empty cell - reset current child
        currentChild = null;
        continue;
      }

      // Check if this is a grandchild using prefix markers: >, ::, or | at the start
      // Also support indentation (spaces/tabs) for backwards compatibility
      const isGrandchild = cellValue.startsWith('>') || 
                          cellValue.startsWith('::') || 
                          cellValue.startsWith('|') ||
                          cellValue.startsWith('  ') || 
                          cellValue.startsWith('\t');
      
      // Remove prefix markers and trim
      let cleanValue = cellValue.trim();
      if (cleanValue.startsWith('>')) {
        cleanValue = cleanValue.substring(1).trim();
      } else if (cleanValue.startsWith('::')) {
        cleanValue = cleanValue.substring(2).trim();
      } else if (cleanValue.startsWith('|')) {
        cleanValue = cleanValue.substring(1).trim();
      }

      if (isGrandchild && currentChild) {
        // This is a grandchild of the current child
        if (!currentChild.children) {
          currentChild.children = [];
        }
        currentChild.children.push({
          label: cleanValue,
          href: generateHref(cleanValue),
        });
      } else {
        // This is a new child item
        currentChild = {
          label: cleanValue,
          href: generateHref(cleanValue),
        };
        children.push(currentChild);
      }
    }

    primaryItems.push({
      label: topLevelLabel,
      href: generateHref(topLevelLabel),
      children: children.length > 0 ? children : undefined,
    });
  }

  return {
    config: {
      ...getDefaultConfig(),
      primaryItems: primaryItems.length > 0 ? primaryItems : getDefaultConfig().primaryItems,
    },
  };
};

// Parse indented text format
const parseIndentedFormat = (lines: string[]): { config: NavigationConfig; error?: string } => {
  const primaryItems: NavItem[] = [];
  const stack: Array<{ item: NavItem; level: number }> = [];

  for (const line of lines) {
    if (!line || line.trim().length === 0) continue;

    // Determine indentation level (spaces or tabs)
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '';
    const level = indent.replace(/\t/g, '  ').length / 2; // Convert tabs to 2-space equivalent
    const label = line.trim();

    if (label.length < 2) continue;

    const item: NavItem = {
      label,
      href: generateHref(label),
    };

    if (level === 0) {
      // Top-level item
      primaryItems.push(item);
      stack.length = 0; // Clear stack
      stack.push({ item, level: 0 });
    } else if (level === 1) {
      // Child item
      // Find the most recent level 0 item
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      const parent = stack[stack.length - 1];
      if (parent && parent.item) {
        if (!parent.item.children) {
          parent.item.children = [];
        }
        parent.item.children.push(item);
        stack.push({ item, level: 1 });
      }
    } else if (level === 2) {
      // Grandchild item
      // Find the most recent level 1 item
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      const parent = stack[stack.length - 1];
      if (parent && parent.item && parent.level === 1) {
        if (!parent.item.children) {
          parent.item.children = [];
        }
        parent.item.children.push(item);
      }
    }
  }

  return {
    config: {
      ...getDefaultConfig(),
      primaryItems: primaryItems.length > 0 ? primaryItems : getDefaultConfig().primaryItems,
    },
  };
};

// Parse markdown-style format
const parseMarkdownFormat = (lines: string[]): { config: NavigationConfig; error?: string } => {
  // Convert markdown to indented format and reuse that parser
  const indentedLines = lines.map(line => {
    // Remove markdown list markers (- or *)
    const cleaned = line.replace(/^[-*]\s+/, '');
    return cleaned;
  });

  return parseIndentedFormat(indentedLines);
};

// Generate a href from a label
const generateHref = (label: string): string => {
  return `/${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
};

// Get default config structure
const getDefaultConfig = (): NavigationConfig => {
  return {
    logoText: 'LOGO',
    showSecondaryNav: true,
    showSearch: true,
    secondaryItems: [],
    primaryItems: [],
    ctas: [],
  };
};

