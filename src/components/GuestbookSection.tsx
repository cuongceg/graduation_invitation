import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { WishEntry, AffiliationType, LanguageCode } from '../types';
import { submitGuestbookEntry, toGuestbookPayload } from '../services/guestbook';

interface GuestbookSectionProps {
  wishes: WishEntry[];
  onAddWish: (wish: WishEntry) => void | Promise<void>;
  onLikeWish: (id: string) => void;
  language: LanguageCode;
  isLoadingWishes: boolean;
  guestbookError: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  wishes,
  onAddWish,
  language,
  isLoadingWishes,
  guestbookError,
}) => {
  const isVietnamese = language === 'vi';
  const [fullName, setFullName] = useState('');
  const [affiliation, setAffiliation] = useState<AffiliationType>('Family');
  const [message, setMessage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeAffiliationFilter, setActiveAffiliationFilter] = useState<string>('ALL');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const availableTags = [
    '🎓 PROUD_OF_YOU',
    '🚀 NEXT_CHAPTER',
    '💫 KEEP_SHINING',
    '❤️ ALWAYS_ROOTING',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !message.trim()) return;

    setIsTransmitting(true);
    setErrorMessage('');

    // Create initials
    const words = fullName.trim().split(/\s+/);
    const initials = words.length > 1
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : words[0].slice(0, 2).toUpperCase();

    try {
      await submitGuestbookEntry(toGuestbookPayload(fullName, affiliation, message, selectedTags));

      const newWish: WishEntry = {
        id: 'wish-' + Date.now(),
        name: fullName.trim(),
        affiliation,
        initials,
        message: `"${message.trim()}"`,
        timestamp: 'JUST NOW',
        likes: 1,
        tags: selectedTags,
        isCustom: true,
      };

      await onAddWish(newWish);
      setSuccessToast(true);
      setFullName('');
      setMessage('');
      setSelectedTags([]);

      // Trigger festive multiverse confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#FF1E42', '#00E5FF', '#F8FAFC', '#1D4ED8'],
      });

      setTimeout(() => setSuccessToast(false), 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gửi lời chúc thất bại');
    } finally {
      setIsTransmitting(false);
    }
  };

  // Filtered wishes
  const filteredWishes = wishes.filter(w => {
    const matchesAffil = activeAffiliationFilter === 'ALL' || w.affiliation === activeAffiliationFilter;
    const matchesSearch = !searchFilter.trim() || 
      w.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
      w.message.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesAffil && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 mb-10 w-full" id="guestbook-section">
      <div className="rounded-xl border border-[#232B3E] bg-[#131722] p-6 flex flex-col gap-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-[#232B3E] pb-4 font-mono">
          <div className="flex items-center gap-2 text-xs text-[#00E5FF] uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>[ MEMORY_STREAM ]</span>
          </div>
          <h3 className="font-display text-xl uppercase font-bold text-white tracking-wide">
            TRANSMIT A MESSAGE
          </h3>
          <p className="font-mono text-xs text-slate-400">
            {isVietnamese ? 'Hãy chia sẻ lời chúc mừng và những kỷ niệm đáng nhớ cùng Cường trên hành trình tốt nghiệp.' : 'Leave a message for the next chapter. Your message will become part of Cường\'s graduation memory stream.'}
          </p>
        </div>

        {/* Form and Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 flex flex-col gap-4 font-mono">
            {successToast && (
              <div className="p-3 rounded-lg border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-mono flex items-center justify-between animate-fadeIn shadow-[0_0_12px_rgba(0,229,255,0.25)]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
                  {isVietnamese ? '[ĐÃ GỬI THÔNG ĐIỆP] Lời chúc của bạn đã được ghi vào mạng lưới Spider-Protocol!' : '[ TRANSMISSION RECEIVED ] Your message has been successfully added to the memory stream!'}
                </span>
                <span className="font-bold">STATUS: 200 OK</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 rounded-lg border border-[#FF1E42] bg-[#FF1E42]/10 text-[#FF6B7F] text-xs font-mono flex items-center justify-between shadow-[0_0_12px_rgba(255,30,66,0.2)]">
                <span>{isVietnamese ? `[LỖI GỬI THÔNG ĐIỆP] ${errorMessage}` : `[ TRANSMISSION FAILED ] ${errorMessage}`}</span>
                <button
                  type="button"
                  className="font-bold hover:text-white cursor-pointer"
                  onClick={() => setErrorMessage('')}
                  aria-label={isVietnamese ? 'Đóng thông báo lỗi' : 'Dismiss error'}
                >
                  DISMISS
                </button>
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  &gt; {isVietnamese ? 'HỌ VÀ TÊN' : 'FULL_NAME'} <span className="text-[#FF1E42]">*</span>
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0D13] border border-[#232B3E] focus:border-[#FF1E42] focus:ring-1 focus:ring-[#FF1E42] text-white placeholder:text-slate-600 text-xs font-mono transition-colors outline-none"
                  placeholder="e.g. Dr. William Henderson"
                  required
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>

              {/* Affiliation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  &gt; {isVietnamese ? 'MỐI QUAN HỆ' : 'CONNECTION_TYPE'}
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(['Family', 'Friend', 'Lecturer', 'Colleague'] as AffiliationType[]).map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setAffiliation(item)}
                      className={`px-3 py-1.5 rounded-md border font-bold transition-all cursor-pointer ${
                        affiliation === item
                          ? 'border-[#FF1E42] bg-[#FF1E42]/20 text-white shadow-[0_0_8px_rgba(255,30,66,0.3)]'
                          : 'border-[#232B3E] bg-[#0B0D13] text-slate-400 hover:text-[#00E5FF] hover:border-[#00E5FF]/50'
                      }`}
                    >
                      [ {item.toUpperCase()} ]
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  &gt; {isVietnamese ? 'NỘI DUNG LỜI CHÚC' : 'MESSAGE_PAYLOAD'} <span className="text-[#FF1E42]">*</span>
                </label>
                <textarea
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0D13] border border-[#232B3E] focus:border-[#FF1E42] focus:ring-1 focus:ring-[#FF1E42] text-white placeholder:text-slate-600 text-xs font-mono transition-colors outline-none resize-none"
                  placeholder="Share your congratulations, memories, or advice for Cường's journey ahead..."
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-col gap-1.5">
                
                <label className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  <span className="text-[#00E5FF]">&gt; QUICK_TAGS </span>
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {availableTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF1E42] bg-[#FF1E42]/20 text-white font-semibold'
                            : 'border-[#232B3E] bg-[#0B0D13] text-slate-200 hover:border-[#FF1E42]/60'
                        }`}
                      >
                        {tag} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#FF1E42] hover:bg-[#b91c1c] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,30,66,0.35)] cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isTransmitting}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isTransmitting ? 'sync' : 'send'}
                  </span>
                  <span>
                    {isTransmitting
                      ? '[ TRANSMITTING PACKET... ]'
                      : (isVietnamese ? '[ GỬI LỜI CHÚC ]' : '[ TRANSMIT MESSAGE ]')}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Wall of Wishes Feed */}
          <div className="lg:col-span-5 flex flex-col gap-3 font-mono">
            {/* Wall Header */}
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF1E42]"></span>
                [ WALL_OF_WISHES ]
              </span>
              <span className="text-[10px] text-[#00E5FF] bg-[#00E5FF]/15 border border-[#00E5FF]/40 px-2 py-0.5 rounded font-bold shadow-[0_0_6px_rgba(0,229,255,0.2)]">
                {wishes.length} RECORDS
              </span>
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter logs by name or text..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-[#0B0D13] border border-[#232B3E] focus:border-[#00E5FF] text-[11px] text-white placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {['ALL', 'Family', 'Friend', 'Lecturer', 'Colleague'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveAffiliationFilter(f)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      activeAffiliationFilter === f
                        ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10 font-bold'
                        : 'border-[#232B3E] text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Messages */}
            <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
              {isLoadingWishes ? (
                <div className="p-6 rounded-lg border border-[#232B3E] bg-[#0B0D13] text-center text-xs text-[#00E5FF]">
                  LOADING MEMORY STREAM...
                </div>
              ) : guestbookError ? (
                <div className="p-6 rounded-lg border border-[#FF1E42] bg-[#0B0D13] text-center text-xs text-[#FF6B7F]">
                  {guestbookError}
                </div>
              ) : filteredWishes.length === 0 ? (
                <div className="p-6 rounded-lg border border-[#232B3E] bg-[#0B0D13] text-center text-xs text-slate-500">
                  NO TELEMETRY MATCHES FILTER.
                </div>
              ) : (
                filteredWishes.map(item => {
                  const isFamily = item.affiliation === 'Family';
                  const isColleague = item.affiliation === 'Colleague';
                  const badgeBorder = isFamily
                    ? 'border-[#FF1E42] text-[#FF1E42]'
                    : isColleague
                    ? 'border-[#00E5FF]/60 text-[#00E5FF]'
                    : 'border-[#FF1E42] text-[#FF1E42]';

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-lg border border-[#232B3E] hover:border-[#2A344A] bg-[#0B0D13] flex flex-col gap-2 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded bg-[#181E2C] border ${badgeBorder} font-bold flex items-center justify-center text-[10px]`}
                          >
                            {item.initials}
                          </span>
                          <span className="font-bold text-white">{item.name}</span>
                          <span
                            className={`text-[10px] ${
                              isColleague ? 'text-[#00E5FF]' : 'text-[#FF1E42]'
                            }`}
                          >
                            [{item.affiliation}]
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                      </div>

                      <p className="font-mono text-xs text-slate-300 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Tags & Reaction Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#181E2C] text-[10px]">
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#131722] border border-[#232B3E] text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
