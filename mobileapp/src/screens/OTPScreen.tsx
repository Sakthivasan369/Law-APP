import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { apiRequest, API_ENDPOINTS, setAuthToken } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import { jwtDecode } from 'jwt-decode';

const OTPScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiRequest(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
      
      const token = response.data.token;
      await setAuthToken(token);
      
      // Decode token to check onboarding status
      const decoded: any = jwtDecode(token);
      
      if (decoded.is_onboarded) {
        navigation.replace('App'); // Assuming 'App' is the DrawerRoot
      } else {
        navigation.replace('Onboarding'); // Go to ProfileSetup
      }
      
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="------"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
            textAlign="center"
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton 
          title="Verify" 
          onPress={handleVerifyOTP} 
          loading={loading}
          style={{ marginTop: SPACING.lg }}
        />
        
        <TouchableOpacity style={styles.resendButton} onPress={() => navigation.goBack()}>
          <Text style={styles.resendText}>Change Email / Resend</Text>
        </TouchableOpacity>
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
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  input: {
    fontSize: 24,
    letterSpacing: 10,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.error,
    marginTop: SPACING.sm,
    fontSize: 14,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default OTPScreen;
