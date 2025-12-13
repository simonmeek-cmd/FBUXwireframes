# Navigation Structure Format Guide

When pasting navigation structures into the builder, use one of these formats:

## Format 1: CSV/TSV (Recommended)

**Best for:** Excel/Sheets exports, tabular data

- **First row:** Top-level navigation items (separated by commas or tabs)
- **Subsequent rows:** Child items under each column
- **Empty cells:** Indicate no child for that column
- **Grandchildren:** Use a prefix character (`>`, `::`, or `|`) at the start of the cell (no spaces needed!)

### Example:

```
About Us,What We Do,News,Contact
Our Mission,Service One,Latest Updates,Get in Touch
>Vision & Values,>Service A,,
>History,>Service B,,
Our Team,Service Two,,Contact Form
```

**Note:** You can also use 2 spaces or a tab for indentation (old method), but the prefix characters (`>`, `::`, or `|`) are easier and more reliable!

This creates:
- **About Us** → Our Mission (with Vision & Values, History as grandchildren), Our Team
- **What We Do** → Service One (with Service A, Service B as grandchildren), Service Two
- **News** → Latest Updates
- **Contact** → Get in Touch, Contact Form

---

## Format 2: Indented Text

**Best for:** Simple text editors, hierarchical lists

- **Top-level items:** No indent
- **Children:** 2 spaces or 1 tab
- **Grandchildren:** 4 spaces or 2 tabs

### Example:

```
About Us
  Our Mission
    Vision & Values
    History
    Annual Reports
  Our Team
    Leadership
    Staff
What We Do
  Service One
  Service Two
News
Contact
```

---

## Format 3: Markdown Lists

**Best for:** Markdown documents, documentation

- Uses `-` or `*` for list items
- Indentation indicates hierarchy

### Example:

```
- About Us
  - Our Mission
    - Vision & Values
    - History
  - Our Team
- What We Do
  - Service One
  - Service Two
- News
- Contact
```

---

## Tips

1. **CSV format is most reliable** for complex structures with multiple levels
2. **Keep labels concise** - you can edit them in the JSON after parsing
3. **Empty cells are OK** - they just mean no item at that level
4. **After parsing**, review the generated JSON and:
   - Add proper `href` values (they're auto-generated but may need adjustment)
   - Add CTAs (Call-to-Action buttons)
   - Configure secondary navigation if needed
   - Add intro copy for mega menus if using 3-level navigation

---

## Quick Start

1. Open Navigation Settings in your project
2. Click "📝 Paste Structured Text"
3. Paste your navigation structure (any of the formats above)
4. Click "Parse"
5. Review and adjust the generated JSON
6. Save!

