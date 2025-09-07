import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Supabase connection test successful');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          throw new Error(`Authentication failed: ${error.message}`);
        }
      }

      console.log('Sign in successful:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign in catch block:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: Profile['role']) => {
    try {
      console.log('Attempting sign up for:', email, 'with role:', role);
      
      // Validate inputs
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long');
        } else {
          throw new Error(`Sign up failed: ${error.message}`);
        }
      }

      // Create profile if user was created
      if (data.user) {
        console.log('Creating profile for user:', data.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          })
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          console.error('Profile error details:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          });
          
          // Clean up the auth user if profile creation fails
          await supabase.auth.admin.deleteUser(data.user.id);
          
          if (profileError.code === 'PGRST116') {
            throw new Error('Database tables not found. Please set up the database schema first.');
          } else if (profileError.code === '42P01') {
            throw new Error('The profiles table does not exist. Please run the database migrations.');
          } else if (profileError.code === '23505') {
            throw new Error('A profile with this email already exists.');
          } else {
            throw new Error(`Failed to create user profile: ${profileError.message || 'Unknown database error'}`);
          }
        }
        
        console.log('Profile created successfully:', profileData);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up catch block:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Sign out catch block:', error);
      return { error };
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile loading error:', error);
        throw error;
      }
      console.log('Profile loaded:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    console.log('Getting initial session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};