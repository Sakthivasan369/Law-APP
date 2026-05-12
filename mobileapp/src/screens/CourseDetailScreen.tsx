import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES } from '../constants/mockData';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');
const BRAND_PURPLE = '#5A4BFF';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;

interface Props {
  route: CourseDetailRouteProp;
  navigation: any;
}

const CourseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { courseId } = route.params;
  const course = MOCK_COURSES.find(c => c.id === courseId) || MOCK_COURSES[0];
  const [activeTab, setActiveTab] = useState<'Description' | 'All Classes' | 'Infinite Learning'>('Description');

  const batchFeatures = [
    { icon: 'calendar', text: 'Course Duration: 23 May - 30 June' },
    { icon: 'tv', text: 'Online lectures' },
    { icon: 'description', text: 'DPPs and Test Solutions' },
    { icon: 'star', text: 'Premium study material' },
  ];

  const demoVideos = [
    { id: '1', title: 'Introduction to Data Science', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1551288049-bbda3865c170?w=400&q=80' },
    { id: '2', title: 'Probability & Statistics', duration: '18:20', thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&q=80' },
    { id: '3', title: 'Linear Algebra for AI', duration: '15:10', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd48632a2?w=400&q=80' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 60 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{course.title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="share-2" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Image/Video Placeholder */}
        <Image source={{ uri: course.thumbnail }} style={styles.courseImage} />

        {/* Sticky Segmented Tabs */}
        <View style={styles.tabBar}>
          {(['Description', 'All Classes', 'Infinite Learning'] as const).map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.paddingContainer}>
          {/* This Batch Includes */}
          <Text style={styles.sectionTitle}>This Batch Includes</Text>
          {batchFeatures.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIconContainer}>
                <MaterialIcons name={feature.icon as any} size={18} color={BRAND_PURPLE} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}

          {/* Subjects List */}
          <View style={styles.subjectsSection}>
            <View style={styles.subjectsHeader}>
              <Ionicons name="book" size={20} color={BRAND_PURPLE} />
              <Text style={styles.subjectsTitle}>Subjects Covered</Text>
            </View>
            <Text style={styles.subjectsText}>
              Machine Learning, Probability & Statistics, Linear Algebra, Calculus, Python Programming, Data Structures, AI Ethics
            </Text>
          </View>

          {/* Demo Videos Scroller */}
          <View style={styles.demoHeader}>
            <Text style={styles.sectionTitle}>Demo Videos</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroller}>
          {demoVideos.map(video => (
            <TouchableOpacity key={video.id} style={styles.demoCard}>
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: video.thumbnail }} style={styles.demoThumbnail} />
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={24} color={COLORS.white} />
                </View>
              </View>
              <Text style={styles.demoTitle} numberOfLines={1}>{video.title}</Text>
              <Text style={styles.demoDuration}>{video.duration} mins</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Sticky Checkout Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>₹14999</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>50% OFF</Text>
            </View>
          </View>
          <Text style={styles.originalPrice}>₹29999</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  courseImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: COLORS.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: BRAND_PURPLE,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: BRAND_PURPLE,
  },
  paddingContainer: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  subjectsSection: {
    backgroundColor: '#F9FAFB',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subjectsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  subjectsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: BRAND_PURPLE,
    fontWeight: 'bold',
    fontSize: 13,
  },
  demoScroller: {
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.md,
  },
  demoCard: {
    width: width * 0.6,
    marginRight: SPACING.md,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 8,
  },
  demoThumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  demoDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    ...SHADOWS.medium,
  },
  priceContainer: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.textDisabled,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: BRAND_PURPLE,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
  },
  buyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CourseDetailScreen;
