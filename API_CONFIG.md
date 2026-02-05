# API Configuration

## Last.fm API Setup

### Step 1: Create Last.fm Account
1. Visit https://www.last.fm
2. Sign up for a free account
3. Go to https://www.last.fm/api
4. Click "Create an API account"

### Step 2: Get API Key
1. Fill in the application details:
   - Application name: "Karaoke Pro"
   - Application type: "Desktop"
   - Commercial: No
2. Accept terms and submit
3. Copy your **API Key**

### Step 3: Update Configuration
Edit `lib/music-api-service.ts`:

```typescript
const LASTFM_API_KEY = 'your_api_key_here';
```

## Genius API Setup (Optional, for lyrics)

### Step 1: Create Genius Account
1. Visit https://genius.com
2. Sign up or login
3. Go to https://genius.com/api-clients
4. Create a new API Client

### Step 2: Generate Access Token
1. Fill in the client details
2. Click "Create API Client"
3. Copy your **Access Token**

### Step 3: Update Configuration
Edit `lib/music-api-service.ts`:

```typescript
const GENIUS_ACCESS_TOKEN = 'your_token_here';
```

## MusicBrainz API Setup (No Auth Required)

MusicBrainz is completely free and doesn't require authentication.
Just ensure you add a User-Agent header in requests:

```typescript
headers: { 'User-Agent': 'KaraokePro/1.0' }
```

This is already configured in `lib/music-api-service.ts`.

## API Rate Limits

| API | Limit | Notes |
|-----|-------|-------|
| Last.fm | 200 req/sec | Free tier, very generous |
| Genius | 60 req/min | Free tier, reasonable |
| MusicBrainz | Depends on backend | Usually 1 req/sec |

## Testing APIs

### Test Last.fm
```bash
curl "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=The%20Weeknd&track=Blinding%20Lights&api_key=YOUR_KEY&format=json"
```

### Test Genius
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.genius.com/search?q=Blinding%20Lights"
```

### Test MusicBrainz
```bash
curl -H "User-Agent: KaraokePro/1.0" \
  "https://musicbrainz.org/api/artist?query=The%20Weeknd&fmt=json"
```

## Troubleshooting

### "API key is invalid"
- Check you copied the key correctly
- Make sure there are no extra spaces
- Verify at https://www.last.fm/api/account/gettoken

### "No search results"
- Try simpler queries (just artist name or track title)
- Check spelling
- Use different artists/songs

### "Rate limit exceeded"
- Wait a few seconds before retrying
- Implement caching to reduce API calls
- Use exponential backoff in your request logic

## Security Notes

⚠️ **Important**: API keys should be stored in environment variables, not hardcoded!

Create a `.env.local` file:

```env
EXPO_PUBLIC_LASTFM_KEY=your_key_here
EXPO_PUBLIC_GENIUS_TOKEN=your_token_here
```

Then update `lib/music-api-service.ts`:

```typescript
const LASTFM_API_KEY = process.env.EXPO_PUBLIC_LASTFM_KEY || '';
const GENIUS_ACCESS_TOKEN = process.env.EXPO_PUBLIC_GENIUS_TOKEN || '';
```

---

**For production deployments, use proper secret management (Vercel Secrets, AWS Secrets Manager, etc.)**
