/**
 * Validation script to ensure projects API always includes pages
 * This prevents regressions where pages might be missing from project responses
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const PROJECTS_API_PATH = join(process.cwd(), 'netlify/functions/projects.ts');

function validateProjectsAPI(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const content = readFileSync(PROJECTS_API_PATH, 'utf-8');
    
    // Check that the GET all projects endpoint includes pages
    const getAllProjectsMatch = content.match(/Get all projects.*?projectsWithPages|projects.*?pages/s);
    
    if (!getAllProjectsMatch) {
      // Check for the old pattern that doesn't include pages
      const oldPattern = /Get all projects.*?body: JSON\.stringify\(data\)/s;
      if (oldPattern.test(content)) {
        errors.push('❌ GET all projects endpoint does not include pages. It should fetch pages for each project.');
      }
    }
    
    // Check that pages are being fetched
    const hasPagesFetch = content.includes('from(\'pages\')') && 
                          content.includes('eq(\'project_id\'');
    
    if (!hasPagesFetch) {
      errors.push('❌ Projects API does not fetch pages from the pages table.');
    }
    
    // Check that projectsWithPages or similar pattern exists
    const hasProjectsWithPages = content.includes('projectsWithPages') || 
                                  (content.includes('Promise.all') && content.includes('pages'));
    
    if (!hasProjectsWithPages) {
      errors.push('❌ Projects API does not use Promise.all to fetch pages for all projects.');
    }
    
    // Check that pages are included in the response
    const includesPagesInResponse = content.includes('pages: pages || []') ||
                                    content.includes('pages:') && content.includes('JSON.stringify');
    
    if (!includesPagesInResponse) {
      errors.push('❌ Projects API response does not include pages array.');
    }
    
    if (errors.length === 0) {
      console.log('✅ Projects API validation passed: pages are included in GET all projects response');
      return { valid: true, errors: [] };
    }
    
    return { valid: false, errors };
  } catch (error: any) {
    return {
      valid: false,
      errors: [`Failed to read projects.ts: ${error.message}`],
    };
  }
}

// Run validation
const result = validateProjectsAPI();

if (!result.valid) {
  console.error('\n❌ Projects API validation failed:\n');
  result.errors.forEach(error => console.error(error));
  console.error('\nPlease ensure that GET all projects endpoint includes pages for each project.');
  process.exit(1);
}

process.exit(0);


