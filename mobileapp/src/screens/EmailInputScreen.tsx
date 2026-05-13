import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { apiRequest, API_ENDPOINTS } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';

const EmailInputScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load last entered email
    AsyncStorage.getItem('lastEmail').then(savedEmail => {
      if (savedEmail) setEmail(savedEmail);
    });
  }, []);

  const handleRequestOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await apiRequest(API_ENDPOINTS.REQUEST_OTP, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      // Save for future use
      await AsyncStorage.setItem('lastEmail', email);
      
      navigation.navigate('OTP', { email });
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Sattam Ungal Kaiyil</Text>
        <Text style={styles.subtitle}>Enter your email to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="sakthi@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton 
          title="Send OTP" 
          onPress={handleRequestOTP} 
          loading={loading}
          style={{ marginTop: SPACING.lg }}
        />
      </View>
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
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 55,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  input: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  errorText: {
    color: COLORS.error,
    marginTop: SPACING.sm,
    fontSize: 14,
  },
});

export default EmailInputScreen;
