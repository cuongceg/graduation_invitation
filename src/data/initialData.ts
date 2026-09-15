import { WishEntry, ScheduleEvent } from '../types';

export const INITIAL_WISHES: WishEntry[] = [
  {
    id: 'wish-1',
    name: 'Bác Hùng & Cô Mai',
    affiliation: 'Gia đình',
    initials: 'BH',
    message: '"Tự hào về cháu vô cùng! Tấm bằng danh dự này là minh chứng cho biết bao nỗ lực không ngừng nghỉ suốt 4 năm qua. Chúc cháu luôn vững vàng và rạng rỡ trên con đường sự nghiệp mới!"',
    timestamp: '10 MINS AGO',
    likes: 12,
    tags: ['🎓 PROUD_OF_YOU', '✨ BRIGHT_FUTURE'],
  },
  {
    id: 'wish-2',
    name: 'Claire Tremblay',
    affiliation: 'Lab Partner',
    initials: 'CT',
    message: '"Maya, couldn\'t have survived thesis season and late nights at the architecture lab without your brilliance and humor! With great power comes great convocations! 🥂✨"',
    timestamp: '42 MINS AGO',
    likes: 8,
    tags: ['✨ BRIGHT_FUTURE', '🕷️ SPIDER_PRIDE'],
  },
  {
    id: 'wish-3',
    name: 'Prof. Alan King',
    affiliation: 'Advisor',
    initials: 'AK',
    message: '"It was an honor guiding your senior capstone. Your intellectual curiosity and system architecture designs are extraordinary. Leap with confidence into the multiverse."',
    timestamp: '2 HOURS AGO',
    likes: 19,
    tags: ['🎓 PROUD_OF_YOU'],
  },
  {
    id: 'wish-4',
    name: 'Gwen & Miles',
    affiliation: 'Bạn thân',
    initials: 'GM',
    message: '"From midnight debugging on Earth-1610 to walking the stage, you nailed it! See you at the rooftop reception with the whole spider crew."',
    timestamp: '3 HOURS AGO',
    likes: 24,
    tags: ['🕷️ SPIDER_PRIDE', '✨ BRIGHT_FUTURE'],
  },
  {
    id: 'wish-5',
    name: 'Minh Tuấn (K20)',
    affiliation: 'Bạn học',
    initials: 'MT',
    message: '"Chúc mừng tân cử nhân xuất sắc nhất lab! Chúc chặng đường mới tại MIT Quantum Computing lab luôn bùng nổ và gặt hái nhiều thành công rực rỡ."',
    timestamp: '5 HOURS AGO',
    likes: 7,
    tags: ['🎓 PROUD_OF_YOU'],
  }
];

export const CEREMONY_TIMELINE: ScheduleEvent[] = [
  {
    time: '08:30 - 09:30 EST',
    title: 'Candidate Check-In & Robing Protocol',
    location: 'Atrium Level 2 // Sector 4',
    description: 'Graduates receive credential validation, honor cords, and assemble in processional order.',
    sector: 'SECTOR_04',
    status: 'CONFIRMED',
  },
  {
    time: '09:45 EST',
    title: 'Gates Lock & Processional Assembly',
    location: 'North Quad Portico',
    description: 'Doors close promptly. Academic marshals initiate the herald trumpets and processional march.',
    sector: 'SECTOR_07',
    status: 'CONFIRMED',
  },
  {
    time: '10:00 - 10:45 EST',
    title: 'Commencement Convocation & Keynote',
    location: 'Academic Quadrangle Main Amphitheater',
    description: 'Welcome by Dean of Computing, followed by Keynote address by Dr. Helen Parker (Director of Quantum AI).',
    sector: 'SECTOR_01',
    status: 'CONFIRMED',
  },
  {
    time: '10:45 - 11:45 EST',
    title: 'Conferral of Degrees & Academic Hooding',
    location: 'Great Stage // Academic Quad',
    description: 'Individual recognition of B.S. Advanced Computing candidates. Maya C. Vance assigned Seat A-14.',
    sector: 'SECTOR_01',
    status: 'CONFIRMED',
  },
  {
    time: '11:45 - 12:00 EST',
    title: 'The Great Multiverse Cap Toss & Recessional',
    location: 'Grand Quadrangle Lawn',
    description: 'Celebratory mortarboard toss and recessional march led by the university brass ensemble.',
    sector: 'SECTOR_01',
    status: 'CONFIRMED',
  }
];

export const RECEPTION_DETAILS = {
  title: 'Post-Ceremony Garden Reception & Toast',
  time: '12:30 - 15:00 EST',
  location: 'Stark Academic Pavilion & Glass Atrium',
  catering: 'Artisanal Multiverse Canapés, Vietnamese Cold Brew Bar & Sparkling Toast',
  dress: 'Commencement Robes or Academic Celebratory / Tech Formal',
  features: [
    'Custom Spider-Verse Hologram Photo Booth (Live AR prints)',
    'Live Jazz Quartet & Ambient Synth Performance',
    'Senior Capstone Project Display Showcase',
    'Graduation Guestbook physical signing station'
  ]
};

export const WALKING_STEPS = [
  { step: '01', desc: 'Exit Guest Parking Lot B via North Pedestrian Gate', dist: '50m', time: '1 min' },
  { step: '02', desc: 'Follow the illuminated crimson pathway towards Sector 7 Archway', dist: '120m', time: '1.5 min' },
  { step: '03', desc: 'Pass the Waiting Lounge & Security Verification checkpoint', dist: '80m', time: '1 min' },
  { step: '04', desc: 'Arrive at Ceremony Hall (North Quad) // Main Entrance doors', dist: '100m', time: '1.5 min' },
];
