"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import useAuthStore from "../../store/useAuthStore";

const AuthProvider = ({ children }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Update the Zustand store with the current user
      useAuthStore.setState({ user: currentUser });
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return children;
};

export default AuthProvider;
