import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { USER_DATA } from '../constants/mockData';

const ProfileScreen = () => {
  const renderMenuItem = (icon: keyof typeof Ionicons.prototype.getRawProps, title: string, subtitle?: string) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textDisabled} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{USER_DATA.name}</Text>
        <Text style={styles.userEmail}>{USER_DATA.email}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Ionicons name="wallet-outline" size={24} color={COLORS.secondary} />
          </View>
          <Text style={styles.walletAmount}>₹{USER_DATA.walletBalance}</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Watch-to-Earn Progress</Text>
              <Text style={styles.progressValue}>{USER_DATA.watchProgress}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${USER_DATA.watchProgress}%` }]} />
            </View>
            <Text style={styles.progressHint}>Watch 5 more hours to earn ₹100!</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My Learning</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.enrolledScroll}>
          {USER_DATA.enrolledCourses.map(course => (
            <TouchableOpacity key={course.id} style={styles.enrolledCard}>
              <Image source={{ uri: course.thumbnail }} style={styles.enrolledThumbnail} />
              <View style={styles.enrolledInfo}>
                <Text style={styles.enrolledTitle} numberOfLines={1}>{course.title}</Text>
                <View style={styles.miniProgressBarBackground}>
                  <View style={[styles.miniProgressBarFill, { width: `${course.progress * 100}%` }]} />
                </View>
                <Text style={styles.enrolledProgressText}>{Math.round(course.progress * 100)}% Completed</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuContainer}>
          {renderMenuItem('receipt-outline', 'Purchase History', 'View all your invoices')}
          {renderMenuItem('download-outline', 'Downloads', 'Manage offline videos')}
          {renderMenuItem('notifications-outline', 'Notifications', 'App updates and reminders')}
          {renderMenuItem('help-circle-outline', 'Help & Support', 'FAQs and contact us')}
          {renderMenuItem('log-out-outline', 'Logout', 'Sign out of your account')}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...SHADOWS.soft,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  editButton: {
    marginTop: SPACING.md,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
  },
  walletCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: -20,
    ...SHADOWS.medium,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  walletAmount: {
    color: COLORS.secondary,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  progressSection: {
    marginTop: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: COLORS.white,
    fontSize: 12,
  },
  progressValue: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  progressHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 8,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  enrolledScroll: {
    marginHorizontal: -SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  enrolledCard: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
    ...SHADOWS.soft,
    overflow: 'hidden',
  },
  enrolledThumbnail: {
    width: '100%',
    height: 100,
  },
  enrolledInfo: {
    padding: SPACING.sm,
  },
  enrolledTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  miniProgressBarBackground: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
  },
  miniProgressBarFill: {
    height: 4,
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  enrolledProgressText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.soft,
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default ProfileScreen;
