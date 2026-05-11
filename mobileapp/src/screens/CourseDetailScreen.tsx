import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES, MOCK_MODULES, MOCK_REVIEWS } from '../constants/mockData';
import PrimaryButton from '../components/PrimaryButton';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
type CourseDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseDetail'>;

interface Props {
  route: CourseDetailRouteProp;
  navigation: CourseDetailNavigationProp;
}

const CourseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const course = MOCK_COURSES.find(c => c.id === courseId) || MOCK_COURSES[0];
  const [activeTab, setActiveTab] = useState<'Curriculum' | 'Reviews' | 'About'>('Curriculum');
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);

  const toggleModule = (id: string) => {
    if (expandedModules.includes(id)) {
      setExpandedModules(expandedModules.filter(m => m !== id));
    } else {
      setExpandedModules([...expandedModules, id]);
    }
  };

  const renderCurriculum = () => (
    <View style={styles.tabContent}>
      {MOCK_MODULES.map(module => (
        <View key={module.id} style={styles.moduleContainer}>
          <TouchableOpacity 
            style={styles.moduleHeader} 
            onPress={() => toggleModule(module.id)}
          >
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Ionicons 
              name={expandedModules.includes(module.id) ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
          
          {expandedModules.includes(module.id) && (
            <View style={styles.lessonsList}>
              {module.lessons.map(lesson => (
                <TouchableOpacity 
                  key={lesson.id} 
                  style={styles.lessonItem}
                  disabled={lesson.isLocked}
                  onPress={() => navigation.navigate('VideoPlayer', { courseId, lessonId: lesson.id })}
                >
                  <View style={styles.lessonInfo}>
                    <Ionicons 
                      name={lesson.isLocked ? 'lock-closed' : 'play-circle'} 
                      size={20} 
                      color={lesson.isLocked ? COLORS.textDisabled : COLORS.primary} 
                    />
                    <Text style={[styles.lessonTitle, lesson.isLocked && styles.lessonLockedText]}>
                      {lesson.title}
                    </Text>
                  </View>
                  <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {MOCK_REVIEWS.map(review => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Image source={{ uri: review.avatar }} style={styles.avatar} />
            <View style={styles.reviewUserInfo}>
              <Text style={styles.reviewUser}>{review.user}</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Ionicons 
                    key={star} 
                    name="star" 
                    size={12} 
                    color={star <= review.rating ? COLORS.secondary : COLORS.textDisabled} 
                  />
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  const renderAbout = () => (
    <View style={styles.tabContent}>
      <Text style={styles.aboutTitle}>Description</Text>
      <Text style={styles.aboutText}>{course.description}</Text>
      <Text style={[styles.aboutTitle, { marginTop: SPACING.lg }]}>Instructor</Text>
      <View style={styles.instructorCard}>
        <View style={styles.instructorInfo}>
          <Text style={styles.instructorName}>{course.instructor}</Text>
          <Text style={styles.instructorBio}>Senior Advocate, High Court of Madras. 15+ years of experience in constitutional law.</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={false}
            useNativeControls
            style={styles.video}
          />
          <View style={styles.videoOverlay}>
            <TouchableOpacity style={styles.videoIconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoIconButton}>
              <Ionicons name="share-social-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
            {course.isPremium && (
              <View style={[styles.categoryBadge, { backgroundColor: COLORS.secondary }]}>
                <Text style={[styles.categoryText, { color: COLORS.white }]}>PREMIUM</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{course.title}</Text>
          
          <View style={styles.metaRow}>
            <Ionicons name="star" size={16} color={COLORS.secondary} />
            <Text style={styles.metaText}>{course.rating} (1.2k Reviews)</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{course.enrolledCount} Students</Text>
          </View>

          <View style={styles.tabsRow}>
            {(['Curriculum', 'Reviews', 'About'] as const).map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Curriculum' && renderCurriculum()}
          {activeTab === 'Reviews' && renderReviews()}
          {activeTab === 'About' && renderAbout()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Full Course</Text>
          <Text style={styles.footerPrice}>₹{course.price}</Text>
        </View>
        <PrimaryButton 
          title="Add to Cart" 
          onPress={() => navigation.navigate('CartTab' as any)} 
          style={styles.footerButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  videoIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textDisabled,
    marginHorizontal: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    paddingBottom: 100,
  },
  moduleContainer: {
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: '#F9FAFB',
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  lessonsList: {
    paddingHorizontal: SPACING.md,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  lessonLockedText: {
    color: COLORS.textDisabled,
  },
  lessonDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewItem: {
    marginBottom: SPACING.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewUserInfo: {
    marginLeft: 12,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  instructorCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: '#F9FAFB',
    borderRadius: BORDER_RADIUS.md,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  instructorBio: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    ...SHADOWS.medium,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footerButton: {
    width: width * 0.5,
  },
});

export default CourseDetailScreen;
