import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song, UserPreferences, PlaybackState } from './types';

interface KaraokeContextType {
  favorites: string[];
  recentlyPlayed: string[];
  preferences: UserPreferences;
  currentSong: Song | null;
  playbackState: PlaybackState;
  
  addFavorite: (songId: string) => Promise<void>;
  removeFavorite: (songId: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
  
  addToRecentlyPlayed: (songId: string) => Promise<void>;
  
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  
  setCurrentSong: (song: Song | null) => void;
  updatePlaybackState: (state: Partial<PlaybackState>) => void;
}

const KaraokeContext = createContext<KaraokeContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  volume: 80,
  lyricsSize: 'medium',
  theme: 'dark',
  enableEcho: false,
};

export function KaraokeProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentLyricIndex: 0,
  });

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const [savedFavorites, savedRecent, savedPrefs] = await Promise.all([
        AsyncStorage.getItem('karaoke_favorites'),
        AsyncStorage.getItem('karaoke_recently_played'),
        AsyncStorage.getItem('karaoke_preferences'),
      ]);

      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedRecent) setRecentlyPlayed(JSON.parse(savedRecent));
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const addFavorite = useCallback(
    async (songId: string) => {
      const updated = [...favorites, songId];
      setFavorites(updated);
      await AsyncStorage.setItem('karaoke_favorites', JSON.stringify(updated));
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (songId: string) => {
      const updated = favorites.filter((id) => id !== songId);
      setFavorites(updated);
      await AsyncStorage.setItem('karaoke_favorites', JSON.stringify(updated));
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (songId: string) => favorites.includes(songId),
    [favorites]
  );

  const addToRecentlyPlayed = useCallback(
    async (songId: string) => {
      const filtered = recentlyPlayed.filter((id) => id !== songId);
      const updated = [songId, ...filtered].slice(0, 20); // Keep last 20
      setRecentlyPlayed(updated);
      await AsyncStorage.setItem('karaoke_recently_played', JSON.stringify(updated));
    },
    [recentlyPlayed]
  );

  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>) => {
      const updated = { ...preferences, ...prefs };
      setPreferences(updated);
      await AsyncStorage.setItem('karaoke_preferences', JSON.stringify(updated));
    },
    [preferences]
  );

  const updatePlaybackState = useCallback((state: Partial<PlaybackState>) => {
    setPlaybackState((prev) => ({ ...prev, ...state }));
  }, []);

  const value: KaraokeContextType = {
    favorites,
    recentlyPlayed,
    preferences,
    currentSong,
    playbackState,
    addFavorite,
    removeFavorite,
    isFavorite,
    addToRecentlyPlayed,
    updatePreferences,
    setCurrentSong,
    updatePlaybackState,
  };

  return <KaraokeContext.Provider value={value}>{children}</KaraokeContext.Provider>;
}

export function useKaraoke() {
  const context = useContext(KaraokeContext);
  if (!context) {
    throw new Error('useKaraoke must be used within KaraokeProvider');
  }
  return context;
}
