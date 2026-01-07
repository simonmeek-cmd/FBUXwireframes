import type { NavigationConfig, NavItem } from '../types/navigation';

// Parse navigation structure from PDF or image
export const parseNavigationFromFile = async (
  file: File
): Promise<{ config: NavigationConfig; error?: string }> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return parseNavigationFromPDF(file);
  } else if (fileType.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(fileName)) {
    return parseNavigationFromImage(file);
  } else {
    return {
      config: getDefaultConfig(),
      error: 'Unsupported file type. Please upload a PDF or image file.',
    };
  }
};

// Parse PDF using pdfjs-dist
const parseNavigationFromPDF = async (file: File): Promise<{ config: NavigationConfig; error?: string }> => {
  try {
    console.log('[PDF Parser] Starting PDF parse...');
    
    // Dynamically import pdfjs-dist
    console.log('[PDF Parser] Importing pdfjs-dist...');
    const pdfjsLib = await import('pdfjs-dist');
    console.log('[PDF Parser] pdfjs-dist imported, version:', pdfjsLib.version);
    
    // Set worker path (for browser environment)
    // Use local worker file from public directory (most reliable)
    if (typeof window !== 'undefined') {
      // Use local worker (copied to public directory during setup)
      // In Vite, files in public/ are served from root
      const localWorkerUrl = '/pdf.worker.min.mjs';
      console.log('[PDF Parser] Setting worker URL to local file:', localWorkerUrl);
      pdfjsLib.GlobalWorkerOptions.workerSrc = localWorkerUrl;
    }

    console.log('[PDF Parser] Reading file as ArrayBuffer...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('[PDF Parser] File read, size:', arrayBuffer.byteLength, 'bytes');
    
    console.log('[PDF Parser] Loading PDF document...');
    // Add timeout wrapper for PDF loading
    const loadPromise = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0, // Reduce console noise
    }).promise;
    
    // Add a timeout for PDF loading (20 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timeout after 20 seconds')), 20000);
    });
    
    const pdf = await Promise.race([loadPromise, timeoutPromise]) as any;
    console.log('[PDF Parser] PDF loaded, pages:', pdf.numPages);
    
    let allText = '';
    
    // Extract text from all pages with position information
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`[PDF Parser] Processing page ${i}/${pdf.numPages}...`);
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        console.log(`[PDF Parser] Page ${i} has ${textContent.items.length} text items`);
        
        // Try to preserve table structure by using item positions
        const items = textContent.items as Array<{ str: string; transform: number[] }>;
        
        if (items.length === 0) {
          console.log(`[PDF Parser] Page ${i} has no text items, skipping...`);
          continue;
        }
        
        // Group items by approximate Y position (rows)
        const rows = new Map<number, string[]>();
        const rowTolerance = 5; // pixels
        
        for (const item of items) {
          if (!item.str || item.str.trim().length === 0) continue;
          
          // Check if transform array exists and has enough elements
          if (!item.transform || item.transform.length < 6) {
            // Fallback: just add to a default row
            if (!rows.has(0)) {
              rows.set(0, []);
            }
            rows.get(0)!.push(item.str);
            continue;
          }
          
          const y = item.transform[5]; // Y position from transform matrix
          const roundedY = Math.round(y / rowTolerance) * rowTolerance;
          
          if (!rows.has(roundedY)) {
            rows.set(roundedY, []);
          }
          rows.get(roundedY)!.push(item.str);
        }
        
        // Sort rows by Y position (top to bottom)
        const sortedRows = Array.from(rows.entries())
          .sort((a, b) => b[0] - a[0]) // Higher Y = lower on page
          .map(([_, cells]) => cells.join(' | ')); // Join cells with | separator
        
        allText += sortedRows.join('\n') + '\n';
        console.log(`[PDF Parser] Page ${i} extracted ${sortedRows.length} rows`);
      } catch (pageError) {
        console.error(`[PDF Parser] Error processing page ${i}:`, pageError);
        // Continue with other pages
      }
    }
    
    console.log('[PDF Parser] Total text extracted:', allText.length, 'characters');
    
    if (allText.trim().length === 0) {
      return {
        config: getDefaultConfig(),
        error: 'No text could be extracted from the PDF. The file might be image-based or corrupted.',
      };
    }

    // Parse the extracted text into navigation structure
    console.log('[PDF Parser] Parsing text to navigation structure...');
    const result = parseTextToNavigation(allText);
    console.log('[PDF Parser] Parse complete, found', result.config.primaryItems.length, 'top-level items');
    return result;
  } catch (error) {
    console.error('[PDF Parser] Error:', error);
    return {
      config: getDefaultConfig(),
      error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Check browser console for details.`,
    };
  }
};

// Parse image using Netlify function + vision model
const parseNavigationFromImage = async (file: File): Promise<{ config: NavigationConfig; error?: string }> => {
  try {
    // Read file as base64 so we can send it to the Netlify function
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          // result is a data URL: data:<mime>;base64,XXXX
          const commaIndex = result.indexOf(',');
          resolve(commaIndex >= 0 ? result.substring(commaIndex + 1) : result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

    const response = await fetch('/.netlify/functions/parse-nav-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: base64,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Image Parser] Netlify function error:', response.status, errorText);
      return {
        config: getDefaultConfig(),
        error:
          'Failed to parse navigation image. Please check that OPENAI_API_KEY is configured on Netlify and that the diagram follows the colour-coded template.',
      };
    }

    const data = await response.json();
    if (!data || !data.config) {
      console.error('[Image Parser] Missing config in response:', data);
      return {
        config: getDefaultConfig(),
        error: 'Image parser did not return a navigation config. Please try again.',
      };
    }

    return {
      config: data.config as NavigationConfig,
    };
  } catch (error) {
    console.error('[Image Parser] Unexpected error:', error);
    return {
      config: getDefaultConfig(),
      error:
        'Unexpected error while parsing image. Please try again or fall back to structured text/JSON.',
    };
  }
};

// Parse extracted text into navigation structure
const parseTextToNavigation = (text: string): { config: NavigationConfig; error?: string } => {
  try {
    // Clean up the text
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Look for table-like structure
    // The PDF appears to have columns separated by | or tabs
    const rows: string[][] = [];
    
    for (const line of lines) {
      // Try to split by | (common in tables)
      if (line.includes('|')) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);
        if (cells.length > 1) {
          rows.push(cells);
        }
      } else if (line.includes('\t')) {
        // Try tabs
        const cells = line.split('\t').map(cell => cell.trim()).filter(cell => cell.length > 0);
        if (cells.length > 1) {
          rows.push(cells);
        }
      }
    }

    // If we found table rows, parse them
    if (rows.length > 0) {
      return parseTableToNavigation(rows);
    }

    // Fallback: try to detect navigation structure from text patterns
    return parseTextPatternsToNavigation(lines);
  } catch (error) {
    console.error('Text parsing error:', error);
    return {
      config: getDefaultConfig(),
      error: `Failed to parse navigation structure: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Parse table structure to navigation
const parseTableToNavigation = (rows: string[][]): { config: NavigationConfig; error?: string } => {
  if (rows.length === 0) {
    return {
      config: getDefaultConfig(),
      error: 'No table structure found in the document.',
    };
  }

  // First row typically contains headers (top-level nav items)
  const headerRow = rows[0];
  const primaryItems: NavItem[] = [];
  
  // Process each column as a top-level navigation item
  for (let colIndex = 0; colIndex < headerRow.length; colIndex++) {
    const topLevelLabel = headerRow[colIndex].trim();
    // Skip empty cells, separators, or very short labels
    if (!topLevelLabel || topLevelLabel === '|' || topLevelLabel.length < 3) {
      continue;
    }

    // Find children in subsequent rows for this column
    const children: NavItem[] = [];
    const childMap = new Map<string, NavItem>();

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (colIndex >= row.length) continue;

      const cellValue = row[colIndex]?.trim();
      if (!cellValue || cellValue === '|' || cellValue.length < 2) continue;

      // Check if this looks like a child item (not a header)
      // Headers are usually shorter, all caps, or have specific patterns
      const isLikelyHeader = cellValue.length < 30 && /^[A-Z][A-Z\s&]+$/.test(cellValue);
      
      if (!isLikelyHeader) {
        // This is a child item
        const childItem: NavItem = {
          label: cellValue,
          href: generateHref(cellValue),
        };
        children.push(childItem);
        childMap.set(cellValue, childItem);
      }
    }

    // Only add if we have a valid label
    if (topLevelLabel && topLevelLabel.length >= 3) {
      primaryItems.push({
        label: topLevelLabel,
        href: generateHref(topLevelLabel),
        children: children.length > 0 ? children : undefined,
      });
    }
  }

  // If we didn't find any items, try a different approach
  if (primaryItems.length === 0 && rows.length > 1) {
    // Maybe the structure is different - try treating first row differently
    return parseAlternativeTableStructure(rows);
  }

  return {
    config: {
      ...getDefaultConfig(),
      primaryItems: primaryItems.length > 0 ? primaryItems : getDefaultConfig().primaryItems,
    },
  };
};

// Alternative parsing for different table structures
const parseAlternativeTableStructure = (rows: string[][]): { config: NavigationConfig; error?: string } => {
  const primaryItems: NavItem[] = [];
  
  // Try to find distinct sections/columns
  // Look for patterns where columns might be separated
  const maxCols = Math.max(...rows.map(r => r.length));
  
  for (let col = 0; col < maxCols; col++) {
    const columnItems: string[] = [];
    
    for (const row of rows) {
      if (col < row.length) {
        const value = row[col]?.trim();
        if (value && value.length > 1 && value !== '|') {
          columnItems.push(value);
        }
      }
    }
    
    if (columnItems.length > 0) {
      // First item is likely the parent, rest are children
      const [parent, ...children] = columnItems;
      
      if (parent && parent.length >= 3) {
        primaryItems.push({
          label: parent,
          href: generateHref(parent),
          children: children.length > 0 ? children.map(c => ({
            label: c,
            href: generateHref(c),
          })) : undefined,
        });
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

// Fallback: try to parse from text patterns
const parseTextPatternsToNavigation = (lines: string[]): { config: NavigationConfig; error?: string } => {
  const primaryItems: NavItem[] = [];
  let currentParent: NavItem | null = null;
  let currentChild: NavItem | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 2) continue;

    // Heuristic: lines that look like section headers (all caps, short, etc.)
    const isLikelyHeader = trimmed.length < 50 && /^[A-Z][a-zA-Z\s&]+$/.test(trimmed);
    
    if (isLikelyHeader && !currentParent) {
      // Start a new top-level item
      currentParent = {
        label: trimmed,
        href: generateHref(trimmed),
        children: [],
      };
      primaryItems.push(currentParent);
      currentChild = null;
    } else if (currentParent) {
      // Add as child
      if (!currentParent.children) {
        currentParent.children = [];
      }
      currentParent.children.push({
        label: trimmed,
        href: generateHref(trimmed),
      });
    }
  }

  return {
    config: {
      ...getDefaultConfig(),
      primaryItems: primaryItems.length > 0 ? primaryItems : getDefaultConfig().primaryItems,
    },
  };
};

// Generate a href from a label
const generateHref = (label: string): string => {
  // Convert to URL-friendly format
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

