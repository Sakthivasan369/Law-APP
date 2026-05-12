/**
 * Centralized API Client
 * Using EXPO_PUBLIC_ prefix allows Expo to automatically load this variable
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  console.warn("⚠️ EXPO_PUBLIC_API_URL is not defined in .env! API calls will fail.");
}

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  COURSES: `${BASE_URL}/api/courses`,
  STREAM: (id: string) => `${BASE_URL}/api/videos/${id}/stream`,
  PROGRESS: `${BASE_URL}/api/watch/progress`,
};

/**
 * Example fetch wrapper with Auth
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
