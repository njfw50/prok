import { Song, Category } from './types';

/**
 * Mock song database for development
 * In production, this would be fetched from a backend API
 */

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Pop', icon: 'music.note' },
  { id: '2', name: 'Rock', icon: 'guitar' },
  { id: '3', name: 'Hip-Hop', icon: 'mic.fill' },
  { id: '4', name: 'R&B', icon: 'music.note.list' },
  { id: '5', name: 'Country', icon: 'music.note' },
  { id: '6', name: 'Jazz', icon: 'music.note' },
  { id: '7', name: 'Worship', icon: 'favorite' },
];

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: 200,
    category: 'Pop',
    difficulty: 'easy',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%231DB954%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2260%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🎤%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 1250000,
    lyrics: [
      { timestamp: 0, text: 'I can\'t sleep until I feel your touch' },
      { timestamp: 3000, text: 'And I can\'t wake up without looking up at you' },
      { timestamp: 6000, text: 'I\'m blinded by the lights' },
      { timestamp: 9000, text: 'No, I can\'t sleep until I feel your touch' },
      { timestamp: 12000, text: 'And I can\'t wake up without looking up at you' },
      { timestamp: 15000, text: 'I\'m blinded by the lights' },
    ],
  },
  {
    id: '2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: 354,
    category: 'Rock',
    difficulty: 'hard',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%23000%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2260%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🎸%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 890000,
    lyrics: [
      { timestamp: 0, text: 'Is this the real life? Is this just fantasy?' },
      { timestamp: 4000, text: 'Caught in a landslide, no escape from reality' },
      { timestamp: 8000, text: 'Open your eyes, look up to the skies and see' },
      { timestamp: 12000, text: 'I\'m just a poor boy, I need no sympathy' },
      { timestamp: 16000, text: 'Because I\'m easy come, easy go' },
      { timestamp: 20000, text: 'Little high, little low, any way the wind blows' },
    ],
  },
  {
    id: '3',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: 234,
    category: 'Pop',
    difficulty: 'easy',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g3%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23FF6B6B;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23FF8E72;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g3)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E💃%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 2100000,
    lyrics: [
      { timestamp: 0, text: 'The club isn\'t the best place to find a lover' },
      { timestamp: 3000, text: 'So the bar is where I go' },
      { timestamp: 6000, text: 'Me and my friends at the table doing shots' },
      { timestamp: 9000, text: 'Drinking fast and then we talk slow' },
      { timestamp: 12000, text: 'And you come over and play with my hair' },
      { timestamp: 15000, text: 'And we fall into the mattress' },
    ],
  },
  {
    id: '4',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    duration: 269,
    category: 'Pop',
    difficulty: 'medium',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g4%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%2300D9FF;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%2300B4D8;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g4)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🎷%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 1800000,
    lyrics: [
      { timestamp: 0, text: 'This hit, that ice cold' },
      { timestamp: 2000, text: 'Michelle Pfeiffer, that white gold' },
      { timestamp: 4000, text: 'This one for them hood girls' },
      { timestamp: 6000, text: 'Them good girls straight masterpieces' },
      { timestamp: 8000, text: 'Stylin\' while you\'re wildin\'' },
      { timestamp: 10000, text: 'Livin\' it up in the city' },
    ],
  },
  {
    id: '5',
    title: 'Lose Yourself',
    artist: 'Eminem',
    duration: 326,
    category: 'Hip-Hop',
    difficulty: 'hard',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g5%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23F4A460;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23FFA500;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g5)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🎤%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 1600000,
    lyrics: [
      { timestamp: 0, text: 'Yo, his palms are sweaty, knees weak, arms are heavy' },
      { timestamp: 3000, text: 'There\'s vomit on his sweater already, mom\'s spaghetti' },
      { timestamp: 6000, text: 'He\'s nervous, but on the surface looks calm and ready' },
      { timestamp: 9000, text: 'To drop bombs, but he keeps on forgetting' },
      { timestamp: 12000, text: 'What he wrote down, the whole line\'s so loud' },
      { timestamp: 15000, text: 'He opens his mouth, but won\'t let spit out' },
    ],
  },
  {
    id: '6',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    duration: 310,
    category: 'Rock',
    difficulty: 'medium',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g6%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%239B59B6;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23BB86FC;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g6)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E😇%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 950000,
    lyrics: [
      { timestamp: 0, text: 'I heard there was a secret chord' },
      { timestamp: 4000, text: 'That David played and it pleased the Lord' },
      { timestamp: 8000, text: 'But you don\'t really care for music, do you?' },
      { timestamp: 12000, text: 'It goes like this, the fourth, the fifth' },
      { timestamp: 16000, text: 'The minor fall, the major lift' },
      { timestamp: 20000, text: 'The baffled king composing Hallelujah' },
    ],
  },
  {
    id: '7',
    title: 'Levitating',
    artist: 'Dua Lipa',
    duration: 203,
    category: 'Pop',
    difficulty: 'easy',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g7%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%2300D9FF;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%2300F5FF;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g7)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E✨%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 1450000,
    lyrics: [
      { timestamp: 0, text: 'If you believe in me, I can rise above anything' },
      { timestamp: 3000, text: 'If you believe in me, I can do anything' },
      { timestamp: 6000, text: 'I got this energy inside me now' },
      { timestamp: 9000, text: 'If you stay by my side, I can take on the world' },
      { timestamp: 12000, text: 'I\'m levitating' },
      { timestamp: 15000, text: 'No time for gravity' },
    ],
  },
  {
    id: '8',
    title: 'Smooth Criminal',
    artist: 'Michael Jackson',
    duration: 261,
    category: 'Pop',
    difficulty: 'medium',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g8%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23333333;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23555555;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g8)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🕺%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 1200000,
    lyrics: [
      { timestamp: 0, text: 'As he came into the window' },
      { timestamp: 3000, text: 'It was the sound of a crescendo' },
      { timestamp: 6000, text: 'He came into her apartment' },
      { timestamp: 9000, text: 'He left the bloodstains on the carpet' },
      { timestamp: 12000, text: 'She ran underneath the table' },
      { timestamp: 15000, text: 'He could see she was unable' },
    ],
  },
  {
    id: '9',
    title: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    duration: 270,
    category: 'Worship',
    difficulty: 'medium',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Cdefs%3E%3ClinearGradient id=%22g9%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23F8B739;stop-opacity:1%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23E6A200;stop-opacity:1%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g9)%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E✝️%3C/text%3E%3C/svg%3E',
    audioUrl: '',
    plays: 2800000,
    lyrics: [
      { timestamp: 0, text: 'You were the Word at the beginning' },
      { timestamp: 4000, text: 'One with God the Lord Most High' },
      { timestamp: 8000, text: 'Very God and very human' },
      { timestamp: 12000, text: 'You are the King of all creation' },
      { timestamp: 16000, text: 'And in Your hands all things are held together' },
      { timestamp: 20000, text: 'You are the Light that\'s shining through the darkness' },
      { timestamp: 24000, text: 'You\'re the Name above all names' },
      { timestamp: 28000, text: 'What a beautiful Name it is' },
      { timestamp: 32000, text: 'What a beautiful Name, Jesus Christ' },
    ],
  },
];

/**
 * Get all songs
 */
export function getAllSongs(): Song[] {
  return MOCK_SONGS;
}

/**
 * Get songs by category
 */
export function getSongsByCategory(category: string): Song[] {
  return MOCK_SONGS.filter((song) => song.category === category);
}

/**
 * Search songs by title or artist
 */
export function searchSongs(query: string): Song[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_SONGS.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get song by ID
 */
export function getSongById(id: string): Song | undefined {
  return MOCK_SONGS.find((song) => song.id === id);
}

/**
 * Get trending songs (sorted by plays)
 */
export function getTrendingSongs(limit: number = 5): Song[] {
  return [...MOCK_SONGS].sort((a, b) => b.plays - a.plays).slice(0, limit);
}

/**
 * Get featured songs (first 3)
 */
export function getFeaturedSongs(): Song[] {
  return MOCK_SONGS.slice(0, 3);
}
