import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/database';
import { db } from '@/lib/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: Profile['role']) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('current_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Get all profiles from local database
      const profiles = await db.select<Profile>('profiles');
      const profile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      
      if (!profile) {
        return { error: { message: 'User not found. Please check your email or sign up.' } };
      }

      if (!profile.is_active) {
        return { error: { message: 'Account is deactivated. Please contact administrator.' } };
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password for existing users
      if (password.length < 6) {
        return { error: { message: 'Invalid password. Password must be at least 6 characters.' } };
      }

      // Store user session
      await AsyncStorage.setItem('current_user', JSON.stringify(profile));
      setUser(profile);
      
      console.log('Sign in successful:', profile.email);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'Sign in failed. Please try again.' } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: Profile['role']) => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!email || !password || !fullName) {
        return { error: { message: 'All fields are required.' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters long.' } };
      }
      
      if (!email.includes('@')) {
        return { error: { message: 'Please enter a valid email address.' } };
      }

      // Check if user already exists
      const existingProfiles = await db.select<Profile>('profiles');
      const existingUser = existingProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        return { error: { message: 'An account with this email already exists.' } };
      }

      // Create new profile
      const newProfile = await db.insert<Profile>('profiles', {
        email: email.toLowerCase(),
        full_name: fullName,
        role,
        is_active: true,
      });

      // Store user session
      await AsyncStorage.setItem('current_user', JSON.stringify(newProfile));
      setUser(newProfile);
      
      console.log('Sign up successful:', newProfile.email);
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: { message: 'Sign up failed. Please try again.' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('current_user');
      setUser(null);
      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: { message: 'Sign out failed. Please try again.' } };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in.' } };
      }

      const updatedProfile = await db.update<Profile>('profiles', user.id, updates);
      if (updatedProfile) {
        await AsyncStorage.setItem('current_user', JSON.stringify(updatedProfile));
        setUser(updatedProfile);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: { message: 'Failed to update profile.' } };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}