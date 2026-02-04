import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LyricsLineProps {
  text: string;
  isActive: boolean;
  isSung: boolean;
  index: number;
}

export const LyricsLine: React.FC<LyricsLineProps> = ({ text, isActive, isSung, index }) => {
  const scaleAnim = React.useRef(new Animated.Value(isSung ? 0.9 : 1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isActive, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.lyricLine,
        {
          transform: [{ scale: scaleAnim }],
          opacity: isSung ? 0.5 : isActive ? 1 : 0.7,
        },
      ]}
    >
      <Text
        style={[
          styles.lyricText,
          {
            color: isActive ? '#7C3AED' : isSung ? '#94A3B8' : '#FFFFFF',
            fontWeight: isActive ? '700' : '400',
            fontSize: isActive ? 18 : 16,
          },
        ]}
      >
        {text}
      </Text>
      {isActive && <View style={styles.activeDot} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  lyricLine: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  lyricText: {
    fontSize: 16,
    lineHeight: 24,
  },
  activeDot: {
    position: 'absolute',
    right: 16,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    marginTop: -4,
  },
});
