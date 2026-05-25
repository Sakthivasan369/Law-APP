import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Course } from '../constants/mockData';
import { useTheme } from '../context/ThemeContext';

interface CourseCardProps {
  course: Course;
  onPress: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={() => onPress(course.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      
      {course.isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: colors.secondary }]}>
          <Ionicons name="star" size={12} color={colors.white} />
          <Text style={[styles.premiumText, { color: colors.white }]}>PREMIUM</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{course.title}</Text>
        <Text style={[styles.instructor, { color: colors.textSecondary }]}>{course.instructor}</Text>
        
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={colors.secondary} />
          <Text style={[styles.ratingText, { color: colors.textPrimary }]}>{course.rating}</Text>
          <Text style={[styles.enrolledText, { color: colors.textSecondary }]}>({course.enrolledCount} students)</Text>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.price, { color: colors.primary }]}>₹{course.price}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: colors.highlightBg }]}>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{course.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    ...SHADOWS.soft,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  enrolledText: {
    fontSize: 12,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CourseCard;
