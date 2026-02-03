# Karaoke Pro - Design Document

## Overview
Karaoke Pro is a mobile karaoke application that allows users to browse a library of songs, view synchronized lyrics, and perform karaoke with high-quality audio backing tracks.

---

## Screen List

### 1. **Splash/Loading Screen**
- App logo and branding
- Loading indicator
- Smooth transition to Home screen

### 2. **Home Screen (Browse Songs)**
- Search bar at top
- Featured/Popular songs carousel
- Categories section (Pop, Rock, Hip-Hop, R&B, etc.)
- Recently played songs
- Trending songs list
- Bottom tab navigation

### 3. **Song Detail Screen**
- Large album artwork
- Song title and artist
- Duration and difficulty level
- "Start Singing" button (primary action)
- Song description/lyrics preview
- Add to Favorites button
- Share button

### 4. **Karaoke Performance Screen**
- Full-screen lyrics display with current line highlighting
- Progress bar showing song position
- Volume control slider
- Pitch indicator (visual feedback)
- Pause/Resume buttons
- Skip forward/backward buttons
- Mic icon indicator
- Background instrumental audio playing

### 5. **Favorites Screen**
- List of saved favorite songs
- Quick play button for each
- Remove from favorites option
- Empty state message if no favorites

### 6. **Search Results Screen**
- Search query display
- Filtered song results
- Sort/filter options (by artist, duration, difficulty)

### 7. **Settings Screen**
- Audio preferences (volume, echo effect toggle)
- Display preferences (lyrics size, theme)
- About app section
- Clear cache option

---

## Primary Content and Functionality

### Home Screen
- **Content**: Song cards with thumbnail, title, artist, duration
- **Functionality**: 
  - Search songs by title/artist
  - Browse by category
  - View recently played
  - Tap to navigate to Song Detail

### Song Detail Screen
- **Content**: Full song information, lyrics preview, difficulty rating
- **Functionality**:
  - Play karaoke (navigate to Performance Screen)
  - Add/remove from favorites
  - Share song link
  - View full lyrics

### Karaoke Performance Screen
- **Content**: Large synchronized lyrics, progress bar, controls
- **Functionality**:
  - Play/pause audio
  - Skip forward/backward (5-10 seconds)
  - Adjust volume
  - Visual pitch feedback
  - Auto-scroll lyrics with current line highlight
  - Recording indicator (optional)

### Favorites Screen
- **Content**: Grid/list of favorite songs
- **Functionality**:
  - Quick play from favorites
  - Remove from favorites
  - Search within favorites

---

## Key User Flows

### Flow 1: Browse and Play a Song
1. User opens app → **Home Screen**
2. User scrolls through categories or uses search bar
3. User taps a song → **Song Detail Screen**
4. User taps "Start Singing" → **Karaoke Performance Screen**
5. Lyrics display with synchronized audio
6. User can pause, skip, or adjust volume
7. Song ends → Return to **Home Screen** or **Song Detail Screen**

### Flow 2: Save and Play Favorite
1. User on **Song Detail Screen**
2. User taps heart icon to add to favorites
3. User navigates to **Favorites Screen** via tab bar
4. User taps favorite song → **Song Detail Screen** → **Karaoke Performance Screen**

### Flow 3: Search for a Song
1. User on **Home Screen**
2. User taps search bar
3. User types song title or artist name
4. Results appear in **Search Results Screen**
5. User taps result → **Song Detail Screen**

---

## Color Choices

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| **Primary** | Vibrant Purple | #7C3AED | Buttons, highlights, accents |
| **Secondary** | Electric Blue | #0EA5E9 | Links, secondary actions |
| **Background** | Deep Dark | #0F172A | Main app background |
| **Surface** | Dark Slate | #1E293B | Cards, panels, surfaces |
| **Foreground** | White | #FFFFFF | Primary text |
| **Muted** | Gray | #94A3B8 | Secondary text, hints |
| **Success** | Green | #10B981 | Success states, favorites |
| **Warning** | Amber | #F59E0B | Warnings, alerts |
| **Error** | Red | #EF4444 | Errors, delete actions |

---

## Design Principles

1. **Mobile-First**: All layouts optimized for portrait orientation (9:16)
2. **One-Handed Usage**: Critical buttons positioned in thumb-reachable zones
3. **iOS HIG Compliance**: Follows Apple Human Interface Guidelines
4. **Dark Theme**: Premium feel with dark background and vibrant accents
5. **Accessibility**: Large touch targets (minimum 44pt), high contrast text
6. **Performance**: Smooth animations, lazy-loaded images, efficient audio streaming

---

## Technical Considerations

- **Audio Playback**: Use expo-audio for high-quality backing track playback
- **Lyrics Sync**: Timestamp-based lyrics display with smooth scrolling
- **Local Storage**: Cache favorite songs and recently played using AsyncStorage
- **Responsive Layout**: Adapt to different screen sizes and notches
- **Performance**: Optimize image loading with expo-image
