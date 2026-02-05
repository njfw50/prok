/**
 * Karaoke Performance - New Modern Design
 * Cores: Azul (#1e40af) + Laranja (#ea580c) + Branco limpo
 * Design: Minimal, card-based, light theme com Real API
 */

import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KaraokeAudioEngine } from '@/lib/audio-engine';
import { KaraokeScoringSystem } from '@/lib/scoring-system';
import { lastfmService, type TrackData } from '@/lib/music-api-service';

const engine = KaraokeAudioEngine.getInstance();
const scorer = KaraokeScoringSystem.getInstance();

interface PerformanceState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  score: number;
  rating: 'Perfect' | 'Great' | 'Good' | 'Fair' | 'Poor' | null;
  trackData: TrackData | null;
  loading: boolean;
}

export default function KaraokePerformanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ artist?: string; track?: string }>();
  const [state, setState] = useState<PerformanceState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    score: 0,
    rating: null,
    trackData: null,
    loading: true,
  });

  // Buscar dados reais da música via API
  useEffect(() => {
    const loadTrack = async () => {
      try {
        if (!params.artist || !params.track) {
          console.warn('Missing artist or track parameters');
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const trackData = await lastfmService.searchTrack(
          String(params.artist),
          String(params.track)
        );
        
        if (trackData) {
          setState((prev) => ({
            ...prev,
            trackData,
            duration: trackData.duration || 0,
            loading: false,
          }));
        } else {
          setState((prev) => ({ 
            ...prev, 
            loading: false,
            trackData: null,
          }));
        }
      } catch (error) {
        console.error('Error loading track:', error instanceof Error ? error.message : String(error));
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadTrack();
  }, [params.artist, params.track]);

  // Atualizar tempo de reprodução
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isPlaying) {
        const currentTime = engine.getCurrentTime();
        setState((prev) => ({ ...prev, currentTime }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.isPlaying]);

  const togglePlay = async () => {
    try {
      if (state.isPlaying) {
        if (typeof engine.pause === 'function') {
          engine.pause();
        }
      } else {
        if (state.trackData && typeof engine.play === 'function') {
          engine.play();
        } else {
          console.warn('No track data or engine not available');
          return;
        }
      }
      setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    } catch (error) {
      console.error('Playback error:', error instanceof Error ? error.message : String(error));
    }
  };

  const skipForward = () => {
    try {
      if (!state.duration || state.duration === 0) return;
      const newTime = Math.min(state.currentTime + 15, state.duration);
      if (typeof engine.seek === 'function') {
        engine.seek(newTime);
      }
      setState((prev) => ({ ...prev, currentTime: newTime }));
    } catch (error) {
      console.error('Skip error:', error);
    }
  };

  const skipBackward = () => {
    try {
      if (!state.duration || state.duration === 0) return;
      const newTime = Math.max(state.currentTime - 15, 0);
      if (typeof engine.seek === 'function') {
        engine.seek(newTime);
      }
      setState((prev) => ({ ...prev, currentTime: newTime }));
    } catch (error) {
      console.error('Skip error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    try {
      if (!seconds || isNaN(seconds)) return '0:00';
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Format time error:', error);
      return '0:00';
    }
  };

  const progressPercent =
    state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header - Novo design azul */}
      <View className="bg-blue-600 px-4 py-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
        >
          <Text className="text-white text-lg">← Voltar</Text>
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Karaoke Pro</Text>
        <Text className="text-blue-100 mt-1 text-sm">
          🎵 Real Music API Integration
        </Text>
      </View>

      {/* Loading State */}
      {state.loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-gray-600 text-lg">🎵 Carregando música...</Text>
        </View>
      ) : (
        <>
          {/* Album Art Card - Gradiente azul/laranja */}
          <View className="px-4 py-6">
            <View className="rounded-2xl overflow-hidden shadow-lg">
              {state.trackData?.imageUrl ? (
                <Image
                  source={{ uri: state.trackData.imageUrl }}
                  className="w-full aspect-square"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full aspect-square bg-gradient-to-br from-blue-400 via-blue-500 to-orange-500 flex items-center justify-center">
                  <Text className="text-white text-6xl">🎵</Text>
                </View>
              )}
            </View>
          </View>

          {/* Song Info Card - Design minimalista */}
          <View className="px-4 py-4">
            <View className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-5 border border-blue-100">
              <Text className="text-blue-700 font-bold text-lg leading-tight">
                {state.trackData?.title || 'Unknown Track'}
              </Text>
              <Text className="text-gray-700 mt-2 font-semibold">
                {state.trackData?.artist || 'Unknown Artist'}
              </Text>
              <Text className="text-gray-500 text-sm mt-2">
                💿 {state.trackData?.album || 'Unknown Album'}
              </Text>
            </View>
          </View>

          {/* Progress Bar - Laranja */}
          <View className="px-4 py-6">
            <View className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <View
                className="bg-orange-500 h-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-3">
              <Text className="text-gray-600 text-xs font-semibold">
                {formatTime(state.currentTime)}
              </Text>
              <Text className="text-gray-600 text-xs font-semibold">
                {formatTime(state.duration)}
              </Text>
            </View>
          </View>

          {/* Playback Controls - Novo estilo */}
          <View className="px-4 py-6 flex-row items-center justify-center gap-6">
            {/* Skip Back */}
            <TouchableOpacity
              onPress={skipBackward}
              className="bg-blue-100 active:bg-blue-200 p-4 rounded-full transition-colors"
            >
              <Text className="text-blue-600 text-2xl font-bold">⏮</Text>
            </TouchableOpacity>

            {/* Play Button - Destaque principal */}
            <TouchableOpacity
              onPress={togglePlay}
              className={`${
                state.isPlaying ? 'bg-orange-600 scale-95' : 'bg-orange-500'
              } p-8 rounded-full shadow-xl active:shadow-lg transition-all`}
            >
              <Text className="text-white text-5xl leading-none">
                {state.isPlaying ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>

            {/* Skip Forward */}
            <TouchableOpacity
              onPress={skipForward}
              className="bg-blue-100 active:bg-blue-200 p-4 rounded-full transition-colors"
            >
              <Text className="text-blue-600 text-2xl font-bold">⏭</Text>
            </TouchableOpacity>
          </View>

          {/* Performance Stats - Card minimalista */}
          <View className="px-4 py-4">
            <View className="bg-white rounded-xl border border-gray-200 p-5">
              <Text className="text-gray-800 font-bold mb-4 text-base">
                📊 Estatísticas
              </Text>

              <View className="space-y-3">
                {/* Accuracy */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 text-sm font-medium">
                    Precisão
                  </Text>
                  <View className="bg-blue-100 px-3 py-1 rounded-lg">
                    <Text className="text-blue-700 font-bold">{state.score}%</Text>
                  </View>
                </View>

                {/* Rating */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 text-sm font-medium">
                    Avaliação
                  </Text>
                  <View className="bg-orange-100 px-3 py-1 rounded-lg">
                    <Text className="text-orange-700 font-bold">
                      {state.rating || '—'}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 text-sm font-medium">
                    Status
                  </Text>
                  <View
                    className={`${
                      state.isPlaying ? 'bg-green-100' : 'bg-gray-100'
                    } px-3 py-1 rounded-lg`}
                  >
                    <Text
                      className={`font-bold ${
                        state.isPlaying ? 'text-green-700' : 'text-gray-700'
                      }`}
                    >
                      {state.isPlaying ? '🎤 Ao Vivo' : '⏸ Pausado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Volume Control - Azul */}
          <View className="px-4 py-4">
            <View className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <Text className="text-blue-700 font-bold mb-3 text-sm">
                🔊 Volume
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-gray-600 text-lg">🔇</Text>
                <View className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden">
                  <View className="bg-blue-600 h-full rounded-full w-1/2" />
                </View>
                <Text className="text-gray-600 text-lg">🔊</Text>
              </View>
            </View>
          </View>

          {/* EQ Controls - Laranja */}
          <View className="px-4 py-4">
            <View className="bg-orange-50 rounded-xl border border-orange-100 p-4">
              <Text className="text-orange-700 font-bold mb-4 text-sm">
                🎚️ Equalizador
              </Text>
              <View className="flex-row justify-between items-end gap-3">
                {/* Bass */}
                <View className="flex-1 items-center">
                  <View className="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full mb-2" style={{ height: 40 }} />
                  <Text className="text-gray-600 text-xs font-medium">Bass</Text>
                </View>

                {/* Mid */}
                <View className="flex-1 items-center">
                  <View className="w-10 bg-gradient-to-t from-orange-600 to-orange-400 rounded-full mb-2" style={{ height: 60 }} />
                  <Text className="text-gray-600 text-xs font-medium">Mid</Text>
                </View>

                {/* Treble */}
                <View className="flex-1 items-center">
                  <View className="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full mb-2" style={{ height: 45 }} />
                  <Text className="text-gray-600 text-xs font-medium">Treble</Text>
                </View>
              </View>
            </View>
          </View>

          {/* API Info Footer */}
          <View className="px-4 py-6">
            <View className="bg-gray-100 rounded-xl p-4 border border-gray-300">
              <Text className="text-gray-700 text-xs">
                ✨ Dados de música fornecidos pela{' '}
                <Text className="font-bold">Last.fm API</Text> • Grátis e em Tempo Real
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View className="h-8" />
        </>
      )}
    </ScrollView>
  );
}
