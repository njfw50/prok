/**
 * Music APIs Integration Service
 * Integra Last.fm, Genius, e MusicBrainz para dados reais de músicas
 * @module lib/music-api-service
 */

const LASTFM_API_KEY = '6b7c2c3f0c8d3f3e3c3f3c3f'; // Free tier
const GENIUS_ACCESS_TOKEN = 'wH0v0DXxCvLc9wm0yZ0UKzvGSXDKVTyZ5vFMJJYNDPLvSHCTsL0Sy8zX8UKzvGSX';

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
      const params = new URLSearchParams({
        method: 'track.getInfo',
        artist,
        track,
        api_key: this.apiKey,
        format: 'json',
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (data.track) {
        const track = data.track;
        return {
          title: track.name,
          artist: track.artist.name,
          album: track.album?.title || 'Unknown',
          imageUrl: track.album?.image?.[3]?.['#text'] || '',
          duration: parseInt(track.duration) / 1000,
          url: track.url,
        };
      }

      return null;
    } catch (error) {
      console.error('Last.fm API error:', error);
      return null;
    }
  }

  /**
   * Buscar top tracks de um artista
   */
  async getArtistTopTracks(artist: string): Promise<TrackData[]> {
    try {
      const params = new URLSearchParams({
        method: 'artist.gettoptracks',
        artist,
        api_key: this.apiKey,
        format: 'json',
        limit: '10',
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (data.toptracks?.track) {
        return data.toptracks.track.map((t: any) => ({
          title: t.name,
          artist: t.artist.name,
          album: '',
          imageUrl: t.image?.[3]?.['#text'] || '',
          duration: 0,
          url: t.url,
        }));
      }

      return [];
    } catch (error) {
      console.error('Last.fm API error:', error);
      return [];
    }
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

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (data.tracks?.track) {
        return data.tracks.track.map((t: any) => ({
          title: t.name,
          artist: t.artist.name,
          album: '',
          imageUrl: t.image?.[3]?.['#text'] || '',
          duration: 0,
          url: t.url,
        }));
      }

      return [];
    } catch (error) {
      console.error('Last.fm API error:', error);
      return [];
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
      const query = `${artist} ${title}`;
      const params = new URLSearchParams({
        q: query,
        access_token: this.accessToken,
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`);
      const data = await response.json();

      if (data.response?.hits?.[0]) {
        const hit = data.response.hits[0].result;
        return {
          lyrics: `Check full lyrics at: ${hit.url}`,
          source: 'Genius',
          artistName: hit.primary_artist.name,
        };
      }

      return null;
    } catch (error) {
      console.error('Genius API error:', error);
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
      const params = new URLSearchParams({
        query: `artist:"${artistName}"`,
        fmt: 'json',
      });

      const response = await fetch(
        `${this.baseUrl}/artist?${params}`,
        {
          headers: { 'User-Agent': 'KaraokePro/1.0' },
        }
      );
      const data = await response.json();
      return data.artists?.[0] || null;
    } catch (error) {
      console.error('MusicBrainz API error:', error);
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
      const query = `artist:"${artist}" recording:"${title}"`;
      const params = new URLSearchParams({
        query,
        fmt: 'json',
        limit: '10',
      });

      const response = await fetch(
        `${this.baseUrl}/recording?${params}`,
        {
          headers: { 'User-Agent': 'KaraokePro/1.0' },
        }
      );
      const data = await response.json();

      return (
        data.recordings?.map((rec: any) => ({
          title: rec.title,
          artist: rec['artist-credit']?.[0]?.artist?.name || 'Unknown',
          album: rec.releases?.[0]?.title || 'Unknown',
          imageUrl: '',
          duration: rec.length ? rec.length / 1000 : 0,
          url: `https://musicbrainz.org/recording/${rec.id}`,
        })) || []
      );
    } catch (error) {
      console.error('MusicBrainz API error:', error);
      return [];
    }
  }
}

export const lastfmService = new LastFmService();
export const geniusService = new GeniusService();
export const musicbrainzService = new MusicBrainzService();

export type { TrackData, LyricData };
