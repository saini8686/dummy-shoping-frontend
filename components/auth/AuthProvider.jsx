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
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AuthProvider mounted - setting up auth listener");

    let unsubscribe = () => {};

    try {
      // Set up auth state listener
      unsubscribe = onAuthStateChanged(
        auth,
        async (currentUser) => {
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
        },
        (error) => {
          console.error("Firebase auth error:", error);
          setError(error.message);
          setIsInitialized(true);
        }
      );
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(err.message);
      setIsInitialized(true);
    }

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

  // Show error state if there was a problem initializing Firebase
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <h1 className="text-xl font-bold text-red-500 mb-4">
          Authentication Error
        </h1>
        <p className="mb-4">{error}</p>
        <p className="text-sm text-gray-600">
          Please check your Firebase configuration and try again. If the problem
          persists, contact your administrator.
        </p>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
