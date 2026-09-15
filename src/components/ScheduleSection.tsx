import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { LanguageCode } from '../types';


export const ScheduleSection = ({ language }: { language: LanguageCode }) => {
  const isVietnamese = language === 'vi';
  const [alertArmed, setAlertArmed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncCalendar = () => {
    // Fire festive spider confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1E42', '#00E5FF', '#F8FAFC'],
    });

    // Create .ics download
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Academia Laureate//Spider Protocol Convocation//EN',
      'BEGIN:VEVENT',
      'UID:graduation-cuong-do-2026@academialaureate.edu',
      'DTSTAMP:20260915T120000Z',
      'DTSTART:20260927T140000Z',
      'DTEND:20260927T170000Z',
      'SUMMARY:Graduation Ceremony: Cường Đỗ (2026)',
      'DESCRIPTION:Graduation ceremony. Seat A-14. Guest Access Code: <SPIDER_REC_SEP27>',
      'LOCATION:Campus Quadrangle // Sector 7, Dimension NYC',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Cuong_Do_Graduation_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSyncStatus('ICS CALENDAR FILE DOWNLOADED & SYNCED');
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const gCalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Graduation+Ceremony:+Cường+Đỗ+(2026)&dates=20260927T140000Z/20260927T170000Z&details=Graduation+ceremony.+Seat+A-14.+Guest+Access+Code:+SPIDER_REC_SEP27&location=Academic+Quadrangle,+Sector+7,+NYC';
    window.open(gCalUrl, '_blank');
  };

  const handleToggleAlert = () => {
    setAlertArmed(prev => !prev);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full" id="ceremony-section">
      <div className="rounded-xl border border-[#232B3E] bg-[#131722] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Left Date Telemetry */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-lg border-2 border-[#FF1E42] bg-[#0B0D13] flex flex-col items-center justify-center font-mono shadow-[0_0_12px_rgba(255,30,66,0.3)]">
            <span className="text-[10px] text-[#00E5FF] font-bold tracking-widest">SEP</span>
            <span className="font-numeric text-2xl text-[#FF1E42] font-extrabold leading-none tabular-nums">27</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-widest font-semibold">
              {isVietnamese ? '[ NGÀY_TỔ_CHỨC ]' : '[ PROTOCOL_DATE ]'}
            </span>
            <h2 className="font-chakra text-white text-lg sm:text-xl font-extrabold leading-tight">
              9:30 AM – 10:00 AM (UTC+7)
            </h2>
            <p className="font-mono text-xs text-slate-400">
              Hanoi University of Science and Technology • Hai Ba Trung • Ha Noi
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs relative z-10">
          <div className="relative">
            <button
              onClick={handleSyncCalendar}
              className="px-5 py-2.5 rounded-lg bg-[#FF1E42] hover:bg-[#b91c1c] active:scale-95 text-white font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,30,66,0.35)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
              <span>[ SYNC CALENDAR ]</span>
            </button>
          </div>

          {/* Alert Button */}
          <button
            onClick={handleToggleAlert}
            className={`px-4 py-2.5 rounded-lg border uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              alertArmed
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'border-[#00E5FF]/60 bg-[#181E2C] hover:border-[#00E5FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.15)]'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] text-[#00E5FF] ${alertArmed ? 'animate-bounce' : ''}`}>
              notifications_active
            </span>
            <span>
              {alertArmed
                ? '[ ALERT ARMED // T-24H SYNCED ]'
                : '[ SET ALERT ]'}
            </span>
          </button>
        </div>
      </div>

      {/* Sync Status Toast Bar if active */}
      {syncStatus && (
        <div className="mt-2 px-4 py-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] font-mono text-xs flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
            {syncStatus}
          </span>
          <button
            onClick={handleGoogleCalendar}
            className="underline hover:text-white font-bold cursor-pointer"
          >
            OPEN IN GOOGLE CALENDAR →
          </button>
        </div>
      )}
    </section>
  );
};
