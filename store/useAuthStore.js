import { create } from "zustand";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
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
      await firebaseSignOut(auth);
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

  resetPassword: async (email, newPassword) => {
    set({ loading: true, error: null });
    try {
      // For the regular "forgot password" flow without a new password
      if (!newPassword) {
        await sendPasswordResetEmail(auth, email);
        set({ loading: false });
        return true;
      }

      // For OTP verified password reset (handled through custom logic)
      // In a real app, you'd validate the OTP before allowing this
      const user = auth.currentUser;

      if (!user) {
        // Handle specific logic for non-logged in users (after OTP verification)
        // This would typically involve a custom backend endpoint
        // For this example, we'll just show how to handle logged-in users
        set({
          error: "User must be logged in to reset password",
          loading: false,
        });
        throw new Error("User must be logged in to reset password");
      }

      // Update the password for a logged-in user
      await firebaseUpdatePassword(user, newPassword);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePassword: async (currentPassword, newPassword, verifyOnly = false) => {
    set({ loading: true, error: null });
    try {
      const user = auth.currentUser;

      if (!user) {
        set({
          error: "User must be logged in to update password",
          loading: false,
        });
        throw new Error("User must be logged in to update password");
      }

      if (!user.email) {
        set({
          error: "User must have an email to update password",
          loading: false,
        });
        throw new Error("User must have an email to update password");
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // If only verifying current password, we're done
      if (verifyOnly) {
        set({ loading: false });
        return true;
      }

      // Update the password
      await firebaseUpdatePassword(user, newPassword);
      set({ loading: false });
      return true;
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
