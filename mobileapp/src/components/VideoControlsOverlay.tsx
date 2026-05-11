import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

interface VideoControlsOverlayProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  quality?: string;
}

const VideoControlsOverlay: React.FC<VideoControlsOverlayProps> = ({
  isPlaying,
  onPlayPause,
  onRewind,
  onForward,
  quality = '480p',
}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.topRow}>
        <View style={styles.qualityBadge}>
          <Text style={styles.qualityText}>{quality}</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={onRewind} style={styles.controlButton}>
          <Ionicons name="refresh-outline" size={32} color={COLORS.white} style={{ transform: [{ scaleX: -1 }] }} />
          <Text style={styles.skipText}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onForward} style={styles.controlButton}>
          <Ionicons name="refresh-outline" size={32} color={COLORS.white} />
          <Text style={styles.skipText}>10s</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        {/* Placeholder for progress bar */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '45%' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  topRow: {
    alignItems: 'flex-end',
  },
  qualityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qualityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(26, 54, 93, 0.8)', // Primary color with opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
  bottomRow: {
    width: '100%',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
});

export default VideoControlsOverlay;
