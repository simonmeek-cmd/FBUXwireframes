import type { Page } from '../types/builder';

const isHomeName = (name: string | undefined): boolean => {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return n === 'home' || n === 'homepage' || n === 'home page';
};

const comparePages = (a: Page, b: Page): number => {
  const aIsHome = a.type === 'homepage' || isHomeName(a.name);
  const bIsHome = b.type === 'homepage' || isHomeName(b.name);

  // Homepage (or pages clearly named "Home") always first
  if (aIsHome && !bIsHome) return -1;
  if (!aIsHome && bIsHome) return 1;

  // Then alphabetical by name
  return a.name.localeCompare(b.name);
};

export const sortPagesForDisplay = (pages: Page[]): Page[] => {
  return [...pages].sort(comparePages);
};



