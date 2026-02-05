# Karaoke Pro - Complete Redesign 🎤

## Overview
Complete redesign of the Karaoke Pro app with **real music APIs** integration and a **completely new visual design** (Blue + Orange theme).

### What Changed

#### 🎨 Visual Design
- **Old**: Dark glassmorphism theme (Purple/Magenta on dark navy)
- **New**: Modern minimal design (Blue #1e40af + Orange #ea580c on white)
- **Layout**: Card-based, light theme, clean typography
- **Components**: Rewritten from scratch with new color palette

#### 🎵 Data Source
- **Old**: Mock songs with hardcoded data (9 songs)
- **New**: **Real music data from Last.fm API** (unlimited songs)
- All songs pulled live from the Last.fm database
- Real album covers, artist information, duration

#### 🔌 APIs Integrated

##### Last.fm API (Free)
- Get song information: title, artist, album, duration, cover art
- Search for tracks and artists
- Get top tracks by artist
- Get trending/chart music
- **No authentication required** for basic usage
- **Rate limit**: 200 requests/second (very generous)

```typescript
// Example usage
const track = await lastfmService.searchTrack('The Weeknd', 'Blinding Lights');
// Returns: TrackData with title, artist, album, imageUrl, duration, url
```

##### Genius API (Free with API Key)
- Get song lyrics with metadata
- Search for songs and artists
- Access to massive lyrics database
- **Requires free API key** (register at genius.com/api-clients)

```typescript
// Example usage
const lyrics = await geniusService.searchLyrics('The Weeknd', 'Blinding Lights');
```

##### MusicBrainz API (100% Free)
- Completely open database of music metadata
- Search for artists and recordings
- No authentication required
- Perfect for offline fallback

### New Features

#### Real-Time Song Search
```typescript
// From the home screen, search for any song
// API automatically fetches from Last.fm
const songs = await lastfmService.getArtistTopTracks('Taylor Swift');
```

#### Popular Artists Grid
Browse and select from popular artists:
- The Weeknd
- Ariana Grande
- Post Malone
- Drake
- Taylor Swift
- Ed Sheeran

#### Dynamic Song Grid
- 2-column grid layout with album art
- Real song covers from Last.fm
- Tap to perform karaoke on any song

### File Structure

```
lib/
  music-api-service.ts    <- New! Last.fm, Genius, MusicBrainz API clients
  audio-engine.ts         <- Web Audio API processing (unchanged)
  scoring-system.ts       <- Performance evaluation (unchanged)

hooks/
  use-real-songs.ts       <- New! Hooks for fetching real music data
  use-real-songs.ts       <- useRealSongs(), useSearchSong()

components/
  song-list.tsx           <- New! Real song list components
  performance-metrics.tsx <- Performance display (updated)

app/
  (tabs)/index.tsx        <- Home screen (redesigned)
  karaoke-performance.tsx <- Karaoke screen (redesigned)
```

### How to Use the APIs

#### Setup Last.fm API (Required)
1. Go to https://www.last.fm/api
2. Register/login with your account
3. Create an API account
4. Get your API Key
5. Update `lib/music-api-service.ts`:

```typescript
const LASTFM_API_KEY = 'your_api_key_here';
```

#### Setup Genius API (Optional, for lyrics)
1. Go to https://genius.com/api-clients
2. Create a new API Client
3. Generate an access token
4. Update `lib/music-api-service.ts`:

```typescript
const GENIUS_ACCESS_TOKEN = 'your_token_here';
```

### New Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary Button | Blue | #1e40af |
| Accent Button | Orange | #ea580c |
| Background | White | #ffffff |
| Text Primary | Gray-800 | #1f2937 |
| Text Secondary | Gray-600 | #4b5563 |
| Border | Gray-200 | #e5e7eb |
| Success | Green | #16a34a |

### Components Redesigned

#### Home Screen (`app/(tabs)/index.tsx`)
- **Header**: Blue gradient background
- **Search**: Clean input with icon
- **Artists Grid**: Tap to explore artist's top tracks
- **Popular Songs**: Card-based grid with album art
- **Real-time data**: All data fetched from Last.fm

#### Karaoke Performance (`app/karaoke-performance.tsx`)
- **Album Art**: Large display with fallback gradient
- **Song Info**: Card with title, artist, album
- **Progress Bar**: Orange progress indicator
- **Controls**: Play, Skip ±15s buttons
- **Stats**: Accuracy, Rating, Status displays
- **EQ**: Visual frequency bars (Bass/Mid/Treble)
- **Volume**: Slider control

#### Song List Component (`components/song-list.tsx`)
- **Grid View**: 2-column responsive layout
- **Card Design**: Album art + metadata
- **Real Images**: From Last.fm API
- **Quick Play**: Tap to start karaoke

### API Response Types

```typescript
interface TrackData {
  title: string;      // Song title
  artist: string;     // Artist name
  album: string;      // Album name
  imageUrl: string;   // Album cover URL
  duration: number;   // Duration in seconds
  url: string;        // Link to Last.fm page
}
```

### Performance

- **Fast**: API responses cached locally
- **Lightweight**: Only loads necessary data
- **Reliable**: Fallback to MusicBrainz if Last.fm is down
- **Rate Limited**: Respects API limits (200 req/sec Last.fm)

### Future Enhancements

1. **Lyrics Sync**: Integrate Genius API for time-coded lyrics
2. **Audio Playback**: Connect real audio files (YouTube Music API, Spotify)
3. **User Profiles**: Save favorites and performance history
4. **Multiplayer**: Real-time duets via WebSocket (infrastructure ready)
5. **Leaderboards**: Track high scores globally

### Technology Stack

- **Frontend**: React Native + Expo 54.0.29
- **Styling**: NativeWind + Tailwind CSS
- **Audio**: Web Audio API with EQ processing
- **APIs**: Last.fm (free tier), Genius (free tier), MusicBrainz (free)
- **State**: React Hooks (useRealSongs, useSearchSong)
- **Routing**: Expo Router

### Development

```bash
# Install dependencies
pnpm install

# Type check
pnpm check

# Run on device
pnpm start

# Build for production
pnpm build
```

### Known Limitations

- Genius API requires manual setup (register for free API key)
- Song lyrics still need to be implemented
- Audio playback requires integration with music streaming service
- Offline mode not yet implemented

### Commit Hash
- `b22b0ce`: Complete redesign with real APIs - Blue/Orange theme + Last.fm integration

---

**Built with ❤️ using real, free music APIs**
