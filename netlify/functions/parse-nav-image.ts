import { Handler } from '@netlify/functions';
import type { NavigationConfig } from '../../src/types/navigation';
import { validateNavigationConfig } from '../../src/types/navigation';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ParseRequestBody {
  imageBase64: string;
  fileName?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          'Image parsing is not configured. Set OPENAI_API_KEY in your Netlify environment to enable Miro PNG import.',
      }),
    };
  }

  try {
    const body = event.body ? (JSON.parse(event.body) as ParseRequestBody) : null;

    if (!body || !body.imageBase64) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing imageBase64 in request body' }),
      };
    }

    const { imageBase64, fileName } = body;

    // Call OpenAI vision model to interpret the navigation diagram
    const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that converts colour-coded navigation diagrams into JSON navigation configs for a charity website prototype tool. Always reply with ONLY valid JSON, no comments or extra text.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: [
                  'You are given a screenshot of a navigation map exported from Miro.',
                  '',
                  'IMPORTANT: Look for a charity name at the top of the diagram (e.g., "Charity name: Westfield Hospice" or just "Westfield Hospice"). Extract this and use it as logoText.',
                  '',
                  'Colour semantics:',
                  '- Yellow boxes in SECONDARY NAVIGATION section: Secondary navigation items (utility links like "Your stories", "Shop with us", "Work for us", "Contact us", "Login", etc.).',
                  '- Yellow boxes in PRIMARY NAVIGATION section: TOP-LEVEL navigation items (primary menu).',
                  '- Green boxes: SECOND-LEVEL items directly under the yellow item above them in the same column.',
                  '- Pink boxes: THIRD-LEVEL items directly under the green item above them in the same column.',
                  '- Orange boxes: CTA buttons (global calls-to-action), not part of the tree, usually labels like Donate, Refer, etc.',
                  '- Grey boxes: Usually represent search functionality.',
                  '',
                  'Layout semantics:',
                  '- The diagram is typically divided into sections: "Secondary navigation" and "Primary navigation".',
                  '- Secondary navigation items are usually in a horizontal row at the top, before the primary navigation.',
                  '- Each vertical column in the primary navigation represents one top-level section.',
                  '- Within a column, items are ordered from top to bottom.',
                  '- Lines/arrows (if any) only reinforce the vertical hierarchy; you can rely primarily on colour and vertical grouping.',
                  '',
                  'Output requirements:',
                  '- Return a single JSON object that matches this TypeScript interface (keys and nesting only, types are obvious):',
                  '  interface NavItem { label: string; href?: string; children?: NavItem[]; intro?: string; stackVertically?: boolean }',
                  '  interface NavCTA { label: string; href?: string; variant: \"primary\" | \"secondary\" }',
                  '  interface NavigationConfig {',
                  '    logoText: string;',
                  '    showSecondaryNav: boolean;',
                  '    showSearch: boolean;',
                  '    secondaryItems: NavItem[];',
                  '    primaryItems: NavItem[];',
                  '    ctas: NavCTA[];',
                  '  }',
                  '',
                  '- Extract the charity name from the top of the diagram and use it as logoText. If not found, use "Charity name".',
                  '- Yellow boxes in the SECONDARY NAVIGATION section should go into secondaryItems[].',
                  '- If you see a grey box labeled "search" or similar in the secondary nav area, set showSearch to true.',
                  '- Yellow boxes in PRIMARY NAVIGATION (top of each column) should go into primaryItems[].label.',
                  '- Use the green boxes below a yellow as that primary item\'s children[].label.',
                  '- Use pink boxes below a green as that child\'s children[].label (grandchildren).',
                  '- IMPORTANT: If you see arrows (→) or right-pointing indicators next to any text, that item is a clickable link and MUST be included in the navigation structure. Do not skip items with arrows.',
                  '- For each top-level item (yellow), if it has green children but NO pink grandchildren anywhere under it, set stackVertically: true on that top-level item. This tells the UI to stack those second-level items vertically.',
                  '- Put orange boxes into ctas[].',
                  '- For CTAs: If the label contains "[Primary]" or "[primary]" (case-insensitive), use variant:\"primary\" and remove the "[Primary]" text from the label. Otherwise, use variant:\"secondary\".',
                  '- Set href to a kebab-case path derived from the label, e.g. "Your care" -> "/your-care". For nested items, you can still just use a single-segment path.',
                  '- IMPORTANT: Capitalize the first letter of every label (e.g. "deliver digital" -> "Deliver digital", "for patients" -> "For patients").',
                  '- Set showSecondaryNav to true if there are any secondary navigation items, otherwise false.',
                  '- Set showSearch to true if you see a search box/indicator in the secondary nav area, otherwise false.',
                  '',
                  'Important:',
                  '- Your response MUST be just the JSON object, no backticks, no explanation.',
                ].join('\n'),
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/${fileName?.toLowerCase().endsWith('.jpg') || fileName?.toLowerCase().endsWith('.jpeg') ? 'jpeg' : 'png'};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!completionRes.ok) {
      const errorText = await completionRes.text();
      console.error('[parse-nav-image] OpenAI error:', completionRes.status, errorText);
      
      // Try to parse the error for a more helpful message
      let errorDetail = `OpenAI API error (${completionRes.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson?.error?.message) {
          errorDetail = errorJson.error.message;
        }
      } catch {
        // Use raw text if not JSON
        if (errorText && errorText.length < 200) {
          errorDetail = errorText;
        }
      }
      
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: `Failed to parse image: ${errorDetail}`,
        }),
      };
    }

    const completionJson: any = await completionRes.json();
    const content = completionJson?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      console.error('[parse-nav-image] Unexpected OpenAI response shape:', completionJson);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Unexpected response from image parser.' }),
      };
    }

    let parsedConfig: unknown;
    try {
      parsedConfig = JSON.parse(content);
    } catch (e) {
      console.error('[parse-nav-image] Failed to JSON.parse model content:', content);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: 'Image parser returned invalid JSON. Try simplifying the diagram and retry.',
        }),
      };
    }

    if (!validateNavigationConfig(parsedConfig)) {
      console.error('[parse-nav-image] Parsed config failed validation:', parsedConfig);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            'Parsed navigation did not match expected structure. Please check the diagram and try again.',
        }),
      };
    }

    const config = parsedConfig as NavigationConfig;

    // Post-process: Capitalize first letter of all labels, set stackVertically flag, and clean up CTA labels
    const capitalizeLabel = (str: string): string => {
      if (!str || str.length === 0) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const processNavItem = (item: any): any => {
      if (item.label) {
        item.label = capitalizeLabel(item.label);
      }
      
      // Set stackVertically flag: true if this item has children but no grandchildren
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        const hasGrandchildren = item.children.some((child: any) => 
          child.children && Array.isArray(child.children) && child.children.length > 0
        );
        if (!hasGrandchildren) {
          item.stackVertically = true;
        }
        item.children = item.children.map(processNavItem);
      }
      
      return item;
    };

    // Process all navigation items
    if (config.primaryItems) {
      config.primaryItems = config.primaryItems.map(processNavItem);
    }
    if (config.secondaryItems) {
      config.secondaryItems = config.secondaryItems.map(processNavItem);
    }
    if (config.ctas) {
      config.ctas = config.ctas.map((cta: any) => {
        let label = cta.label || '';
        let variant = cta.variant || 'secondary';
        
        // Check for [Primary] or [primary] in the label
        const primaryMatch = label.match(/\[primary\]/i);
        if (primaryMatch) {
          variant = 'primary';
          // Remove [Primary] or [primary] from the label
          label = label.replace(/\[primary\]/gi, '').trim();
        }
        
        return {
          ...cta,
          label: capitalizeLabel(label),
          variant: variant as 'primary' | 'secondary',
        };
      });
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config }),
    };
  } catch (error) {
    console.error('[parse-nav-image] Unhandled error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Unknown error while parsing navigation image.',
      }),
    };
  }
};


