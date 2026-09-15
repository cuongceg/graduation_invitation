import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  profileImg: string;
  onCopyPass: () => void;
  copiedPass: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profileImg,
  onCopyPass,
  copiedPass,
}) => {
  // Live ticking countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 4,
    minutes: 28,
    seconds: 45,
  });

  const [photoFilter, setPhotoFilter] = useState<'grayscale' | 'multiverse' | 'glitch'>('grayscale');

  // Real second tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 w-full" id="overview-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Information) */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 order-2 lg:order-1">

          {/* Invitation Dispatch Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              COMMENCEMENT CONVOCATION:<br />
              <span className="text-[#FF1E42] drop-shadow-[0_0_15px_rgba(255,30,66,0.5)]">
                YOU ARE INVITED
              </span>
              <span className="text-white"> // CLASS OF 2024</span>
            </h1>
          </div>

          {/* Countdown Timer HUD Card */}
          <div className="p-5 rounded-xl border border-[#232B3E] bg-[#131722] max-w-xl w-full flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF1E42]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3 relative z-10 flex-wrap gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-200">
                <span className="material-symbols-outlined text-[16px] text-[#FF1E42]">timer</span>
                <span>T-MINUS COMMENCEMENT PROCESSION</span>
              </div>
            </div>

            {/* Timer Grid */}
            <div className="grid grid-cols-4 gap-3 relative z-10">
              <div className="p-3.5 rounded-lg border border-[#FF1E42]/40 bg-[#0B0D13] flex flex-col items-center justify-center shadow-[inset_0_0_8px_rgba(255,30,66,0.15)] group hover:border-[#FF1E42] transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-[#FF1E42] tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.days)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">DAYS</span>
              </div>

              <div className="p-3.5 rounded-lg border border-[#232B3E] bg-[#0B0D13] flex flex-col items-center justify-center group hover:border-slate-500 transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">HOURS</span>
              </div>

              <div className="p-3.5 rounded-lg border border-[#232B3E] bg-[#0B0D13] flex flex-col items-center justify-center group hover:border-slate-500 transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">MINUTES</span>
              </div>

              <div className="p-3.5 rounded-lg border border-[#00E5FF]/40 bg-[#0B0D13] flex flex-col items-center justify-center shadow-[inset_0_0_8px_rgba(0,229,255,0.15)] group hover:border-[#00E5FF] transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-[#00E5FF] animate-pulse tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">SECONDS</span>
              </div>
            </div>

            {/* Timer Sub-bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[11px] text-slate-400 pt-1 gap-1 relative z-10">
              <span>PROCESSION GATES LOCK: 09:45 EST</span>
            </div>
          </div>
        </div>

        {/* Right Column (Student Card) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative w-full max-w-sm rounded-xl border-2 border-[#232B3E] bg-[#131722] p-2.5 flex flex-col gap-2.5 shadow-2xl">
            {/* Photo Container */}
            <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-[#232B3E] bg-[#0B0D13] group">
              <img
                alt="Portrait of Maya Christine Vance in graduation gown"
                className={`w-full h-full object-cover object-center transition duration-500 ${
                  photoFilter === 'grayscale'
                    ? 'grayscale contrast-110 group-hover:grayscale-0'
                    : photoFilter === 'multiverse'
                    ? 'saturate-150 contrast-125'
                    : 'grayscale contrast-150 brightness-110 hue-rotate-90'
                }`}
                src={profileImg}
              />

              {/* Photo Filter Switcher (Corner HUD Control) */}
              <div className="absolute top-2 right-2 flex items-center gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setPhotoFilter('grayscale')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    photoFilter === 'grayscale' ? 'bg-[#FF1E42] text-white' : 'bg-[#0B0D13]/80 text-slate-300'
                  }`}
                  title="Classic B&W"
                >
                  BW
                </button>
                <button
                  onClick={() => setPhotoFilter('multiverse')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    photoFilter === 'multiverse' ? 'bg-[#00E5FF] text-black' : 'bg-[#0B0D13]/80 text-slate-300'
                  }`}
                  title="Multiverse Color"
                >
                  RGB
                </button>
              </div>

              {/* Overlay Bottom Badge */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-[#0B0D13] via-[#0B0D13]/90 to-transparent flex flex-col gap-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-extrabold tracking-wider text-[14px]">
                    MAYA C. VANCE
                  </span>
                </div>
                <span className="text-[10px] text-[#00E5FF] tracking-wider uppercase font-semibold">
                  B.S. ADVANCED COMPUTING &amp; SYSTEM ARCHITECTURE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
