import React, { useState } from 'react';

export const DressCodeSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const palette = [
    { hex: '#0B0D13', name: 'Charcoal Ink', border: 'border-[#232B3E]' },
    { hex: '#181E2C', name: 'Web Slate', border: 'border-[#232B3E]' },
    { hex: '#FF1E42', name: 'Radical Crimson', border: 'border-[#FF1E42]', glow: 'shadow-[0_0_6px_rgba(255,30,66,0.6)]', isPrimary: true },
    { hex: '#00E5FF', name: 'Quantum Cyan', border: 'border-[#00E5FF]', glow: 'shadow-[0_0_6px_rgba(0,229,255,0.6)]', isCyan: true },
    { hex: '#F8FAFC', name: 'Pure Contrast', border: 'border-[#232B3E]' },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full">
      <div className="rounded-xl border border-[#232B3E] bg-[#131722] p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-md">
        {/* Left Specification */}
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 font-mono text-xs text-[#00E5FF] uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>DRESS SPEC </span>
          </div>

          <div className="inline-block">
            <span className="font-mono text-xs bg-[#181E2C] text-white border border-[#FF1E42] px-2.5 py-1 rounded uppercase tracking-wider font-bold shadow-[0_0_8px_rgba(255,30,66,0.25)]">
              [CODE: BE_YOURSELF]
            </span>
          </div>

          <p className="font-mono text-xs text-slate-400 leading-relaxed">
            Formal / academic celebratory attire. Subdued spider-charcoal tones with vivid accents recommended. Standard academic honor cords and stoles authorized for commencement quad access.
          </p>
        </div>

        {/* Right Palette & Specifications */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
          {/* Approved Palette Matrix */}
          <div className="flex flex-col gap-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-bold">
                APPROVED PALETTE MATRIX
              </span>
              {copiedHex && (
                <span className="text-[9px] text-[#00E5FF] font-bold animate-pulse">
                  COPIED {copiedHex}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {palette.map(item => (
                <button
                  key={item.hex}
                  onClick={() => handleCopyHex(item.hex)}
                  className="flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
                  title={`Click to copy ${item.name} (${item.hex})`}
                >
                  <div
                    className={`w-8 h-8 rounded-md border transition-transform group-hover:scale-110 ${item.border} ${item.glow || ''}`}
                    style={{ backgroundColor: item.hex }}
                  ></div>
                  <span
                    className={`text-[9px] ${
                      item.isPrimary
                        ? 'text-[#FF1E42] font-bold'
                        : item.isCyan
                        ? 'text-[#00E5FF] font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
