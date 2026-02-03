/**
 * Karaoke App Data Types
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  audioUrl: string;
  lyrics: LyricLine[];
  plays: number;
  isFavorite?: boolean;
}

export interface LyricLine {
  timestamp: number; // in milliseconds
  text: string;
}

export interface UserPreferences {
  volume: number; // 0-100
  lyricsSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
  enableEcho: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number; // in milliseconds
  duration: number; // in milliseconds
  currentLyricIndex: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
