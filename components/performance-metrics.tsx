/**
 * Modern Karaoke Performance Screen - Premium Design
 * Complete redesign with glassmorphism and smooth animations
 */

import { View, Text, Pressable, ScrollView, Dimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

interface PerformanceMetrics {
  score: number;
  accuracy: number;
  rhythm: number;
  rating: string;
}

export function PerformanceMetricsDisplay({ metrics }: { metrics: PerformanceMetrics }) {
  const [scoreAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(scoreAnim, {
      toValue: metrics.score,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [metrics.score]);

  const getScoreColor = (score: number) => {
    if (score >= 95) return '#00d084'; // Perfect - Green
    if (score >= 85) return '#00a3e0'; // Great - Blue
    if (score >= 75) return '#ffd60a'; // Good - Yellow
    if (score >= 60) return '#ff9500'; // Fair - Orange
    return '#ff4b4b'; // Poor - Red
  };

  const ratingEmoji = {
    'Perfect': '🌟',
    'Great': '⭐',
    'Good': '👍',
    'Fair': '👌',
    'Poor': '😅',
  };

  return (
    <View className="items-center justify-center gap-6 py-8">
      {/* Score Circle */}
      <View
        className="w-48 h-48 rounded-full items-center justify-center border-4"
        style={{
          borderColor: getScoreColor(metrics.score),
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          shadowColor: getScoreColor(metrics.score),
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }}
      >
        <Animated.Text
          style={{
            fontSize: 64,
            fontWeight: '700',
            color: getScoreColor(metrics.score),
          }}
        >
          {Math.round(metrics.score)}
        </Animated.Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: 8 }}>points</Text>
      </View>

      {/* Rating */}
      <View className="items-center gap-2">
        <Text style={{ fontSize: 48 }}>
          {ratingEmoji[metrics.rating as keyof typeof ratingEmoji] || '👍'}
        </Text>
        <Text style={{ color: getScoreColor(metrics.score), fontSize: 24, fontWeight: '700' }}>
          {metrics.rating}
        </Text>
      </View>

      {/* Metrics Grid */}
      <View className="w-full flex-row gap-3 justify-center px-6">
        <MetricCard label="Accuracy" value={metrics.accuracy} icon="target" />
        <MetricCard label="Rhythm" value={metrics.rhythm} icon="music-note" />
      </View>
    </View>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <View
      className="flex-1 items-center justify-center rounded-2xl py-4 px-3"
      style={{
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(124, 58, 237, 0.3)',
      }}
    >
      <MaterialIcons name={icon as any} size={24} color="#7c3aed" />
      <Text style={{ color: '#7c3aed', fontSize: 18, fontWeight: '700', marginTop: 4 }}>
        {Math.round(value)}%
      </Text>
      <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
