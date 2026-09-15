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
import { INITIAL_WISHES } from './data/initialData';

const PROFILE_IMAGE_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1UchAFbwHjGJWQbzfGY2LQIsZ2QyrkLNOGMxJjAlPFDsOzmN8K6PaMTSO3uotqY8YBiGvnJOFMFJ_jGnomT0YQfPdHJHlKXmp31sWXqHIAkFupH_ZtAdxRaaOvbafoNnAHr0JO_ZeGPZFmEWpDyHA6Y_5l9qeycmIZzqHui-tcXHF-NwuQxuLGUTcoHeGFMDnP_xQMGzxX8MHXWXIcGTPm3sI5L2AcMb3xh_UBZvGd7WGjFqQLPmIvYJi4';

const STORAGE_KEY = 'spider_protocol_guestbook_wishes_v1';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [copiedPass, setCopiedPass] = useState(false);
  const [isCeremonyOpen, setIsCeremonyOpen] = useState(false);

  // Initialize wishes from localStorage or defaults
  const [wishes, setWishes] = useState<WishEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_WISHES;
  });

  // Save to localStorage whenever wishes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      // Ignore storage errors
    }
  }, [wishes]);

  const scrollToSection = (tab: ActiveNavTab) => {
    const sectionIdByTab: Record<ActiveNavTab, string | null> = {
      overview: 'overview-section',
      timeline: 'ceremony-section',
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
    if (tab === 'overview') {
      scrollToSection(tab);
    } else if (tab === 'timeline') {
      const el = document.getElementById('ceremony-section');
      if (el) {
        scrollToSection(tab);
      } else {
        setIsCeremonyOpen(true);
      }
    } else if (tab === 'guestbook' || tab === 'sector-map') {
      scrollToSection(tab);
    }
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText('SPIDER_REC_MAY18');
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 3000);
  };

  const handleAddWish = (newWish: WishEntry) => {
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
        profileImg={PROFILE_IMAGE_URL}
      />

      {/* Main Content Sections */}
      <main className="w-full pt-16 bg-[#0D0D0E] min-h-screen">
        <div className="flex flex-col w-full text-slate-100">
          {/* SECTION 1: HERO & SPOTLIGHT */}
          <HeroSection
            profileImg={PROFILE_IMAGE_URL}
            onCopyPass={handleCopyPass}
            copiedPass={copiedPass}
          />

          {/* SECTION 2: CONVOCATION DATE & PROTOCOL SCHEDULE */}
          <ScheduleSection/>

          {/* SECTION 3: DRESS CODE SPECIFICATION */}
          <DressCodeSection />

          {/* SECTION 4: LOCATION & CAMPUS LOGISTICS */}
          <WayfindingSection/>

          {/* SECTION 5: GUESTBOOK & WALL OF WISHES */}
          <GuestbookSection
            wishes={wishes}
            onAddWish={handleAddWish}
            onLikeWish={handleLikeWish}
          />
        </div>
      </main>

      {/* Architectural Crimson Brutalist Footer */}
      <Footer />
    </div>
  );
}
