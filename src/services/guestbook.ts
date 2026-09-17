import { AffiliationType } from '../types';
import { supabase } from '../utils/supabase';

export type ConnectionType = 'friend' | 'colleague' | 'family' | 'lecturer';
export type QuickTag = 'congrats' | 'future_success' | 'best_wishes' | 'proud_of_you';

export interface GuestbookPayload {
  fullName: string;
  connectionType: ConnectionType;
  messagePayload: string;
  quickTags: QuickTag[];
}

export interface GuestbookEntry {
  id: number;
  fullName: string;
  connectionType: string;
  messagePayload: string;
  quickTags: string[];
  createdAt: string;
}

export interface Guest {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export const fetchGuestById = async (id: string): Promise<Guest | null> => {
  const { data, error } = await supabase
    .from('guests')
    .select('id, full_name, avatar_url')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Không thể lấy thông tin khách mời');
  }

  return data
    ? { id: data.id, fullName: data.full_name, avatarUrl: data.avatar_url }
    : null;
};

const affiliationToConnectionType: Record<AffiliationType, ConnectionType> = {
  Family: 'family',
  Friend: 'friend',
  Colleague: 'colleague',
  Lecturer: 'lecturer',
};

const tagToQuickTag: Record<string, QuickTag> = {
  '🎓 PROUD_OF_YOU': 'proud_of_you',
  '🚀 NEXT_CHAPTER': 'future_success',
  '💫 KEEP_SHINING': 'best_wishes',
  '❤️ ALWAYS_ROOTING': 'congrats',
};

export const submitGuestbookEntry = async (data: GuestbookPayload) => {
  const { error } = await supabase.from('guestbook').insert({
    full_name: data.fullName,
    connection_type: data.connectionType,
    message_payload: data.messagePayload,
    quick_tags: data.quickTags,
  });

  if (error) {
    throw new Error(error.message || 'Gửi lời chúc thất bại');
  }
};

export const fetchGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, full_name, connection_type, message_payload, quick_tags, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Không thể lấy dữ liệu lưu bút');
  }

  return data.map(entry => ({
    id: entry.id,
    fullName: entry.full_name,
    connectionType: entry.connection_type,
    messagePayload: entry.message_payload,
    quickTags: entry.quick_tags || [],
    createdAt: entry.created_at,
  }));
};

export const toGuestbookPayload = (
  fullName: string,
  affiliation: AffiliationType,
  message: string,
  tags: string[],
): GuestbookPayload => ({
  fullName: fullName.trim(),
  connectionType: affiliationToConnectionType[affiliation],
  messagePayload: message.trim(),
  quickTags: tags.flatMap(tag => (tagToQuickTag[tag] ? [tagToQuickTag[tag]] : [])),
});