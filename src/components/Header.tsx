import React from 'react';
import { ActiveNavTab, LanguageCode } from '../types';

interface HeaderProps {
  onSelectTab: (tab: ActiveNavTab) => void;
  language: LanguageCode;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  language,
  onToggleLanguage,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0D0D0E]/95 backdrop-blur-md border-b border-[#2A2A30]">
      <div className="h-14 sm:h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between font-mono">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#FF1E42] bg-[#131722] flex items-center justify-center text-[#FF1E42] font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(255,30,66,0.4)] group-hover:scale-105 transition-transform">
            CĐ
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#131722] p-1 border border-[#232B3E] rounded-lg">
          <button
            onClick={() => onSelectTab('overview')}
            className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold rounded transition-all text-slate-400 hover:text-[#00E5FF]"
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('dress-code')}
            className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold rounded transition-all text-slate-400 hover:text-[#00E5FF]"
          >
            Dress Code
          </button>
          <button
            onClick={() => onSelectTab('sector-map')}
            className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold rounded transition-all text-slate-400 hover:text-[#00E5FF]"
          >
            Sector Map
          </button>
          <button
            onClick={() => onSelectTab('guestbook')}
            className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold rounded transition-all text-slate-400 hover:text-[#00E5FF]"
          >
            Guestbook
          </button>
        </nav>

        {/* Right Status & Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-slate-400 bg-[#131722] border border-[#232B3E] hover:border-[#00E5FF]/60 hover:text-[#00E5FF] px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            title={language === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
            {language === 'en' ? 'EN' : 'VI'}
          </button>
        </div>
      </div>
    </header>
  );
};
