import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { MOCK_MODULES, MOCK_COURSES } from '../constants/mockData';
import VideoControlsOverlay from '../components/VideoControlsOverlay';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
interface Props { route: VideoPlayerRouteProp; }

const VideoPlayerScreen: React.FC<Props> = ({ route }) => {
  const { courseId, lessonId } = route.params;
  const video = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | {}>({});
  const { colors, isDarkMode } = useTheme();

  const allLessons = MOCK_MODULES.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const handlePlayPause = () => {
    if (isPlaying) { video.current?.pauseAsync(); } else { video.current?.playAsync(); }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.videoWrapper}>
        <Video
          ref={video} style={styles.video}
          source={{ uri: currentLesson.videoUrl || 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          useNativeControls={false} resizeMode="contain"
          onPlaybackStatusUpdate={s => setStatus(() => s)}
        />
        <VideoControlsOverlay
          isPlaying={isPlaying} onPlayPause={handlePlayPause}
          onRewind={() => video.current?.setPositionAsync((status as any).positionMillis - 10000)}
          onForward={() => video.current?.setPositionAsync((status as any).positionMillis + 10000)}
        />
      </View>

      <View style={[styles.navigationRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.navButton} disabled={currentLessonIndex === 0}>
          <Ionicons name="play-skip-back" size={24} color={currentLessonIndex === 0 ? colors.textDisabled : colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }, currentLessonIndex === 0 && { color: colors.textDisabled }]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} disabled={currentLessonIndex === allLessons.length - 1}>
          <Text style={[styles.navText, { color: colors.primary }, currentLessonIndex === allLessons.length - 1 && { color: colors.textDisabled }]}>Next Lesson</Text>
          <Ionicons name="play-skip-forward" size={24} color={currentLessonIndex === allLessons.length - 1 ? colors.textDisabled : colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>{currentLesson.title}</Text>
        <Text style={[styles.courseTitle, { color: colors.textSecondary }]}>{MOCK_COURSES.find(c => c.id === courseId)?.title || 'Legal Course'}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Up Next</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {allLessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.queueItem, lesson.id === lessonId && { backgroundColor: isDarkMode ? colors.primary + '20' : '#EBF4FF' }]}
              disabled={lesson.isLocked}
            >
              <View style={styles.queueIndex}>
                {lesson.id === lessonId ? (
                  <Ionicons name="play" size={16} color={colors.primary} />
                ) : (
                  <Text style={[styles.queueIndexText, { color: colors.textDisabled }]}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.queueInfo}>
                <Text style={[styles.queueTitle, { color: colors.textPrimary }, lesson.id === lessonId && { color: colors.primary, fontWeight: 'bold' }]}>{lesson.title}</Text>
                <Text style={[styles.queueDuration, { color: colors.textSecondary }]}>{lesson.duration}</Text>
              </View>
              {lesson.isLocked && <Ionicons name="lock-closed" size={16} color={colors.textDisabled} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  videoWrapper: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  navigationRow: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md, borderBottomWidth: 1 },
  navButton: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm },
  navText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
  content: { flex: 1, padding: SPACING.md },
  lessonTitle: { fontSize: 20, fontWeight: 'bold' },
  courseTitle: { fontSize: 14, marginTop: 4 },
  divider: { height: 1, marginVertical: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: SPACING.md },
  queueItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: BORDER_RADIUS.md, marginBottom: 4 },
  queueIndex: { width: 24, alignItems: 'center' },
  queueIndexText: { fontSize: 14 },
  queueInfo: { flex: 1, marginLeft: 12 },
  queueTitle: { fontSize: 14 },
  queueDuration: { fontSize: 12, marginTop: 2 },
});

export default VideoPlayerScreen;
