import { create } from "zustand";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "../utils/firebase";

const useAuthStore = create((set) => ({
  // State
  user: null,
  loading: false,
  error: null,

  // Actions
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      set({ user: result.user, loading: false });
      return result.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUpWithEmailPassword: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: result.user, loading: false });
      return result.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signInWithEmailPassword: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({ user: result.user, loading: false });
      return result.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
