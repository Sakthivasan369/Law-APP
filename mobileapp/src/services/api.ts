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
  COURSES: `${BASE_URL}/api/courses`,
  STREAM: (id: string) => `${BASE_URL}/api/videos/${id}/stream`,
  PROGRESS: `${BASE_URL}/api/watch/progress`,
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
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
};
