import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface HeroSectionProps {
  profileImg: string;
  guestName: string;
  language: LanguageCode;
}

const GRADUATION_DATE = new Date('2026-09-27T10:00:00-04:00');

const getTimeLeft = () => {
  const remainingMs = Math.max(0, GRADUATION_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  profileImg,
  guestName,
  language,
}) => {
  const isVietnamese = language === 'vi';
  // Live ticking countdown state
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  const [photoFilter, setPhotoFilter] = useState<'grayscale' | 'multiverse' | 'glitch'>('grayscale');

  // Real second tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-6 sm:pb-8 w-full" id="overview-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (Main Information) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start gap-5 sm:gap-6 order-1 lg:order-1 text-center lg:text-left">

          {/* Invitation Dispatch Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display uppercase tracking-tight leading-tight">
              <span
                className="glitch-text block text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white break-words"
                data-text="[ INVITATION PROTOCOL: ]"
              >
                [ INVITATION PROTOCOL: ]
              </span>

              <span className={`${isVietnamese ? 'font-chakra text-3xl sm:text-5xl lg:text-6xl' : 'text-2xl sm:text-4xl lg:text-5xl'} block font-extrabold text-[#FF1E42] drop-shadow-[0_0_15px_rgba(255,30,66,0.5)] [text-shadow:2px_0_0_rgba(0,229,255,0.25),-2px_0_0_rgba(255,30,66,0.25)] break-words`}>
                {guestName.toUpperCase()}, {isVietnamese ? 'BẠN ĐÃ ĐƯỢC MỜI' : 'YOU\'RE INVITED'}
              </span>

              <span className={`${isVietnamese ? 'font-chakra text-lg sm:text-3xl lg:text-[30px]' : 'text-base sm:text-2xl lg:text-[27px]'} block mt-2 font-extrabold text-[#00E5FF] drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] [text-shadow:2px_0_0_rgba(255,30,66,0.2)]`}>
                {isVietnamese ? 'SẴN SÀNG CHO CHƯƠNG TIẾP THEO.' : 'JOIN ME FOR THE NEXT CHAPTER.'}
              </span>
            </h1>
          </div>

          {/* Countdown Timer HUD Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#232B3E] bg-[#131722] max-w-xl w-full flex flex-col gap-4 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF1E42]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3 relative z-10 flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${isVietnamese ? 'font-chakra' : 'font-mono'} text-xs uppercase tracking-wider text-slate-200`}>
                <span className="material-symbols-outlined text-[16px] text-[#FF1E42]">timer</span>
                <span>{isVietnamese ? 'ĐẾM NGƯỢC ĐẾN LỄ TỐT NGHIỆP' : 'T-MINUS COMMENCEMENT PROCESSION'}</span>
              </div>
            </div>

            {/* Timer Grid */}
            <div className="grid grid-cols-4 gap-3 relative z-10">
              <div className="p-3.5 rounded-lg border border-[#FF1E42]/40 bg-[#0B0D13] flex flex-col items-center justify-center shadow-[inset_0_0_8px_rgba(255,30,66,0.15)] group hover:border-[#FF1E42] transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-[#FF1E42] tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.days)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">{isVietnamese ? 'NGÀY' : 'DAYS'}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-[#232B3E] bg-[#0B0D13] flex flex-col items-center justify-center group hover:border-slate-500 transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">{isVietnamese ? 'GIỜ' : 'HOURS'}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-[#232B3E] bg-[#0B0D13] flex flex-col items-center justify-center group hover:border-slate-500 transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">{isVietnamese ? 'PHÚT' : 'MINUTES'}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-[#00E5FF]/40 bg-[#0B0D13] flex flex-col items-center justify-center shadow-[inset_0_0_8px_rgba(0,229,255,0.15)] group hover:border-[#00E5FF] transition-colors">
                <span className="font-chakra text-3xl sm:text-4xl font-extrabold text-[#00E5FF] animate-pulse tabular-nums tracking-wider leading-none inline-block text-center">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1.5">{isVietnamese ? 'GIÂY' : 'SECONDS'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Student Card) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end order-2 lg:order-2 w-full">
          <div className="relative w-full max-w-[18rem] sm:max-w-sm rounded-xl border-2 border-[#232B3E] bg-[#131722] p-2.5 flex flex-col gap-2.5 shadow-2xl">
            {/* Photo Container */}
            <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-[#232B3E] bg-[#0B0D13] group">
              <img
                alt={`Portrait of ${guestName} in graduation attire`}
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
                    {guestName.toUpperCase()}
                  </span>
                </div>
                <span className={`${isVietnamese ? 'font-chakra' : 'font-mono'} text-[10px] text-[#00E5FF] tracking-wider uppercase font-semibold`}>
                  {isVietnamese ? '[ HỒ_SƠ_DANH_TÍNH ]' : '[ IDENTITY_PROFILE ]'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
