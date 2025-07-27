import { create } from 'zustand';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOutUser, onAuthStateChange, handleRedirectResult } from '@/lib/firebase';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  signIn: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in',
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
    // Handle redirect result on app startup
    handleRedirectResult().then((result) => {
      if (result?.user) {
        set({ user: result.user, isLoading: false });
      }
    }).catch((error) => {
      console.error('Redirect result error:', error);
      set({ error: error.message, isLoading: false });
    });

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
