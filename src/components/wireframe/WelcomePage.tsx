import React from 'react';
import type { WelcomePageConfig } from '../../types/welcomePage';
import { defaultWelcomePageConfig, fatBeehiveLogo } from '../../types/welcomePage';
import type { Page } from '../../types/builder';
import { sortPagesForDisplay } from '../../utils/pageSort';

interface WelcomePageProps {
  config?: WelcomePageConfig;
  projectName: string;
  clientName: string;
  pages: Page[];
  onNavigateToPage: (pageId: string) => void;
  onOpenShowcase?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  config,
  projectName,
  clientName,
  pages,
  onNavigateToPage,
  onOpenShowcase,
}) => {
  const welcomeConfig = config || defaultWelcomePageConfig;
  const introCopy = welcomeConfig.introCopy || '';
  const projectDate = welcomeConfig.projectDate || new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const sortedPages = sortPagesForDisplay(pages);

  return (
    <div className="min-h-screen bg-wire-50">
      <style>{`
        .welcome-intro h2 {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #243b53;
        }
        .welcome-intro h2:first-child {
          margin-top: 0;
        }
        .welcome-intro h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #243b53;
        }
        .welcome-intro p {
          margin-top: 1rem;
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .welcome-intro p:first-child {
          margin-top: 0;
        }
        .welcome-intro ul,
        .welcome-intro ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .welcome-intro ul {
          list-style: disc;
        }
        .welcome-intro ol {
          list-style: decimal;
        }
        .welcome-intro li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: list-item;
        }
        .welcome-intro strong {
          font-weight: 600;
        }
      `}</style>
      {/* Logo bar */}
      <div className="bg-white border-b border-wire-300 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            className="text-wire-800"
            dangerouslySetInnerHTML={{ __html: fatBeehiveLogo }}
            style={{ height: '28px', display: 'flex', alignItems: 'center' }}
          />
          {welcomeConfig.clientLogo && (
            <img
              src={welcomeConfig.clientLogo}
              alt={`${clientName} logo`}
              className="h-12 max-w-[200px] object-contain"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-wire-800 mb-2">
          {clientName}: {projectName}
        </h1>
        <p className="text-wire-600 mb-8">{projectDate}</p>

        {/* Intro copy */}
        {introCopy && (
          <div
            className="text-wire-700 leading-relaxed mb-12 max-w-none welcome-intro"
            dangerouslySetInnerHTML={{ __html: introCopy }}
          />
        )}

        {/* Page list */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-wire-800 mb-4">Wireframe Pages</h2>
          <ul className="space-y-2">
            {sortedPages.map((page) => (
              <li key={page.id}>
                <button
                  onClick={() => onNavigateToPage(page.id)}
                  className="text-wire-700 hover:text-wire-900 underline text-left"
                >
                  {page.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Link to showcase */}
        <div className="mt-8 pt-8 border-t border-wire-300">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenShowcase) {
                onOpenShowcase();
              }
            }}
            className="text-wire-600 hover:text-wire-800 underline cursor-pointer"
          >
            View Component Showcase →
          </a>
        </div>
      </div>
    </div>
  );
};

