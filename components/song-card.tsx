import React from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Song } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';
import { useKaraoke } from '@/lib/karaoke-context';

interface SongCardProps {
  song: Song;
  onPress: (song: Song) => void;
  onFavoritePress?: (song: Song) => void;
  showFavorite?: boolean;
}

export function SongCard({
  song,
  onPress,
  onFavoritePress,
  showFavorite = true,
}: SongCardProps) {
  const colors = useColors();
  const { isFavorite } = useKaraoke();
  const favorite = isFavorite(song.id);

  const difficultyColor = {
    easy: colors.success,
    medium: colors.warning,
    hard: colors.error,
  }[song.difficulty];

  return (
    <Pressable
      onPress={() => onPress(song)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      className="mb-4"
    >
      <View
        className="rounded-lg overflow-hidden border"
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
      >
        {/* Image */}
        <View className="w-full h-40 bg-muted relative">
          <Image
            source={{ uri: song.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Difficulty Badge */}
          <View
            className="absolute top-2 right-2 px-2 py-1 rounded-full"
            style={{ backgroundColor: difficultyColor }}
          >
            <Text className="text-xs font-semibold text-foreground capitalize">
              {song.difficulty}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <Text
                className="text-lg font-bold text-foreground"
                numberOfLines={1}
              >
                {song.title}
              </Text>
              <Text className="text-sm text-muted mt-1" numberOfLines={1}>
                {song.artist}
              </Text>
            </View>
            {showFavorite && (
              <Pressable
                onPress={() => onFavoritePress?.(song)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <MaterialIcons
                  name={favorite ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={favorite ? colors.error : colors.muted}
                />
              </Pressable>
            )}
          </View>

          {/* Metadata */}
          <View className="flex-row justify-between items-center mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="access-time" size={14} color={colors.muted} />
              <Text className="text-xs text-muted">
                {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="play-circle-outline" size={14} color={colors.muted} />
              <Text className="text-xs text-muted">
                {(song.plays / 1000000).toFixed(1)}M
              </Text>
            </View>
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Text className="text-xs font-semibold text-primary">
                {song.category}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
