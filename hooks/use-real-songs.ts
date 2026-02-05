/**
 * Hook para integrar Last.fm API com lista de músicas
 * Substitui completamente o mock-songs.ts por dados reais
 * @module hooks/use-real-songs
 */

import { useEffect, useState } from 'react';
import { lastfmService, type TrackData } from '@/lib/music-api-service';

export interface Song extends TrackData {
  id: string;
  lyrics?: string;
}

export interface UseSongsState {
  songs: Song[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

/**
 * Hook para carregar músicas reais via Last.fm
 */
export function useRealSongs(
  query?: string,
  artist?: string,
  limit = 12
): UseSongsState {
  const [state, setState] = useState<UseSongsState>({
    songs: [],
    loading: true,
    error: null,
    currentPage: 0,
    hasMore: true,
  });

  useEffect(() => {
    const loadSongs = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let songs: Song[] = [];

        if (artist) {
          // Buscar top tracks de um artista
          const tracks = await lastfmService.getArtistTopTracks(artist);
          songs = tracks.map((t, i) => ({
            ...t,
            id: `${t.artist}-${t.title}-${i}`,
          }));
        } else if (query) {
          // Buscar por query - pode ser melhorado
          const tracks = await lastfmService.getChartTracks();
          songs = tracks.map((t, i) => ({
            ...t,
            id: `chart-${i}`,
          }));
        } else {
          // Carregar músicas populares (chart)
          const tracks = await lastfmService.getChartTracks();
          songs = tracks
            .slice(0, limit)
            .map((t, i) => ({
              ...t,
              id: `chart-${i}`,
            }));
        }

        setState((prev) => ({
          ...prev,
          songs,
          loading: false,
          hasMore: songs.length >= limit,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Erro ao carregar músicas',
          loading: false,
        }));
      }
    };

    loadSongs();
  }, [query, artist, limit]);

  return state;
}

/**
 * Hook para buscar uma música específica
 */
export function useSearchSong(
  artist: string,
  title: string
): { song: Song | null; loading: boolean; error: string | null } {
  const [state, setState] = useState({
    song: null as Song | null,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const searchSong = async () => {
      try {
        const track = await lastfmService.searchTrack(artist, title);
        if (track) {
          setState({
            song: {
              ...track,
              id: `${track.artist}-${track.title}`,
            },
            loading: false,
            error: null,
          });
        } else {
          setState({
            song: null,
            loading: false,
            error: 'Música não encontrada',
          });
        }
      } catch (error) {
        setState({
          song: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Erro ao buscar música',
        });
      }
    };

    if (artist && title) {
      searchSong();
    }
  }, [artist, title]);

  return state;
}

/**
 * Hook para carregar top tracks de vários artistas populares
 */
export async function getTopSongsByGenre(
  artists: string[]
): Promise<Song[]> {
  const allSongs: Song[] = [];

  for (const artist of artists) {
    const tracks = await lastfmService.getArtistTopTracks(artist);
    tracks.slice(0, 3).forEach((t, i) => {
      allSongs.push({
        ...t,
        id: `${artist}-top-${i}`,
      });
    });
  }

  return allSongs;
}

/**
 * Hook para preload de músicas populares
 */
export function usePopularSongs(): Song[] {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const loadPopular = async () => {
      // Artistas populares para demo
      const popularArtists = [
        'The Weeknd',
        'Ariana Grande',
        'Post Malone',
        'Drake',
        'Taylor Swift',
      ];

      const songs = await getTopSongsByGenre(popularArtists);
      setSongs(songs);
    };

    loadPopular();
  }, []);

  return songs;
}
