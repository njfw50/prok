import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { SongCard } from '@/components/song-card';
import { useColors } from '@/hooks/use-colors';
import { useKaraoke } from '@/lib/karaoke-context';
import { getAllSongs } from '@/lib/mock-songs';
import { Song } from '@/lib/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { favorites, addFavorite, removeFavorite, addToRecentlyPlayed } = useKaraoke();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);

  // Update favorites whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const allSongs = getAllSongs();
      const favorited = allSongs.filter((song) => favorites.includes(song.id));
      setFavoriteSongs(favorited);
    }, [favorites])
  );

  const handleSongPress = async (song: Song) => {
    await addToRecentlyPlayed(song.id);
    router.push({
      pathname: '/song-detail',
      params: { songId: song.id },
    });
  };

  const handleFavoritePress = async (song: Song) => {
    if (favorites.includes(song.id)) {
      await removeFavorite(song.id);
    } else {
      await addFavorite(song.id);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Favorites</Text>
          <Text className="text-sm text-muted mt-1">
            {favoriteSongs.length} saved {favoriteSongs.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>

        {/* Content */}
        {favoriteSongs.length > 0 ? (
          <View className="px-4 pb-6">
            {favoriteSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPress={handleSongPress}
                onFavoritePress={handleFavoritePress}
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <MaterialIcons
              name="favorite-border"
              size={64}
              color={colors.muted}
            />
            <Text className="text-lg font-semibold text-foreground mt-4">
              No Favorites Yet
            </Text>
            <Text className="text-sm text-muted text-center mt-2 px-6">
              Save songs to your favorites to access them quickly later
            </Text>
            <Pressable
              onPress={() => router.push('/')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                },
              ]}
              className="mt-6 px-6 py-3 rounded-lg"
            >
              <Text className="text-foreground font-semibold">
                Browse Songs
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
