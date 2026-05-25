import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useUser();
  const { colors, isDarkMode } = useTheme();

  const renderDetailRow = (icon: any, label: string, value: string, showBorder = true) => (
    <View style={[styles.detailRow, !showBorder && { borderBottomWidth: 0 }, { borderBottomColor: colors.divider }]}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} style={styles.detailIcon} />
        <View>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
          <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{value}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 60 + insets.top, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Name Section */}
        <View style={styles.nameSection}>
          <Text style={[styles.fullName, { color: colors.textPrimary }]}>
            {user?.name?.toUpperCase() || 'USER'}
          </Text>
          {/* Wallet Balance Badge */}
          <View style={[styles.walletBadge, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="wallet-outline" size={16} color={colors.primary} />
            <Text style={[styles.walletText, { color: colors.primary }]}>
              ₹{user?.wallet_balance?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>

        {/* Section 1: Your Details */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Your Details</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.editIcon}>
            <Feather name="edit-2" size={16} color={colors.primary} />
          </TouchableOpacity>
          {renderDetailRow('person-outline', 'Name', user?.name || '—')}
          {renderDetailRow('mail-outline', 'Email', user?.email || '—')}
          {renderDetailRow('briefcase-outline', 'Occupation', user?.occupation || '—', false)}
        </View>

        {/* Section 2: Other Details */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Other Details</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {renderDetailRow('calendar-outline', 'Age', user?.age ? String(user.age) : '—')}
          {renderDetailRow('ribbon-outline', 'Role', user?.role || '—')}
          {renderDetailRow('code-outline', 'Referral Code', user?.referral_code || '—', false)}
        </View>

        {/* Section 3: Settings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Settings</Text>
        </View>
        <TouchableOpacity style={[styles.settingsRow, { backgroundColor: colors.card }]}>
          <View style={styles.settingsLeft}>
            <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>Additional Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  walletText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  card: {
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
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default ProfileScreen;
