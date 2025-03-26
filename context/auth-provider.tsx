'use client';

import { createContext, useContext } from 'react';

import useAuth from '@/hooks/use-auth';

type UserType = {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  userPreferences: {
    enable2FA: boolean;
    emailNotification: boolean;
    _id: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

type AuthContextType = {
  user?: UserType;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();

  const user = data?.data;

  return (
    <AuthContext.Provider
      value={{ user, error, isLoading, isFetching, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
