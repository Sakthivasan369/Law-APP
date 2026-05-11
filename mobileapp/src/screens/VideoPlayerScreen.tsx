import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { MOCK_MODULES, MOCK_COURSES } from '../constants/mockData';
import VideoControlsOverlay from '../components/VideoControlsOverlay';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;

interface Props {
  route: VideoPlayerRouteProp;
}

const VideoPlayerScreen: React.FC<Props> = ({ route }) => {
  const { courseId, lessonId } = route.params;
  const video = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | {}>({});

  const allLessons = MOCK_MODULES.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const handlePlayPause = () => {
    if (isPlaying) {
      video.current?.pauseAsync();
    } else {
      video.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: currentLesson.videoUrl || 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          useNativeControls={false}
          resizeMode="contain"
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <VideoControlsOverlay 
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onRewind={() => video.current?.setPositionAsync((status as any).positionMillis - 10000)}
          onForward={() => video.current?.setPositionAsync((status as any).positionMillis + 10000)}
        />
      </View>

      <View style={styles.navigationRow}>
        <TouchableOpacity style={styles.navButton} disabled={currentLessonIndex === 0}>
          <Ionicons name="play-skip-back" size={24} color={currentLessonIndex === 0 ? COLORS.textDisabled : COLORS.primary} />
          <Text style={[styles.navText, currentLessonIndex === 0 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} disabled={currentLessonIndex === allLessons.length - 1}>
          <Text style={[styles.navText, currentLessonIndex === allLessons.length - 1 && styles.disabledText]}>Next Lesson</Text>
          <Ionicons name="play-skip-forward" size={24} color={currentLessonIndex === allLessons.length - 1 ? COLORS.textDisabled : COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
        <Text style={styles.courseTitle}>{MOCK_COURSES.find(c => c.id === courseId)?.title || 'Legal Course'}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Up Next</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {allLessons.map((lesson, index) => (
            <TouchableOpacity 
              key={lesson.id} 
              style={[
                styles.queueItem,
                lesson.id === lessonId && styles.activeQueueItem
              ]}
              disabled={lesson.isLocked}
            >
              <View style={styles.queueIndex}>
                {lesson.id === lessonId ? (
                  <Ionicons name="play" size={16} color={COLORS.primary} />
                ) : (
                  <Text style={styles.queueIndexText}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.queueInfo}>
                <Text style={[styles.queueTitle, lesson.id === lessonId && styles.activeQueueTitle]}>{lesson.title}</Text>
                <Text style={styles.queueDuration}>{lesson.duration}</Text>
              </View>
              {lesson.isLocked && <Ionicons name="lock-closed" size={16} color={COLORS.textDisabled} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginHorizontal: 8,
  },
  disabledText: {
    color: COLORS.textDisabled,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  courseTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 4,
  },
  activeQueueItem: {
    backgroundColor: '#EBF4FF',
  },
  queueIndex: {
    width: 24,
    alignItems: 'center',
  },
  queueIndexText: {
    fontSize: 14,
    color: COLORS.textDisabled,
  },
  queueInfo: {
    flex: 1,
    marginLeft: 12,
  },
  queueTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  activeQueueTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  queueDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default VideoPlayerScreen;
