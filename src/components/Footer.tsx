import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D0D0E] border-t border-[#2A2A30] py-8 text-[#94A3B8] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-4">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#131722] border border-[#232B3E] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF1E42] animate-pulse"></span>
          <span className="text-[#FF1E42] font-bold">STATUS: 200 OK</span>
        </div>

        {/* Dispatch Assistance */}
        <div className="flex flex-col items-center gap-1 text-xs">
          <span className="uppercase tracking-widest text-white font-bold">
            &gt; CONTACT SUPPORT
          </span>
          <p className="text-slate-400 max-w-md">
            For help with the ceremony, parking, or the web, please contact us directly.
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <a
            className="px-3.5 py-1.5 rounded-lg border border-[#232B3E] bg-[#131722] hover:border-[#FF1E42] text-slate-200 transition-colors flex items-center gap-1.5"
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-[#FF1E42] font-bold">[FB]</span>
            <span>Facebook</span>
          </a>

          <a
            className="px-3.5 py-1.5 rounded-lg border border-[#232B3E] bg-[#131722] hover:border-[#00E5FF] text-slate-200 transition-colors flex items-center gap-1.5"
            href="tel:+84901234567"
          >
            <span className="material-symbols-outlined text-[14px] text-[#00E5FF]">call</span>
            <span>+84 901 234 567</span>
          </a>

          <a
            className="px-3.5 py-1.5 rounded-lg border border-[#232B3E] bg-[#131722] hover:border-[#FF1E42] text-slate-200 transition-colors flex items-center gap-1.5"
            href="https://zalo.me"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-[#FF1E42] font-bold">[Z]</span>
            <span>Zalo</span>
          </a>
        </div>
        {/* Copyright */}
        <p className="text-[10px] text-slate-500 tracking-wider uppercase">
          © 2026 CEDRIC DO BUILD_VER 0.3.6. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};
