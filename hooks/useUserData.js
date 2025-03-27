import { useEffect, useState } from "react";
import {
  db,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "../utils/firebase";
import useAuthStore from "../store/useAuthStore";

// Custom hook to fetch and sync user data
const useUserData = () => {
  const { user, userProfile, setUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data by UID (when already authenticated)
  const fetchUserByUid = async (uid) => {
    setLoading(true);
    setError(null);

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = {
          uid,
          ...userSnap.data(),
        };
        setUserProfile(userData);
        return userData;
      }

      return null;
    } catch (err) {
      console.error("Error fetching user data by UID:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data by email (when email is known but not logged in)
  const fetchUserByEmail = async (email) => {
    if (!email) return null;

    setLoading(true);
    setError(null);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userData = {
          uid: doc.id,
          ...doc.data(),
        };
        return userData;
      }

      return null;
    } catch (err) {
      console.error("Error fetching user data by email:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sync user data when auth state changes
  useEffect(() => {
    if (user && !userProfile) {
      fetchUserByUid(user.uid);
    }
  }, [user, userProfile]);

  return {
    userProfile,
    loading,
    error,
    fetchUserByUid,
    fetchUserByEmail,
  };
};

export default useUserData;
