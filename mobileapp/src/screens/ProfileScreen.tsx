import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const renderDetailRow = (icon: any, label: string, value: string, showBorder = true) => (
    <View style={[styles.detailRow, !showBorder && { borderBottomWidth: 0 }]}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={20} color={COLORS.textSecondary} style={styles.detailIcon} />
        <View>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 60 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Name Section */}
        <View style={styles.nameSection}>
          <Text style={styles.fullName}>SAKTHIVASAN S</Text>
        </View>

        {/* Section 1: Your Details */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Details</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.editIcon}>
            <Feather name="edit-2" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          {renderDetailRow('person-outline', 'Name', 'SAKTHIVASAN S')}
          {renderDetailRow('mail-outline', 'Email', 'sakthivasan516@gmail.com')}
          {renderDetailRow('call-outline', 'Phone', '9710288036', false)}
        </View>

        {/* Section 2: Other Details */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Other Details</Text>
        </View>
        <View style={styles.card}>
          {renderDetailRow('school-outline', 'Exam', 'GATE')}
          {renderDetailRow('layers-outline', 'Class', 'Post Graduate')}
          {renderDetailRow('terminal-outline', 'Stream', 'Data Science & AI - GATE')}
          {renderDetailRow('location-outline', 'City', 'Chennai')}
          {renderDetailRow('map-outline', 'State', 'Tamil Nadu', false)}
        </View>

        {/* Section 3: Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Settings</Text>
        </View>
        <TouchableOpacity style={styles.settingsRow}>
          <View style={styles.settingsLeft}>
            <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
            <Text style={styles.settingsLabel}>Additional Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textDisabled} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: 60,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  nameSection: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.soft,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    width: 30,
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.soft,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default ProfileScreen;
