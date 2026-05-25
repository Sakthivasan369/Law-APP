import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ReferAndEarnScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useUser();
  const { colors } = useTheme();

  const referralCode = user?.referral_code || '------';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Download Sattam Ungal Kaiyil for legal prep. Use my code ${referralCode} to get ₹250 wallet cash!`,
        title: 'Sattam Ungal Kaiyil — Refer & Earn',
      });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to open share dialog');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 60 + insets.top, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Refer & Earn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Illustration */}
        <View style={[styles.heroContainer, { backgroundColor: colors.primary + '10' }]}>
          <View style={styles.heroIconRow}>
            <View style={[styles.heroCircle, { backgroundColor: colors.secondary + '25' }]}>
              <MaterialCommunityIcons name="gift-outline" size={48} color={colors.secondary} />
            </View>
          </View>
          <View style={styles.heroStarsRow}>
            <Ionicons name="star" size={14} color={colors.secondary} style={{ opacity: 0.6 }} />
            <Ionicons name="star" size={20} color={colors.secondary} style={{ marginHorizontal: 8 }} />
            <Ionicons name="star" size={14} color={colors.secondary} style={{ opacity: 0.6 }} />
          </View>
        </View>

        {/* Invite Text */}
        <View style={styles.inviteSection}>
          <Text style={[styles.inviteTitle, { color: colors.textPrimary }]}>
            Invite Friends & Earn!
          </Text>
          <Text style={[styles.inviteSubtitle, { color: colors.textSecondary }]}>
            Invite friends & earn Wallet Cash to unlock premium courses! You get{' '}
            <Text style={[styles.highlight, { color: colors.primary }]}>₹50</Text> and your friend gets{' '}
            <Text style={[styles.highlight, { color: colors.primary }]}>₹25</Text> when they sign up using
            your code.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.stepsSection}>
          <Text style={[styles.stepsTitle, { color: colors.textPrimary }]}>How it works</Text>
          <View style={[styles.stepsCard, { backgroundColor: colors.card }]}>
            {[
              { icon: 'share-social-outline', text: 'Share your unique code with friends' },
              { icon: 'person-add-outline', text: 'Your friend signs up with your code' },
              { icon: 'wallet-outline', text: 'Both of you earn wallet cash!' },
            ].map((step, index) => (
              <View key={index} style={[styles.stepRow, index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                <View style={[styles.stepIconContainer, { backgroundColor: colors.primary + '12' }]}>
                  <Ionicons name={step.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Referral Code Box */}
        <View style={[styles.codeSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.codeLabel, { color: colors.textSecondary }]}>YOUR REFERRAL CODE</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
          ) : (
            <View style={[styles.codeBox, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}>
              <Text style={[styles.codeText, { color: colors.primary }]}>{referralCode}</Text>
            </View>
          )}
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Ionicons name="share-outline" size={22} color={colors.white} style={{ marginRight: 10 }} />
          <Text style={[styles.shareButtonText, { color: colors.white }]}>Share Code</Text>
        </TouchableOpacity>

        {/* Wallet Balance Preview */}
        <View style={[styles.walletPreview, { backgroundColor: colors.card }]}>
          <View style={styles.walletLeft}>
            <Ionicons name="wallet-outline" size={22} color={colors.success} />
            <Text style={[styles.walletLabel, { color: colors.textSecondary }]}>Your Wallet</Text>
          </View>
          <Text style={[styles.walletAmount, { color: colors.success }]}>
            ₹{user?.wallet_balance?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 40,
    marginBottom: SPACING.lg,
  },
  heroIconRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  heroCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  inviteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inviteSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  highlight: {
    fontWeight: 'bold',
  },
  stepsSection: {
    marginBottom: SPACING.lg,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  stepsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  codeSection: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  codeBox: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  shareButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  walletPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  walletAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ReferAndEarnScreen;
