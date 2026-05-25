import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { USER_DATA } from '../constants/mockData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyCoursesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const renderEnrolledItem = ({ item }: { item: typeof USER_DATA.enrolledCourses[0] }) => (
    <TouchableOpacity 
      style={[styles.courseCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.instructor, { color: colors.textSecondary }]}>Adv. Rajesh Kumar</Text>
        
        <View style={styles.progressSection}>
          <View style={[styles.progressBarBackground, { backgroundColor: colors.highlightBg }]}>
            <View style={[styles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: colors.success }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>{Math.round(item.progress * 100)}% Completed</Text>
        </View>

        <TouchableOpacity 
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('VideoPlayer', { courseId: item.id, lessonId: 'l1' })}
        >
          <Text style={[styles.continueText, { color: colors.white }]}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Enrolled Courses</Text>
      <FlatList
        data={USER_DATA.enrolledCourses}
        keyExtractor={item => item.id}
        renderItem={renderEnrolledItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  courseCard: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  thumbnail: {
    width: 100,
    height: '100%',
    minHeight: 120,
    borderRadius: BORDER_RADIUS.md,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructor: {
    fontSize: 12,
    marginTop: 2,
  },
  progressSection: {
    marginTop: 12,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    marginTop: 4,
  },
  continueButton: {
    marginTop: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MyCoursesScreen;
