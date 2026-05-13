import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { apiRequest, API_ENDPOINTS, setAuthToken } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import { jwtDecode } from 'jwt-decode';

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

      // Navigation replace because we don't want them to go back to onboarding
      navigation.replace('App');
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Help us personalize your learning experience</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. SAKTHIVASAN" value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} placeholder="e.g. 21" value={age} onChangeText={setAge} keyboardType="numeric" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput style={styles.input} placeholder="e.g. Law Student, Advocate" value={occupation} onChangeText={setOccupation} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interests (Select multiple)</Text>
          <View style={styles.chipContainer}>
            {INTEREST_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, interests.includes(item) && styles.chipActive]}
                onPress={() => toggleInterest(item)}
              >
                <Text style={[styles.chipText, interests.includes(item) && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    backgroundColor: '#F9FAFB',
    color: COLORS.textPrimary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default ProfileSetupScreen;
