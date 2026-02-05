/**
 * Componente de Lista de Músicas - Integrado com API Real
 * Design novo: Azul + Laranja, cards minimalistas
 * @component
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRealSongs, type Song } from '@/hooks/use-real-songs';

interface SongListProps {
  artist?: string;
  query?: string;
  limit?: number;
  onSelectSong?: (song: Song) => void;
}

/**
 * Componente que exibe lista de músicas da API
 */
export function RealSongList({
  artist,
  query,
  limit = 12,
  onSelectSong,
}: SongListProps) {
  const router = useRouter();
  const { songs, loading, error } = useRealSongs(query, artist, limit);

  const handleSelectSong = (song: Song) => {
    if (onSelectSong) {
      onSelectSong(song);
    } else {
      // Navegar para performance com parâmetros da API
      router.push({
        pathname: '/karaoke-performance',
        params: {
          artist: song.artist,
          track: song.title,
        },
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="text-gray-600 mt-2 text-sm">
          Carregando música reais...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Text className="text-red-600 font-semibold">Erro ao carregar</Text>
        <Text className="text-gray-600 text-sm mt-1">{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleSelectSong(item)}
          className="flex-1 rounded-lg overflow-hidden bg-white shadow-sm active:shadow-md transition-shadow"
        >
          {/* Imagem do Álbum */}
          <View className="bg-gradient-to-br from-blue-400 to-orange-400 aspect-square overflow-hidden">
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full flex items-center justify-center">
                <Text className="text-5xl">🎵</Text>
              </View>
            )}
          </View>

          {/* Info do Álbum */}
          <View className="p-3 bg-white">
            {/* Título */}
            <Text
              className="text-gray-800 font-bold text-sm leading-tight"
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {/* Artista */}
            <Text
              className="text-gray-600 text-xs mt-1"
              numberOfLines={1}
            >
              {item.artist}
            </Text>

            {/* Info adicional */}
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-gray-500 text-xs">
                {item.duration > 0
                  ? `${Math.floor(item.duration / 60)}:${String(
                      Math.floor(item.duration % 60)
                    ).padStart(2, '0')}`
                  : '--:--'}
              </Text>
              <View className="bg-blue-100 px-2 py-1 rounded">
                <Text className="text-blue-700 text-xs font-semibold">
                  SING
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      scrollEnabled={false}
    />
  );
}

/**
 * Card simples de uma música
 */
export function SongCard({ song, onPress }: { song: Song; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg overflow-hidden shadow-sm active:shadow-lg transition-shadow mb-3"
    >
      <View className="flex-row">
        {/* Imagem */}
        <View className="bg-gradient-to-br from-blue-400 to-orange-400 w-20 h-20">
          {song.imageUrl ? (
            <Image
              source={{ uri: song.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full flex items-center justify-center">
              <Text className="text-2xl">🎵</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 p-3">
          <Text className="text-gray-800 font-bold" numberOfLines={1}>
            {song.title}
          </Text>
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
            {song.artist}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            {song.album || 'Unknown Album'}
          </Text>
        </View>

        {/* Button */}
        <View className="justify-center px-3">
          <View className="bg-orange-500 px-3 py-2 rounded-lg">
            <Text className="text-white font-bold text-xs">▶</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
