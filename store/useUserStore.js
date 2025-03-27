import { create } from "zustand";
import {
  db,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "../utils/firebase";

// Helper function to safely convert Firestore timestamps to Date objects
const processFirestoreData = (data) => {
  if (!data) return null;

  // Create a copy to avoid modifying the original
  const processedData = { ...data };

  // Convert Firestore Timestamps to Date objects or ISO strings
  Object.keys(processedData).forEach((key) => {
    const value = processedData[key];

    // Check if it's a Firestore Timestamp
    if (
      value &&
      typeof value === "object" &&
      value.toDate &&
      typeof value.toDate === "function"
    ) {
      // Convert to ISO string for easier handling
      processedData[key] = value.toDate().toISOString();
    }
  });

  return processedData;
};

const useUserStore = create((set, get) => ({
  // State
  userData: null,
  loading: false,
  error: null,

  // Actions
  fetchUserByUid: async (uid) => {
    if (!uid) return null;

    set({ loading: true, error: null });
    console.log("UserStore: Fetching user data by UID:", uid);

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const rawData = userSnap.data();
        const userData = processFirestoreData({
          uid,
          ...rawData,
        });
        set({ userData, loading: false });
        return userData;
      }

      console.log("UserStore: No user data found for UID:", uid);
      set({ userData: null, loading: false });
      return null;
    } catch (err) {
      console.error("UserStore: Error fetching user data by UID:", err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  fetchUserByEmail: async (email) => {
    if (!email) return null;

    set({ loading: true, error: null });
    console.log("UserStore: Fetching user data by email:", email);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const rawData = userDoc.data();

        // Process Firestore data to handle timestamps
        const userData = processFirestoreData({
          uid: userDoc.id,
          ...rawData,
        });

        console.log("UserStore: Found user data by email:", userData);
        set({ userData, loading: false });
        return userData;
      }

      console.log("UserStore: No user found with email:", email);
      set({ userData: null, loading: false });
      return null;
    } catch (err) {
      console.error("UserStore: Error fetching user data by email:", err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  updateUserData: async (uid, data) => {
    if (!uid || !data) return null;

    set({ loading: true, error: null });
    console.log("UserStore: Updating user data for:", uid, data);

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      // Fetch the updated user data
      const updatedUserSnap = await getDoc(userRef);

      if (updatedUserSnap.exists()) {
        const rawData = updatedUserSnap.data();

        // Process Firestore data to handle timestamps
        const updatedUserData = processFirestoreData({
          uid,
          ...rawData,
        });

        console.log(
          "UserStore: User data updated successfully:",
          updatedUserData
        );
        set({ userData: updatedUserData, loading: false });
        return updatedUserData;
      }

      return null;
    } catch (err) {
      console.error("UserStore: Error updating user data:", err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  setUserData: (userData) => {
    console.log("UserStore: Setting user data manually:", userData);
    set({ userData });
  },

  clearUserData: () => {
    console.log("UserStore: Clearing user data");
    set({ userData: null });
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
