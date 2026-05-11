import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Course } from '../constants/mockData';

interface CourseCardProps {
  course: Course;
  onPress: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(course.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      
      {course.isPremium && (
        <View style={styles.premiumBadge}>
          <Ionicons name="star" size={12} color={COLORS.white} />
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.instructor}>{course.instructor}</Text>
        
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={COLORS.secondary} />
          <Text style={styles.ratingText}>{course.rating}</Text>
          <Text style={styles.enrolledText}>({course.enrolledCount} students)</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>₹{course.price}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{course.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  premiumText: {
    color: COLORS.white,
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
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  enrolledText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default CourseCard;
