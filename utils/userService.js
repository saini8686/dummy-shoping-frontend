import { usePathname } from "next/navigation";
import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  uuidv4,
  generateAppId,
} from "./firebase";
const urlParams = new URLSearchParams(window.location.search);
const userRole = urlParams.get("auth");
// Create a new user in Firestore
export async function createUserProfile(user, additionalData = {}) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      // Generate unique identifiers
      const uuid = uuidv4();
      const appId = generateAppId();

      // Prepare user data
      const userData = {
        uuid,
        appId,
        email,
        displayName: displayName || additionalData.displayName || "",
        photoURL: photoURL || "",
        address: additionalData.address || "",
        referralCode: additionalData.referralCode || "",
        createdAt,
        userRole: userRole,
        lastLoginAt: createdAt,
        ...additionalData,
      };

      // Save to Firestore
      await setDoc(userRef, userData);

      return {
        uid: user.uid,
        ...userData,
      };
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  } else {
    // User already exists, update last login time
    try {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      });

      const updatedUserSnap = await getDoc(userRef);
      return {
        uid: user.uid,
        ...updatedUserSnap.data(),
      };
    } catch (error) {
      console.error("Error updating user login time:", error);
      throw error;
    }
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid) {
  if (!uid) return null;

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return {
        uid,
        ...userSnap.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile in Firestore
export async function updateUserProfile(uid, data) {
  if (!uid || !data) return;

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedUserSnap = await getDoc(userRef);
    return {
      uid,
      ...updatedUserSnap.data(),
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
