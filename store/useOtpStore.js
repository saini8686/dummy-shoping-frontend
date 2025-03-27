import { create } from "zustand";

const useOtpStore = create((set) => ({
  // State
  email: "",
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,

  // Actions
  setEmail: (email) => set({ email }),

  sendOtp: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      set({ otpSent: true, email, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  verifyOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      set({ otpVerified: true, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  resetOtpState: () =>
    set({
      otpSent: false,
      otpVerified: false,
      error: null,
    }),

  clearError: () => set({ error: null }),
}));

export default useOtpStore;
