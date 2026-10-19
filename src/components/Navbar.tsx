import React from 'react';
import { Sparkles, FileDown, BookOpen, Settings2, FileText, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'textbook' | 'blueprint' | 'paper' | 'qa';
  onSelectTab: (tab: 'textbook' | 'blueprint' | 'paper' | 'qa') => void;
  onGenerateClick: () => void;
  onExportClick: () => void;
  hasGeneratedPaper: boolean;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onGenerateClick,
  onExportClick,
  hasGeneratedPaper,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand title, one line */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight">
              AB
            </div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('textbook');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-700 transition-colors"
            >
              ApexBloom
            </a>
          </div>

          {/* Zone 2: 4-5 nav links, 1-2 word labels, single line */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => onSelectTab('textbook')}
              className={`flex items-center gap-2 py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'textbook'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Textbook Corpus</span>
            </button>

            <button
              onClick={() => onSelectTab('blueprint')}
              className={`flex items-center gap-2 py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'blueprint'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span>2. Blueprint Config</span>
            </button>

            <button
              onClick={() => onSelectTab('paper')}
              className={`flex items-center gap-2 py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'paper'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              } ${!hasGeneratedPaper ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <FileText className="w-4 h-4" />
              <span>3. Question Paper</span>
            </button>

            <button
              onClick={() => onSelectTab('qa')}
              className={`flex items-center gap-2 py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'qa'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              } ${!hasGeneratedPaper ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>4. QA Audit</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {hasGeneratedPaper && (currentTab === 'paper' || currentTab === 'qa') ? (
              <button
                onClick={onExportClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Paper</span>
              </button>
            ) : (
              <button
                onClick={onGenerateClick}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Paper'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
