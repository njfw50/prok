/**
 * Tela Home - Integrada com Real Music API
 * Design novo: Azul + Laranja minimalista
 */

import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { RealSongList, SongCard } from '@/components/song-list';
import { useRealSongs, usePopularSongs } from '@/hooks/use-real-songs';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const popularSongs = usePopularSongs();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchMode(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchMode(false);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-8 pb-10">
        <Text className="text-white text-4xl font-bold">Karaoke Pro</Text>
        <Text className="text-blue-100 text-sm mt-1">
          🎵 Powered by Real Music APIs
        </Text>
      </View>

      {/* Search Section */}
      <View className="px-4 pt-6 pb-4">
        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Text className="text-blue-600 text-xl mr-2">🔍</Text>
          <TextInput
            placeholder="Search songs or artists..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            className="flex-1 text-gray-800 text-base"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Text className="text-gray-400 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.trim() && (
          <TouchableOpacity
            onPress={handleSearch}
            className="mt-2 bg-orange-500 rounded-lg py-2 px-4"
          >
            <Text className="text-white font-bold text-center">
              Search for "{searchQuery}"
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      {searchMode && searchQuery.trim() ? (
        // Search Results
        <View className="px-4 pt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-800 font-bold text-lg">
              Results for "{searchQuery}"
            </Text>
            <TouchableOpacity onPress={clearSearch}>
              <Text className="text-blue-600 text-sm font-semibold">Clear</Text>
            </TouchableOpacity>
          </View>
          <RealSongList query={searchQuery} />
        </View>
      ) : (
        // Default View - Popular Songs
        <>
          {/* Trending Section */}
          <View className="px-4 pt-2 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 font-bold text-lg">
                🔥 Trending Now
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/karaoke-performance',
                    params: {
                      artist: 'The Weeknd',
                      track: 'Blinding Lights',
                    },
                  })
                }
              >
                <Text className="text-blue-600 text-sm font-semibold">
                  See All →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Popular Songs List */}
            {popularSongs.slice(0, 5).map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPress={() =>
                  router.push({
                    pathname: '/karaoke-performance',
                    params: {
                      artist: song.artist,
                      track: song.title,
                    },
                  })
                }
              />
            ))}
          </View>

          {/* Browse by Artist */}
          <View className="px-4 pb-6">
            <Text className="text-gray-800 font-bold text-lg mb-3">
              👤 Popular Artists
            </Text>

            <View className="flex-row gap-2 flex-wrap">
              {[
                'The Weeknd',
                'Ariana Grande',
                'Post Malone',
                'Drake',
                'Taylor Swift',
                'Ed Sheeran',
              ].map((artist) => (
                <TouchableOpacity
                  key={artist}
                  onPress={() =>
                    router.push({
                      pathname: '/karaoke-performance',
                      params: { artist, track: 'top-track' },
                    })
                  }
                  className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-2"
                >
                  <Text className="text-blue-700 font-semibold text-sm">
                    {artist}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* All Available Songs Grid */}
          <View className="px-0 pb-6">
            <View className="px-4 mb-4">
              <Text className="text-gray-800 font-bold text-lg">
                📻 All Songs
              </Text>
            </View>
            <RealSongList limit={20} />
          </View>
        </>
      )}
    </ScrollView>
  );
}
