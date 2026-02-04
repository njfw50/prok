import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  onVolumeChange: (value: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlayPause,
  onRewind,
  onForward,
  currentTime,
  duration,
  volume,
  onVolumeChange,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration * 1000)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <Pressable style={styles.controlButton} onPress={onRewind}>
          <MaterialIcons name="replay-10" size={24} color="#7C3AED" />
        </Pressable>

        <Pressable
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={onPlayPause}
        >
          <MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={36}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable style={styles.controlButton} onPress={onForward}>
          <MaterialIcons name="forward-10" size={24} color="#7C3AED" />
        </Pressable>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeSection}>
        <MaterialIcons name="volume-down" size={20} color="#94A3B8" />
        <View style={styles.volumeBar}>
          <View style={[styles.volumeFill, { width: `${volume}%` }]} />
        </View>
        <MaterialIcons name="volume-up" size={20} color="#94A3B8" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginBottom: 20,
  },
  controlButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
});
