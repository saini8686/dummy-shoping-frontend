import { create } from "zustand";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "../utils/firebase";
import { createUserProfile, getUserProfile } from "../utils/userService";

const useAuthStore = create((set) => ({
  // State
  user: null,
  userProfile: null,
  loading: false,
  error: null,

  // Actions
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userProfile = await createUserProfile(result.user);
      set({ user: result.user, userProfile, loading: false });
      return { user: result.user, userProfile };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUpWithEmailPassword: async (email, password, additionalData = {}) => {
    set({ loading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userProfile = await createUserProfile(result.user, additionalData);
      set({ user: result.user, userProfile, loading: false });
      return { user: result.user, userProfile };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signInWithEmailPassword: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await createUserProfile(result.user);
      set({ user: result.user, userProfile, loading: false });
      return { user: result.user, userProfile };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, userProfile: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchUserProfile: async (uid) => {
    set({ loading: true });
    try {
      const userProfile = await getUserProfile(uid);
      set({ userProfile, loading: false });
      return userProfile;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
