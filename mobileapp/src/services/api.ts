/**
 * Centralized API Client
 * Using EXPO_PUBLIC_ prefix allows Expo to automatically load this variable
 */

import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  console.warn("⚠️ EXPO_PUBLIC_API_URL is not defined in .env! API calls will fail.");
}

export const API_ENDPOINTS = {
  REQUEST_OTP: `${BASE_URL}/api/auth/request-otp`,
  VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
  ONBOARD: `${BASE_URL}/api/auth/onboard`,
  ME: `${BASE_URL}/api/auth/me`,
  COURSES: `${BASE_URL}/api/courses`,
  STREAM: (id: string) => `${BASE_URL}/api/videos/${id}/stream`,
  PROGRESS: `${BASE_URL}/api/watch/progress`,
  REDEEM_REFERRAL: `${BASE_URL}/api/referral/redeem`,
};

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('userToken', token);
};

export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('userToken');
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync('userToken');
};

/**
 * Example fetch wrapper with Auth
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const token = await getAuthToken();
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }

    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`[API Timeout] ${endpoint}: Request timed out after 15s`);
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
