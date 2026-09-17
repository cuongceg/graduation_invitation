export type AffiliationType = 
  | 'Family' 
  | 'Friend'
  | 'Colleague'
  | 'Lecturer';

export interface WishEntry {
  id: string;
  name: string;
  affiliation: AffiliationType;
  initials: string;
  message: string;
  timestamp: string;
  likes: number;
  tags?: string[];
  isCustom?: boolean;
}

export type ActiveNavTab = 'overview' | 'dress-code' | 'guestbook' | 'sector-map';

export type LanguageCode = 'en' | 'vi';

export interface ScheduleEvent {
  time: string;
  title: string;
  location: string;
  description: string;
  sector: string;
  status: 'PENDING' | 'SCHEDULED' | 'CONFIRMED';
}
