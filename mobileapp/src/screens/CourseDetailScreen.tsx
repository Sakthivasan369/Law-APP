import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES } from '../constants/mockData';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
interface Props { route: CourseDetailRouteProp; navigation: any; }

const CourseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { courseId } = route.params;
  const course = MOCK_COURSES.find(c => c.id === courseId) || MOCK_COURSES[0];
  const [activeTab, setActiveTab] = useState<'Description' | 'All Classes' | 'Infinite Learning'>('Description');
  const { colors, isDarkMode } = useTheme();
  const BRAND_PURPLE = isDarkMode ? '#7B6EFF' : '#5A4BFF';

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top, height: 60 + insets.top, borderBottomColor: colors.divider }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>{course.title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="share-2" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: course.thumbnail }} style={styles.courseImage} />
        <View style={[styles.tabBar, { borderBottomColor: colors.divider, backgroundColor: colors.background }]}>
          {(['Description', 'All Classes', 'Infinite Learning'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && { borderBottomColor: BRAND_PURPLE }]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === tab && { color: BRAND_PURPLE }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.paddingContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Batch Includes</Text>
          {batchFeatures.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={[styles.featureIconContainer, { backgroundColor: isDarkMode ? BRAND_PURPLE + '25' : '#F0EFFF' }]}>
                <MaterialIcons name={feature.icon as any} size={18} color={BRAND_PURPLE} />
              </View>
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>{feature.text}</Text>
            </View>
          ))}
          <View style={[styles.subjectsSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.subjectsHeader}>
              <Ionicons name="book" size={20} color={BRAND_PURPLE} />
              <Text style={[styles.subjectsTitle, { color: colors.textPrimary }]}>Subjects Covered</Text>
            </View>
            <Text style={[styles.subjectsText, { color: colors.textSecondary }]}>
              Machine Learning, Probability & Statistics, Linear Algebra, Calculus, Python Programming, Data Structures, AI Ethics
            </Text>
          </View>
          <View style={styles.demoHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Demo Videos</Text>
            <TouchableOpacity><Text style={[styles.viewAllText, { color: BRAND_PURPLE }]}>View All</Text></TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroller}>
          {demoVideos.map(video => (
            <TouchableOpacity key={video.id} style={styles.demoCard}>
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: video.thumbnail }} style={styles.demoThumbnail} />
                <View style={styles.playOverlay}><Ionicons name="play" size={24} color="#fff" /></View>
              </View>
              <Text style={[styles.demoTitle, { color: colors.textPrimary }]} numberOfLines={1}>{video.title}</Text>
              <Text style={[styles.demoDuration, { color: colors.textSecondary }]}>{video.duration} mins</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.divider }]}>
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={[styles.discountedPrice, { color: colors.textPrimary }]}>₹14999</Text>
            <View style={styles.discountBadge}><Text style={styles.discountText}>50% OFF</Text></View>
          </View>
          <Text style={[styles.originalPrice, { color: colors.textDisabled }]}>₹29999</Text>
        </View>
        <TouchableOpacity style={[styles.buyButton, { backgroundColor: BRAND_PURPLE }]}>
          <Text style={styles.buyButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, height: 60, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  iconButton: { padding: 8 },
  scrollContent: { paddingBottom: 120 },
  courseImage: { width: '100%', height: 220, resizeMode: 'cover' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 13, fontWeight: '600' },
  paddingContainer: { padding: SPACING.md },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureIconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  featureText: { fontSize: 14 },
  subjectsSection: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginVertical: SPACING.lg, borderWidth: 1 },
  subjectsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  subjectsTitle: { fontSize: 15, fontWeight: 'bold', marginLeft: 10 },
  subjectsText: { fontSize: 13, lineHeight: 20 },
  demoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllText: { fontWeight: 'bold', fontSize: 13 },
  demoScroller: { paddingLeft: SPACING.md, paddingBottom: SPACING.md },
  demoCard: { width: width * 0.6, marginRight: SPACING.md },
  thumbnailContainer: { width: '100%', aspectRatio: 16 / 9, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', backgroundColor: '#000', marginBottom: 8 },
  demoThumbnail: { width: '100%', height: '100%', opacity: 0.8 },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  demoTitle: { fontSize: 14, fontWeight: '600' },
  demoDuration: { fontSize: 12, marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, borderTopWidth: 1, ...SHADOWS.medium },
  priceContainer: { flex: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  discountedPrice: { fontSize: 22, fontWeight: 'bold' },
  discountBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  discountText: { color: '#166534', fontSize: 10, fontWeight: 'bold' },
  originalPrice: { fontSize: 14, textDecorationLine: 'line-through', marginTop: 2 },
  buyButton: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: BORDER_RADIUS.md },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CourseDetailScreen;
