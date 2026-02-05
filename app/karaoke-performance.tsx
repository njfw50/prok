import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

import { useKaraoke } from '@/lib/karaoke-context';
import { getSongById } from '@/lib/mock-songs';
import { Song } from '@/lib/types';
import { LyricsLine } from '@/components/lyrics-line';
import { PerformanceMetricsDisplay } from '@/components/performance-metrics';
import { KaraokeAudioEngine } from '@/lib/audio-engine';
import { KaraokeScoringSystem } from '@/lib/scoring-system';

export default function KaraokePerformanceScreen() {
  const router = useRouter();
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    score: 88,
    accuracy: 85,
    rhythm: 92,
    rating: 'Great' as const,
  });
  
  const audioEngineRef = useRef<KaraokeAudioEngine | null>(null);
  const scoringSystemRef = useRef<KaraokeScoringSystem | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (songId) {
      const foundSong = getSongById(songId);
      setSong(foundSong || null);

      if (!audioEngineRef.current) {
        audioEngineRef.current = new KaraokeAudioEngine();
        audioEngineRef.current.initialize();
      }

      if (!scoringSystemRef.current) {
        scoringSystemRef.current = new KaraokeScoringSystem();
      }

      if (foundSong) {
        scoringSystemRef.current.initialize(foundSong);
      }
    }

    return () => {
      if (isPlaying) {
        handlePlayPause();
      }
    };
  }, [songId]);

  useEffect(() => {
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
            handlePlayPause();
            setShowMetrics(true);
            return maxTime;
          }
          return prev + 100;
        });
      }, 100);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isPlaying, song]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, currentTime + seconds * 1000);
    const maxTime = song ? song.duration * 1000 : 0;
    setCurrentTime(Math.min(newTime, maxTime));
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!song) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-white">Song not found</Text>
      </View>
    );
  }

  const progress = (currentTime / (song.duration * 1000)) * 100;

  return (
    <View className="flex-1" style={{ backgroundColor: '#0a0e27' }}>
      {/* Animated Background */}
      <View className="absolute inset-0">
        <View className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{
          backgroundColor: 'rgba(124, 58, 237, 0.15)',
        }} />
        <View className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
        }} />
      </View>

      {showMetrics ? (
        <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <View className="w-full rounded-3xl p-8" style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderWidth: 1,
            borderColor: 'rgba(124, 58, 237, 0.3)',
          }}>
            <Text className="text-white text-3xl font-bold text-center mb-6">Performance Review</Text>
            <PerformanceMetricsDisplay metrics={metrics} />
            
            <View className="flex-row gap-3 mt-8">
              <Pressable
                onPress={() => router.back()}
                className="flex-1 py-4 rounded-xl items-center justify-center"
                style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}
              >
                <Text className="text-white font-bold text-lg">Home</Text>
              </Pressable>
              <Pressable
                onPress={() => { setShowMetrics(false); setCurrentTime(0); setIsPlaying(false); }}
                className="flex-1 py-4 rounded-xl items-center justify-center"
                style={{ backgroundColor: '#7c3aed' }}
              >
                <Text className="text-white font-bold text-lg">Retry</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-6 pb-4 z-10">
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Text className="text-white text-xl font-bold tracking-wider">KARAOKE</Text>
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Main Performance Area */}
          <View className="flex-1 flex-col justify-center items-center px-4 z-10">
            {/* Album Art with Glow Effect */}
            <View className="relative mb-8">
              <View
                className="w-56 h-56 rounded-3xl absolute -inset-6"
                style={{
                  backgroundColor: 'rgba(124, 58, 237, 0.25)',
                  borderRadius: 48,
                }}
              />
              <View
                className="w-56 h-56 rounded-3xl overflow-hidden items-center justify-center border-4"
                style={{
                  borderColor: 'rgba(124, 58, 237, 0.5)',
                  backgroundColor: '#4c1d95',
                }}
              >
                <MaterialIcons name="music-note" size={120} color="rgba(255, 255, 255, 0.2)" />
              </View>
            </View>

            {/* Song Title & Artist */}
            <Text className="text-4xl font-bold text-white text-center mb-3">
              {song.title}
            </Text>
            <Text className="text-lg text-purple-200 text-center mb-12 font-semibold">
              by {song.artist}
            </Text>

            {/* Lyrics Display */}
            <ScrollView
              ref={scrollViewRef}
              className="w-full flex-1 mb-8"
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              <View className="items-center py-6">
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

          {/* Control Panel - Glassmorphic Bottom Sheet */}
          <View
            className="px-6 py-6 rounded-t-3xl"
            style={{
              backgroundColor: 'rgba(10, 14, 39, 0.92)',
              borderTopWidth: 1,
              borderTopColor: 'rgba(124, 58, 237, 0.25)',
            }}
          >
            {/* Progress Bar */}
            <View className="mb-6">
              <View
                className="h-2 rounded-full overflow-hidden mb-3"
                style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: '#a78bfa',
                    width: `${progress}%`,
                  }}
                />
              </View>
              <View className="flex-row justify-between px-1">
                <Text className="text-xs text-gray-500 font-semibold">{formatTime(currentTime)}</Text>
                <Text className="text-xs text-gray-500 font-semibold">{formatTime(song.duration * 1000)}</Text>
              </View>
            </View>

            {/* Control Buttons */}
            <View className="flex-row items-center justify-center gap-8 mb-8">
              <Pressable
                onPress={() => handleSkip(-15)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1 },
                  { backgroundColor: 'rgba(124, 58, 237, 0.1)' }
                ]}
                className="w-14 h-14 rounded-full items-center justify-center"
              >
                <MaterialIcons name="replay-5" size={28} color="#c4b5fd" />
              </Pressable>

              <Pressable
                onPress={handlePlayPause}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1 },
                  {
                    backgroundColor: isPlaying ? '#7c3aed' : '#8b5cf6',
                    shadowColor: '#7c3aed',
                    shadowOpacity: 0.7,
                    shadowRadius: 20,
                    elevation: 10,
                  }
                ]}
                className="w-28 h-28 rounded-full items-center justify-center"
              >
                <MaterialIcons
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  size={60}
                  color="#fff"
                />
              </Pressable>

              <Pressable
                onPress={() => handleSkip(15)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1 },
                  { backgroundColor: 'rgba(124, 58, 237, 0.1)' }
                ]}
                className="w-14 h-14 rounded-full items-center justify-center"
              >
                <MaterialIcons name="forward-5" size={28} color="#c4b5fd" />
              </Pressable>
            </View>

            {/* Volume Control */}
            <View className="flex-row items-center gap-3 mb-5">
              <MaterialIcons name="volume-down" size={18} color="#9ca3af" />
              <View
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: '#10b981',
                    width: `${volume}%`,
                  }}
                />
              </View>
              <MaterialIcons name="volume-up" size={18} color="#9ca3af" />
            </View>

            {/* Status & Settings */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: isPlaying ? '#10b981' : '#6b7280',
                  }}
                />
                <Text className="text-sm text-gray-400">
                  {isPlaying ? '▶ Now Singing' : '⏸ Paused'}
                </Text>
              </View>
              <View className="flex-row gap-3">
                <Pressable className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                  <MaterialIcons name="settings" size={20} color="#c4b5fd" />
                </Pressable>
                <Pressable className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                  <MaterialIcons name="favorite-border" size={20} color="#c4b5fd" />
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
