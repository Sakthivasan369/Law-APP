import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { apiRequest, API_ENDPOINTS, setAuthToken } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const INTEREST_OPTIONS = [
  'IPC', 'Civil Law', 'Constitution', 'Criminal Law', 'Corporate Law', 'Family Law'
];

const ProfileSetupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { fetchUserProfile } = useUser();
  const { colors } = useTheme();

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleOnboard = async () => {
    if (!name || !age || !occupation || interests.length === 0) {
      setError('Please fill all fields and select at least one interest');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Assuming apiRequest handles adding the token automatically
      await apiRequest(API_ENDPOINTS.ONBOARD, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          age: parseInt(age, 10),
          occupation,
          interests
        }),
      });

      // Fetch updated user profile after onboarding
      await fetchUserProfile();

      // Navigation replace because we don't want them to go back to onboarding
      navigation.replace('App');
    } catch (err: any) {
      // If the server says already onboarded, just navigate to the app
      if (err.message === 'already_onboarded') {
        await fetchUserProfile();
        navigation.replace('App');
        return;
      }
      setError(err.message || 'Failed to complete profile setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.primary }]}>Complete Your Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Help us personalize your learning experience</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary }]}
            placeholder="e.g. SAKTHIVASAN"
            placeholderTextColor={colors.textDisabled}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Age</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary }]}
            placeholder="e.g. 21"
            placeholderTextColor={colors.textDisabled}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Occupation</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary }]}
            placeholder="e.g. Law Student, Advocate"
            placeholderTextColor={colors.textDisabled}
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Interests (Select multiple)</Text>
          <View style={styles.chipContainer}>
            {INTEREST_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  interests.includes(item) && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => toggleInterest(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textSecondary },
                    interests.includes(item) && { color: colors.white, fontWeight: '600' },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

        <PrimaryButton 
          title="Start Learning" 
          onPress={handleOnboard} 
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipText: {
    fontSize: 14,
  },
  errorText: {
    marginBottom: SPACING.md,
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default ProfileSetupScreen;
