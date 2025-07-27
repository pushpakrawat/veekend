import { create } from 'zustand';
import { User } from 'firebase/auth';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser, onAuthStateChange } from '@/lib/firebase';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithGoogle();
      set({ isLoading: false });
    } catch (error) {
      console.error('Google sign in error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in with Google',
        isLoading: false 
      });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmail(email, password);
      set({ isLoading: false });
    } catch (error) {
      console.error('Email sign in error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in with email',
        isLoading: false 
      });
    }
  },

  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      await signUpWithEmail(email, password, displayName);
      set({ isLoading: false });
    } catch (error) {
      console.error('Email sign up error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign up with email',
        isLoading: false 
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOutUser();
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isLoading: false 
      });
    }
  },

  initializeAuth: () => {
    set({ isLoading: true });
    
    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      set({ 
        user, 
        isLoading: false, 
        isInitialized: true,
        error: null 
      });
    });

    return unsubscribe;
  },

  clearError: () => {
    set({ error: null });
  },
}));
