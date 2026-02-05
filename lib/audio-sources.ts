/**
 * YouTube Music API Service (Alternative)
 * Can be used as alternative to Spotify/Apple Music for audio URLs
 * Note: Requires unofficial library or custom implementation
 * @module lib/youtube-music-service
 */

/**
 * YouTubeMusicService - Alternative audio source for karaoke
 * Uses unofficial YouTube Music API or web scraping
 *
 * Benefits:
 * - Free (no API key required for basic usage)
 * - Large music library
 * - Direct audio URLs
 * - Works with most songs on Last.fm
 *
 * Limitations:
 * - Not officially supported by Google
 * - Terms of Service may prohibit usage
 * - Rate limiting by YouTube
 *
 * Better Alternatives for Production:
 * - Spotify API (requires premium, but legal)
 * - Apple Music (requires subscription)
 * - YouTube Data API (official, but limited)
 * - SoundCloud API (has free tier)
 */

export class YouTubeMusicService {
  /**
   * Search for audio on YouTube Music
   * This is a placeholder - real implementation would need:
   * 1. Official YouTube Data API (requires auth)
   * 2. Unofficial ytmusic library
   * 3. Or custom web scraping
   */
  async searchAudio(
    artist: string,
    title: string
  ): Promise<string | null> {
    // Placeholder implementation
    // In production, you would use one of:

    // Option 1: YouTube Data API (Official)
    // const response = await fetch(
    //   `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${artist}%20${title}&type=video&key=${API_KEY}`
    // );
    // const data = await response.json();
    // return data.items[0]?.id?.videoId;

    // Option 2: ytmusic library (npm install ytmusic)
    // const ytmusic = new YTMusic(auth);
    // const results = await ytmusic.search_songs(`${artist} ${title}`);
    // return results[0]?.videoId;

    // Option 3: HLS stream URL (if available)
    // return `https://music.youtube.com/watch?v=${videoId}`;

    console.warn('YouTubeMusicService: Real implementation needed');
    return null;
  }

  /**
   * Get direct audio URL for karaoke
   * Note: This typically requires authentication and special handling
   */
  async getAudioUrl(videoId: string): Promise<string | null> {
    // In production, would extract audio stream from video
    // This is complex due to YouTube's protections

    // Possible approaches:
    // 1. Use yt-dlp or youtube-dl backend service
    // 2. Use unofficial ytmusic library with auth
    // 3. Use third-party service (may violate ToS)

    console.warn('YouTubeMusicService: Cannot extract audio directly');
    return null;
  }
}

/**
 * Spotify API Service (Recommended for production)
 * Official API, legal, with audio preview URLs
 */
export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';
  private clientId = 'your_client_id_here';
  private clientSecret = 'your_client_secret_here';
  private accessToken: string | null = null;

  /**
   * Get Spotify access token using Client Credentials flow
   * Free tier: 30-second previews available
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const credentials = btoa(`${this.clientId}:${this.clientSecret}`);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  /**
   * Search for a track on Spotify
   */
  async searchTrack(artist: string, track: string) {
    const token = await this.getAccessToken();
    const query = encodeURIComponent(`${artist} ${track}`);

    const response = await fetch(
      `${this.baseUrl}/search?q=${query}&type=track&limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    const data = await response.json();
    return data.tracks.items[0] || null;
  }

  /**
   * Get 30-second preview URL (free tier)
   * Note: Not all tracks have preview URLs
   */
  async getPreviewUrl(
    artist: string,
    track: string
  ): Promise<string | null> {
    const result = await this.searchTrack(artist, track);
    return result?.preview_url || null;
  }

  /**
   * Get full track details
   */
  async getTrackDetails(artist: string, track: string) {
    const token = await this.getAccessToken();
    const result = await this.searchTrack(artist, track);

    if (!result) return null;

    return {
      id: result.id,
      title: result.name,
      artist: result.artists[0]?.name,
      album: result.album?.name,
      duration: result.duration_ms / 1000,
      imageUrl: result.album?.images?.[0]?.url,
      previewUrl: result.preview_url,
      uri: result.uri, // For playback in Spotify SDK
    };
  }
}

/**
 * Apple Music API (Premium integration)
 * Requires subscription but has best audio quality
 */
export class AppleMusicService {
  private baseUrl = 'https://api.music.apple.com/v1';
  private developerToken = 'your_jwt_token_here';

  // Implementation similar to Spotify
  // Requires JWT token and user music kit

  async searchTrack(artist: string, track: string) {
    const query = encodeURIComponent(`${artist} ${track}`);

    const response = await fetch(
      `${this.baseUrl}/catalog/us/search?term=${query}&types=songs`,
      {
        headers: { 'Authorization': `Bearer ${this.developerToken}` },
      }
    );

    return await response.json();
  }
}

/**
 * Deezer API (Free with limitations)
 * Has free tier, good audio quality
 */
export class DeezerService {
  private baseUrl = 'https://api.deezer.com';

  /**
   * Search for track on Deezer (no auth required)
   */
  async searchTrack(artist: string, track: string) {
    const query = encodeURIComponent(`${artist} ${track}`);

    const response = await fetch(
      `${this.baseUrl}/search?q=${query}&limit=1`
    );

    const data = await response.json();
    return data.data?.[0] || null;
  }

  /**
   * Get preview URL (30 seconds)
   */
  async getPreviewUrl(
    artist: string,
    track: string
  ): Promise<string | null> {
    const result = await this.searchTrack(artist, track);
    return result?.preview || null;
  }
}

/**
 * SoundCloud API (Has free tier)
 * Large independent music library
 */
export class SoundCloudService {
  private baseUrl = 'https://api-v2.soundcloud.com';
  private clientId = 'your_client_id_here';

  async searchTrack(artist: string, track: string) {
    const query = encodeURIComponent(`${artist} ${track}`);

    const response = await fetch(
      `${this.baseUrl}/search/tracks?q=${query}&client_id=${this.clientId}&limit=1`
    );

    return await response.json();
  }
}

/**
 * Recommendation for Karaoke Pro:
 *
 * FREE OPTIONS:
 * 1. Last.fm API + Deezer API (preview URLs)
 *    - Unlimited music data (Last.fm)
 *    - Free 30-sec previews (Deezer)
 *    - No authentication needed
 *    - Legal and stable
 *
 * PREMIUM OPTIONS:
 * 1. Last.fm API + Spotify API
 *    - Unlimited music data (Last.fm)
 *    - Official Spotify API
 *    - 30-sec previews or full songs (with premium)
 *    - Requires authentication
 *
 * 2. Last.fm API + Apple Music
 *    - Best audio quality
 *    - Official APIs
 *    - Requires subscription
 */

export const spotifyService = new SpotifyService();
export const deezerService = new DeezerService();
export const soundcloudService = new SoundCloudService();
