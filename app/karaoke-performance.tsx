import { View, Text, Pressable, ScrollView, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useKaraoke } from '@/lib/karaoke-context';
import { getSongById } from '@/lib/mock-songs';
import { Song, PlaybackState } from '@/lib/types';
import { LyricsLine } from '@/components/lyrics-line';
import { PlaybackControls } from '@/components/playback-controls';

export default function KaraokePerformanceScreen() {
  const router = useRouter();
  const colors = useColors();
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const { updatePlaybackState } = useKaraoke();
  const [song, setSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [volume, setVolume] = useState(80);
  const scrollViewRef = useRef<ScrollView>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (songId) {
      const foundSong = getSongById(songId);
      setSong(foundSong || null);
    }

    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [songId]);

  useEffect(() => {
    // Update current lyric based on time
    if (song) {
      const nextIndex = song.lyrics.findIndex(
        (lyric) => lyric.timestamp > currentTime
      );
      setCurrentLyricIndex(nextIndex > 0 ? nextIndex - 1 : 0);
    }
  }, [currentTime, song]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && song) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const maxTime = song.duration * 1000;
          if (prev >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return prev + 100; // Advance 100ms every 100ms
        });
      }, 100);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isPlaying, song]);

  const handlePlayPause = () => {
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new (window as any).Audio();
      if (song?.audioUrl && audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.volume = volume / 100;
      }
    }

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioRef.current && song?.audioUrl) {
        try {
          audioRef.current.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
      setIsPlaying(true);
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, currentTime + seconds);
    const maxTime = song ? song.duration * 1000 : 0;
    setCurrentTime(Math.min(newTime, maxTime));
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const { height, width } = Dimensions.get('window');

  if (!song) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Song not found</Text>
      </ScreenContainer>
    );
  }

  const progress = (currentTime / (song.duration * 1000)) * 100;

  return (
    <View className="flex-1" style={{ backgroundColor: '#0f172a' }}>
      {/* Background Gradient Overlay */}
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
        }}
      />

      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between z-10">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          className="w-10 h-10 rounded-full items-center justify-center bg-white/10"
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text className="text-lg font-bold text-white">KARAOKE</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          className="w-10 h-10 rounded-full items-center justify-center bg-white/10"
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className="flex-1 flex-col justify-center items-center px-4 pb-32">
        {/* Song Image / Visual */}
        <View
          className="w-48 h-48 rounded-3xl mb-8 shadow-2xl overflow-hidden items-center justify-center"
          style={{
            backgroundColor: '#7c3aed',
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {song.imageUrl ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#5b21b6',
              }}
            />
          ) : (
            <MaterialIcons name="music-note" size={80} color="rgba(255, 255, 255, 0.5)" />
          )}
        </View>

        {/* Song Title & Artist */}
        <Text className="text-3xl font-bold text-white text-center mb-2">
          {song.title}
        </Text>
        <Text className="text-lg text-purple-300 text-center mb-8">
          {song.artist}
        </Text>

        {/* Lyrics Display - Scrollable */}
        <ScrollView
          ref={scrollViewRef}
          className="w-full flex-1 mb-6"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View className="items-center py-4">
            {song.lyrics.map((lyric, index) => (
              <LyricsLine
                key={index}
                text={lyric.text}
                isActive={index === currentLyricIndex}
                isSung={index < currentLyricIndex}
                index={index}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Control Panel */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-6"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(124, 58, 237, 0.3)',
        }}
      >
        {/* Progress Bar */}
        <View className="mb-6">
          <View
            className="h-1.5 rounded-full overflow-hidden mb-3"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: '#7c3aed',
                width: `${progress}%`,
              }}
            />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-400">{formatTime(currentTime)}</Text>
            <Text className="text-xs text-gray-400">{formatTime(song.duration * 1000)}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View className="flex-row items-center justify-center gap-8 mb-6">
          <Pressable
            onPress={() => handleSkip(-10000)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            className="w-12 h-12 rounded-full items-center justify-center bg-white/10"
          >
            <MaterialIcons name="replay-10" size={28} color="#fff" />
          </Pressable>

          <Pressable
            onPress={handlePlayPause}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                backgroundColor: isPlaying ? '#7c3aed' : '#8b5cf6',
                shadowColor: '#7c3aed',
                shadowOpacity: 0.5,
                shadowRadius: 10,
              },
            ]}
            className="w-20 h-20 rounded-full items-center justify-center"
          >
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={48}
              color="#fff"
            />
          </Pressable>

          <Pressable
            onPress={() => handleSkip(10000)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            className="w-12 h-12 rounded-full items-center justify-center bg-white/10"
          >
            <MaterialIcons name="forward-10" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* Volume Control */}
        <View className="flex-row items-center gap-3 mb-4">
          <MaterialIcons name="volume-down" size={20} color="#9ca3af" />
          <View
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: '#10b981',
                width: `${volume}%`,
              }}
            />
          </View>
          <MaterialIcons name="volume-up" size={20} color="#9ca3af" />
        </View>

        {/* Status */}
        <View className="flex-row items-center justify-center gap-2">
          <View
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isPlaying ? '#10b981' : '#6b7280',
            }}
          />
          <Text className="text-sm text-gray-400">
            {isPlaying ? '▶ Now Playing' : '⏸ Paused'}
          </Text>
        </View>
      </View>
    </View>
  );
}
