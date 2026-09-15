export type AffiliationType = 
  | 'Gia đình' 
  | 'Bạn học' 
  | 'Giảng viên' 
  | 'Bạn thân' 
  | 'Lab Partner' 
  | 'Advisor'
  | 'Khác';

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

export type ActiveNavTab = 'overview' | 'timeline' | 'guestbook' | 'sector-map';

export type LanguageCode = 'en' | 'vi';

export interface ScheduleEvent {
  time: string;
  title: string;
  location: string;
  description: string;
  sector: string;
  status: 'PENDING' | 'SCHEDULED' | 'CONFIRMED';
}
