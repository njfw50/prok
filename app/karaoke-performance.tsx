import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useKaraoke } from '@/lib/karaoke-context';
import { getSongById } from '@/lib/mock-songs';
import { Song, PlaybackState } from '@/lib/types';

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

  if (!song) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Song not found</Text>
      </ScreenContainer>
    );
  }

  const progress = (currentTime / (song.duration * 1000)) * 100;

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 flex-col">
        {/* Header */}
        <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="arrow-back" size={28} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-semibold text-foreground">Now Singing</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="close" size={28} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Song Info */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Text className="text-2xl font-bold text-foreground">{song.title}</Text>
          <Text className="text-lg text-muted mt-1">{song.artist}</Text>
        </View>

        {/* Lyrics Display */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View className="items-center">
            {song.lyrics.map((lyric, index) => (
              <Text
                key={index}
                className={`text-2xl font-semibold text-center mb-4 leading-relaxed ${
                  index === currentLyricIndex
                    ? 'text-primary'
                    : index < currentLyricIndex
                    ? 'text-muted'
                    : 'text-muted'
                }`}
                style={{
                  fontSize: index === currentLyricIndex ? 28 : 20,
                  color:
                    index === currentLyricIndex
                      ? colors.primary
                      : colors.muted,
                  opacity: index === currentLyricIndex ? 1 : 0.6,
                }}
              >
                {lyric.text}
              </Text>
            ))}
          </View>
        </ScrollView>

        {/* Controls Section */}
        <View
          className="px-4 py-4 border-t"
          style={{ borderTopColor: colors.border }}
        >
          {/* Progress Bar */}
          <View className="mb-4">
            <View
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.border }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  width: `${progress}%`,
                }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-muted">
                {formatTime(currentTime)}
              </Text>
              <Text className="text-xs text-muted">
                {formatTime(song.duration * 1000)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View className="flex-row items-center justify-center gap-6 mb-6">
            <Pressable
              onPress={() => handleSkip(-10000)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialIcons name="replay-10" size={32} color={colors.foreground} />
            </Pressable>

            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                },
              ]}
              className="w-16 h-16 rounded-full items-center justify-center"
            >
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={40}
                color={colors.background}
              />
            </Pressable>

            <Pressable
              onPress={() => handleSkip(10000)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialIcons name="forward-10" size={32} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Volume Control */}
          <View className="flex-row items-center gap-3 mb-4">
            <MaterialIcons name="volume-down" size={20} color={colors.muted} />
            <View
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.border }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  width: `${volume}%`,
                }}
              />
            </View>
            <MaterialIcons name="volume-up" size={20} color={colors.muted} />
            <Text className="text-xs text-muted w-6 text-right">{volume}</Text>
          </View>

          {/* Status Indicator */}
          <View className="flex-row items-center justify-center gap-2 py-3">
            <View
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isPlaying ? colors.success : colors.muted,
              }}
            />
            <Text className="text-sm text-muted">
              {isPlaying ? 'Now Playing' : 'Paused'}
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
