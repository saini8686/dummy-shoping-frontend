import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  signInWithEmailPassword: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Mock authentication
      const mockUser = { email, id: Date.now() };
      localStorage.setItem('user', JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUpWithEmailPassword: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Mock registration
      const mockUser = { email, id: Date.now() };
      localStorage.setItem('user', JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  signOut: () => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('userRole');
    Cookies.remove('userId');
    set({ user: null, isAuthenticated: false, error: null });
  },

  initialize: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      set({ user: JSON.parse(storedUser), isAuthenticated: true });
    }
  }
}));

export default useAuthStore;
