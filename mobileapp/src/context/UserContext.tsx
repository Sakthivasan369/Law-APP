import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS, getAuthToken } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  occupation: string;
  interests: string;
  wallet_balance: number;
  referral_code: string;
  is_onboarded: boolean;
  role: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  fetchUserProfile: async () => {},
  setUser: () => {},
  clearUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getAuthToken();
      if (!token) {
        setUser(null);
        return;
      }
      const result = await apiRequest(API_ENDPOINTS.ME);
      if (result?.data) {
        setUser(result.data);
      }
    } catch (err: any) {
      console.error('[UserContext] Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  // Auto-fetch on mount if a token exists
  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      if (token) {
        fetchUserProfile();
      }
    })();
  }, [fetchUserProfile]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        fetchUserProfile,
        setUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
