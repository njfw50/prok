/**
 * Music APIs Integration Service
 * Integra Last.fm, Genius, e MusicBrainz para dados reais de músicas
 * Com fallback para dados mock quando API falha
 * @module lib/music-api-service
 */

import { MOCK_SONGS, CHART_SONGS } from './mock-fallback';

// Use environment variables or fallback to demo keys
const LASTFM_API_KEY = process.env.EXPO_PUBLIC_LASTFM_API_KEY || 'e41df2b10f7f6c3436d1ba915d616dc4';
const GENIUS_ACCESS_TOKEN = process.env.EXPO_PUBLIC_GENIUS_TOKEN || 'MYxc_LJ-fV7FT6sFQOhqKSMb4UwL3aMBhx8a1Zr8LSDQvLZxLqNqNSHiAhCqGDHb';

interface TrackData {
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  duration: number;
  url: string;
}

interface LyricData {
  lyrics: string;
  source: string;
  artistName: string;
}

/**
 * Last.fm API Service - Free tier, dados reais de músicas
 */
export class LastFmService {
  private baseUrl = 'https://ws.audioscrobbler.com/2.0';
  private apiKey = LASTFM_API_KEY;

  /**
   * Buscar informações de uma faixa
   */
  async searchTrack(artist: string, track: string): Promise<TrackData | null> {
    try {
      if (!artist || !track) {
        console.warn('Last.fm: Artist or track name is empty');
        return this.getMockTrack(artist, track);
      }

      const params = new URLSearchParams({
        method: 'track.getInfo',
        artist: artist.trim(),
        track: track.trim(),
        api_key: this.apiKey,
        format: 'json',
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`Last.fm API error: ${response.status} - Using mock data`);
        return this.getMockTrack(artist, track);
      }

      const data = await response.json();

      if (data.error) {
        console.warn('Last.fm API error:', data.message, '- Using mock data');
        return this.getMockTrack(artist, track);
      }

      if (data.track) {
        const t = data.track;
        return {
          title: t.name || 'Unknown',
          artist: t.artist?.name || artist,
          album: t.album?.title || 'Unknown',
          imageUrl: t.album?.image?.[3]?.['#text'] || '',
          duration: t.duration ? parseInt(t.duration) / 1000 : 0,
          url: t.url || '',
        };
      }

      return this.getMockTrack(artist, track);
    } catch (error) {
      console.error('Last.fm API error:', error instanceof Error ? error.message : String(error), '- Using mock data');
      return this.getMockTrack(artist, track);
    }
  }

  /**
   * Get mock track for fallback
   */
  private getMockTrack(artist: string, track: string): TrackData | null {
    const mockKey = artist.toLowerCase();
    const mockData = (MOCK_SONGS as any)[mockKey];
    
    if (mockData && Array.isArray(mockData)) {
      return mockData[0] || null;
    }

    return null;
  }

  /**
   * Buscar top tracks de um artista
   */
  async getArtistTopTracks(artist: string): Promise<TrackData[]> {
    try {
      if (!artist) {
        console.warn('Last.fm: Artist name is empty');
        return this.getMockArtistTracks(artist);
      }

      const params = new URLSearchParams({
        method: 'artist.gettoptracks',
        artist: artist.trim(),
        api_key: this.apiKey,
        format: 'json',
        limit: '10',
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`Last.fm API error: ${response.status} - Using mock data`);
        return this.getMockArtistTracks(artist);
      }

      const data = await response.json();

      if (data.error) {
        console.warn('Last.fm API error:', data.message, '- Using mock data');
        return this.getMockArtistTracks(artist);
      }

      if (data.toptracks?.track && Array.isArray(data.toptracks.track)) {
        return data.toptracks.track.map((t: any) => ({
          title: t.name || 'Unknown',
          artist: t.artist?.name || artist,
          album: '',
          imageUrl: t.image?.[3]?.['#text'] || '',
          duration: 0,
          url: t.url || '',
        }));
      }

      return this.getMockArtistTracks(artist);
    } catch (error) {
      console.error('Last.fm API error:', error instanceof Error ? error.message : String(error), '- Using mock data');
      return this.getMockArtistTracks(artist);
    }
  }

  /**
   * Get mock tracks for fallback
   */
  private getMockArtistTracks(artist: string): TrackData[] {
    const mockKey = artist.toLowerCase();
    const mockData = (MOCK_SONGS as any)[mockKey];
    return mockData || [];
  }

  /**
   * Buscar tracks populares (chart)
   */
  async getChartTracks(): Promise<TrackData[]> {
    try {
      const params = new URLSearchParams({
        method: 'chart.gettracks',
        api_key: this.apiKey,
        format: 'json',
        limit: '20',
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`Last.fm API error: ${response.status} - Using mock data`);
        return CHART_SONGS;
      }

      const data = await response.json();

      if (data.error) {
        console.warn('Last.fm API error:', data.message, '- Using mock data');
        return CHART_SONGS;
      }

      if (data.tracks?.track && Array.isArray(data.tracks.track)) {
        return data.tracks.track.map((t: any) => ({
          title: t.name || 'Unknown',
          artist: t.artist?.name || 'Unknown Artist',
          album: '',
          imageUrl: t.image?.[3]?.['#text'] || '',
          duration: 0,
          url: t.url || '',
        }));
      }

      return CHART_SONGS;
    } catch (error) {
      console.error('Last.fm API error:', error instanceof Error ? error.message : String(error), '- Using mock data');
      return CHART_SONGS;
    }
  }
}

/**
 * Genius API Service - Letras de músicas
 */
export class GeniusService {
  private baseUrl = 'https://api.genius.com';
  private accessToken = GENIUS_ACCESS_TOKEN;

  /**
   * Buscar letras de uma música
   */
  async searchLyrics(artist: string, title: string): Promise<LyricData | null> {
    try {
      if (!artist || !title) {
        console.warn('Genius: Artist or title is empty');
        return null;
      }

      const query = `${artist.trim()} ${title.trim()}`;
      const params = new URLSearchParams({
        q: query,
        access_token: this.accessToken,
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`Genius API error: ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (!data.response?.hits?.[0]) {
        console.warn('Genius: No results found');
        return null;
      }

      const hit = data.response.hits[0].result;
      return {
        lyrics: `Check full lyrics at: ${hit.url}`,
        source: 'Genius',
        artistName: hit.primary_artist?.name || artist,
      };
    } catch (error) {
      console.error('Genius API error:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
}

/**
 * MusicBrainz API Service - Dados musicais completos (100% grátis)
 */
export class MusicBrainzService {
  private baseUrl = 'https://musicbrainz.org/api';

  /**
   * Buscar artista
   */
  async searchArtist(artistName: string) {
    try {
      if (!artistName) {
        console.warn('MusicBrainz: Artist name is empty');
        return null;
      }

      const params = new URLSearchParams({
        query: `artist:"${artistName.trim()}"`,
        fmt: 'json',
      });

      const response = await fetch(`${this.baseUrl}/artist?${params}`, {
        headers: { 
          'User-Agent': 'KaraokePro/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`MusicBrainz API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.artists?.[0] || null;
    } catch (error) {
      console.error('MusicBrainz API error:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Buscar gravações (recordings) de uma música
   */
  async searchRecordings(
    artist: string,
    title: string
  ): Promise<TrackData[]> {
    try {
      if (!artist || !title) {
        console.warn('MusicBrainz: Artist or title is empty');
        return [];
      }

      const query = `artist:"${artist.trim()}" recording:"${title.trim()}"`;
      const params = new URLSearchParams({
        query,
        fmt: 'json',
        limit: '10',
      });

      const response = await fetch(`${this.baseUrl}/recording?${params}`, {
        headers: { 
          'User-Agent': 'KaraokePro/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`MusicBrainz API error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      return (
        data.recordings?.map((rec: any) => ({
          title: rec.title || 'Unknown',
          artist: rec['artist-credit']?.[0]?.artist?.name || artist,
          album: rec.releases?.[0]?.title || 'Unknown',
          imageUrl: '',
          duration: rec.length ? rec.length / 1000 : 0,
          url: `https://musicbrainz.org/recording/${rec.id}`,
        })) || []
      );
    } catch (error) {
      console.error('MusicBrainz API error:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }
}

export const lastfmService = new LastFmService();
export const geniusService = new GeniusService();
export const musicbrainzService = new MusicBrainzService();

export type { TrackData, LyricData };
