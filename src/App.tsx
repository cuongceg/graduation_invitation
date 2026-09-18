/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ScheduleSection } from './components/ScheduleSection';
import { DressCodeSection } from './components/DressCodeSection';
import { WayfindingSection } from './components/WayfindingSection';
import { GuestbookSection } from './components/GuestbookSection';
import { Footer } from './components/Footer';
import { ActiveNavTab, LanguageCode, WishEntry } from './types';
import { fetchGuestById, fetchGuestbookEntries, GuestbookEntry } from './services/guestbook';

const connectionToAffiliation = {
  family: 'Family',
  friend: 'Friend',
  colleague: 'Colleague',
  mentor: 'Lecturer',
} as const;

const quickTagLabels: Record<string, string> = {
  congrats: '❤️ ALWAYS_ROOTING',
  future_success: '🚀 NEXT_CHAPTER',
  best_wishes: '💫 KEEP_SHINING',
  proud_of_you: '🎓 PROUD_OF_YOU',
};

const getGuestIdFromPath = () => {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  return pathSegments.at(-1)?.trim() || null;
};

const DefaultTerminalPage = () => {
  const targetText = 'what are you looking for';
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const isComplete = typedText === targetText;
    const isEmpty = typedText.length === 0;
    const delay = !isDeleting && isComplete
      ? 1800
      : isDeleting && isEmpty
      ? 500
      : isDeleting
      ? 55
      : 100;

    const timer = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
      } else if (isDeleting && isEmpty) {
        setIsDeleting(false);
      } else if (isDeleting) {
        setTypedText(typedText.slice(0, -1));
      } else {
        setTypedText(targetText.slice(0, typedText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, typedText]);

  return (
    <main className="min-h-screen bg-[#080A0F] px-5 text-[#D7F9FF] flex items-center justify-center font-mono">
      <section className="w-full max-w-2xl border border-[#263746] bg-[#0D1219] shadow-[0_0_0_1px_rgba(0,229,255,0.04),0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2 border-b border-[#263746] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-[#718494]">
          <span className="h-2 w-2 rounded-full bg-[#FF1E42]" />
          <span className="h-2 w-2 rounded-full bg-[#F5C451]" />
          <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />
          <span className="ml-2">guest_protocol // terminal</span>
        </div>
        <div className="px-5 py-8 sm:px-8 sm:py-12">
          <p className="mb-3 text-xs text-[#00E5FF]">guest@invitation:~$ init</p>
          <h1 className="min-h-[1.25em] text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            {typedText}<span className="animate-pulse text-[#FF1E42]">_</span>
          </h1>
        </div>
      </section>
    </main>
  );
};

const getInitials = (fullName: string) => {
  const words = fullName.trim().split(/\s+/);
  return words.length > 1
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
};

const toWishEntry = (entry: GuestbookEntry, index: number): WishEntry => {
  const connectionType = entry.connectionType.toLowerCase() as keyof typeof connectionToAffiliation;
  const parsedDate = new Date(entry.createdAt);

  return {
    id: `wish-${entry.createdAt}-${index}`,
    name: entry.fullName,
    affiliation: connectionToAffiliation[connectionType] || 'Friend',
    initials: getInitials(entry.fullName),
    message: entry.messagePayload.startsWith('"') ? entry.messagePayload : `"${entry.messagePayload}"`,
    timestamp: Number.isNaN(parsedDate.getTime())
      ? entry.createdAt
      : parsedDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    likes: 0,
    tags: entry.quickTags.map(tag => quickTagLabels[tag] || tag),
  };
};

function InvitationApp({ guestId }: { guestId: string }) {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [guest, setGuest] = useState<{ fullName: string; avatarUrl: string | null } | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    let isMounted = true;
    const loadGuest = async () => {
      try {
        const guestData = await fetchGuestById(guestId);
        if (isMounted && guestData) {
          setGuest({ fullName: guestData.fullName, avatarUrl: guestData.avatarUrl });
        }
      } catch {}
    };

    void loadGuest();
    return () => {
      isMounted = false;
    };
  }, []);

  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [guestbookError, setGuestbookError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadGuestbookEntries = async () => {
      try {
        const entries = await fetchGuestbookEntries();
        if (isMounted) {
          setWishes(entries.map(toWishEntry));
        }
      } catch (error) {
        if (isMounted) {
          setGuestbookError(error instanceof Error ? error.message : 'Không thể lấy dữ liệu lưu bút');
        }
      } finally {
        if (isMounted) {
          setIsLoadingWishes(false);
        }
      }
    };

    void loadGuestbookEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToSection = (tab: ActiveNavTab) => {
    const sectionIdByTab: Record<ActiveNavTab, string | null> = {
      overview: 'overview-section',
      'dress-code': 'dress-code-section',
      guestbook: 'guestbook-section',
      'sector-map': 'sector-map-section',
    };

    const sectionId = sectionIdByTab[tab];
    if (!sectionId) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTab = (tab: ActiveNavTab) => {
    scrollToSection(tab);
  };

  const handleAddWish = async (newWish: WishEntry) => {
    setWishes(prev => [newWish, ...prev]);
  };

  const handleLikeWish = (id: string) => {
    setWishes(prev =>
      prev.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'vi' : 'en'));
  };

  return (
    <div className="bg-[#0D0D0E] font-body text-slate-100 antialiased selection:bg-[#FF1E42] selection:text-white min-h-screen">
      {/* Header Navigation */}
      <Header
        onSelectTab={handleSelectTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Sections */}
      <main className="w-full pt-14 sm:pt-16 bg-[#0D0D0E] min-h-screen">
        <div className="flex flex-col w-full text-slate-100">
          {/* SECTION 1: HERO & SPOTLIGHT */}
          <HeroSection
            profileImg={guest?.avatarUrl || ''}
            guestName={guest?.fullName || 'Guest'}
            language={language}
          />

          {/* SECTION 2: CONVOCATION DATE & PROTOCOL SCHEDULE */}
          <ScheduleSection language={language} />

          {/* SECTION 3: DRESS CODE SPECIFICATION */}
          <DressCodeSection language={language} />

          {/* SECTION 4: LOCATION & CAMPUS LOGISTICS */}
          <WayfindingSection language={language} />

          {/* SECTION 5: GUESTBOOK & WALL OF WISHES */}
          <GuestbookSection
            wishes={wishes}
            onAddWish={handleAddWish}
            onLikeWish={handleLikeWish}
            language={language}
            isLoadingWishes={isLoadingWishes}
            guestbookError={guestbookError}
          />
        </div>
      </main>

      {/* Architectural Crimson Brutalist Footer */}
      <Footer language={language} />
    </div>
  );
}

export default function App() {
  const guestId = getGuestIdFromPath();

  return guestId ? <InvitationApp guestId={guestId} /> : <DefaultTerminalPage />;
}
