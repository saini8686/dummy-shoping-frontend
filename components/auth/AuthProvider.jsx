"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import useAuthStore from "../../store/useAuthStore";
import useUserStore from "../../store/useUserStore";

const AuthProvider = ({ children }) => {
  const { setUser } = useAuthStore();
  const { fetchUserByUid, setUserData, clearUserData } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("AuthProvider mounted - setting up auth listener");

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(
        "Auth state changed:",
        currentUser ? `User ${currentUser.uid}` : "No user"
      );

      // Update the Zustand auth store with the current user
      setUser(currentUser);

      // If user is logged in, fetch their profile from Firestore
      if (currentUser) {
        try {
          console.log("Fetching user data for:", currentUser.uid);
          // Fetch user data and update user store
          const userData = await fetchUserByUid(currentUser.uid);

          if (!userData) {
            console.warn(
              "No user data found in Firestore for:",
              currentUser.uid
            );
            // You could create a default profile here if needed
          } else {
            console.log("User data fetched successfully:", userData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        // Clear user data if not logged in
        console.log("Clearing user data as no user is logged in");
        clearUserData();
      }

      // Mark auth as initialized
      setIsInitialized(true);
    });

    // Clean up subscription on unmount
    return () => {
      console.log("AuthProvider unmounting - unsubscribing");
      unsubscribe();
    };
  }, [setUser, fetchUserByUid, setUserData, clearUserData]);

  // Show loading state until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
