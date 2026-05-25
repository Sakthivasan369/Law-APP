import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { apiRequest, API_ENDPOINTS, setAuthToken } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const OTPScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { fetchUserProfile } = useUser();
  const { colors } = useTheme();

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
      
      // Fetch user profile immediately after storing the token
      await fetchUserProfile();

      // Decode token to check onboarding status
      const decoded: any = jwtDecode(token);
      
      if (decoded.is_onboarded) {
        navigation.replace('App');
      } else {
        navigation.replace('Onboarding');
      }
      
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>Verify OTP</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter the 6-digit code sent to {email}</Text>

        <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="------"
            placeholderTextColor={colors.textDisabled}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
            textAlign="center"
          />
        </View>
        
        {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

        <PrimaryButton 
          title="Verify" 
          onPress={handleVerifyOTP} 
          loading={loading}
          style={{ marginTop: SPACING.lg }}
        />
        
        <TouchableOpacity style={styles.resendButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.resendText, { color: colors.primary }]}>Change Email / Resend</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.xl,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 60,
    justifyContent: 'center',
  },
  input: {
    fontSize: 24,
    letterSpacing: 10,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  resendText: {
    fontWeight: '600',
  },
});

export default OTPScreen;
