import {
  db,
  doc,
  generateAppId,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  uuidv4
} from "./firebase";
// Remove all Firebase imports and use only local storage functionality

// Fix window reference issue
export const getUserRole = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("auth") || 'customer';
  }
  return 'customer';
};

// Generate and log OTP instead of sending email
export const generateAndSendOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_otp', otp);
    console.log(`OTP for ${email}: ${otp}`); // Just log to console instead of sending email
  }
  return otp;
};

// Verify OTP
export const verifyOTP = (inputOTP) => {
  if (typeof window !== 'undefined') {
    const storedOTP = localStorage.getItem('current_otp');
    return storedOTP === inputOTP;
  }
  return false;
};

// Replace Firebase functions with local storage
export const createUserProfile = async (userData) => {
  if (typeof window !== 'undefined') {
    const userId = generateLocalId();
    const userWithId = {
      ...userData,
      uid: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`user_${userId}`, JSON.stringify(userWithId));
    // Also store in a users index
    const usersIndex = JSON.parse(localStorage.getItem('users_index') || '[]');
    usersIndex.push(userId);
    localStorage.setItem('users_index', JSON.stringify(usersIndex));
    return userWithId;
  }
  return userData;
};

export const getUserProfile = (uid) => {
  if (typeof window !== 'undefined') {
    if (uid) {
      const profile = localStorage.getItem(`user_${uid}`);
      return profile ? JSON.parse(profile) : null;
    } else {
      // Get current user from auth storage
      const currentUser = localStorage.getItem('auth_user');
      return currentUser ? JSON.parse(currentUser) : null;
    }
  }
  return null;
};

// Update user profile in local storage
export const updateUserProfile = async (uid, data) => {
  if (!uid || !data) return null;

  try {
    if (typeof window !== 'undefined') {
      const existingUser = localStorage.getItem(`user_${uid}`);
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        const updatedUser = {
          ...userData,
          ...data,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(`user_${uid}`, JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Helper function to generate a unique ID
const generateLocalId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
