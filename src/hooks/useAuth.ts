"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User as AppUser, ClientProfile, ConsultantProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userType: 'client' | 'consultant') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (userType: 'client' | 'consultant') => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<AppUser> | Partial<ConsultantProfile> | Partial<ClientProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthContext(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string): Promise<AppUser | null> => {
    if (!db) {
      console.warn('Firestore not available - demo mode');
      return null;
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as AppUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (
    uid: string,
    email: string,
    displayName: string | null,
    userType: 'client' | 'consultant'
  ): Promise<AppUser> => {
    const now = new Date();
    const baseProfile: AppUser = {
      uid,
      email,
      displayName: displayName || '',
      userType,
      createdAt: now,
      updatedAt: now,
    };

    let profile: AppUser;
    if (userType === 'consultant') {
      profile = {
        ...baseProfile,
        userType: 'consultant',
        services: [],
        specializations: [],
        experience: 0,
        portfolio: [],
        preferredProjectSize: 'any',
        isVerified: false,
        rating: 0,
        completedProjects: 0,
        useAlias: false,
      } as ConsultantProfile;
    } else {
      profile = {
        ...baseProfile,
        userType: 'client',
      } as ClientProfile;
    }

    await setDoc(doc(db, 'users', uid), profile);
    return profile;
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userType: 'client' | 'consultant') => {
    if (!auth) {
      throw new Error('Authentication not available - please configure Firebase');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile
      const profile = await createUserProfile(user.uid, email, user.displayName, userType);
      setUserProfile(profile);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (userType: 'client' | 'consultant') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile exists
      let profile = await fetchUserProfile(user.uid);
      
      if (!profile) {
        // Create new profile if doesn't exist
        profile = await createUserProfile(
          user.uid,
          user.email!,
          user.displayName,
          userType
        );
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<AppUser> | Partial<ConsultantProfile> | Partial<ClientProfile>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'users', user.uid), updatedProfile);
      setUserProfile(updatedProfile);

      // Update display name in auth if provided
      if (data.displayName && data.displayName !== user.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Refresh user profile from Firestore
  const refreshUserProfile = async () => {
    if (!user) return;

    try {
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    refreshUserProfile,
  };
}

export { AuthContext };
