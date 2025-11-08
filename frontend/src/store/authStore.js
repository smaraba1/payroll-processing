import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: authService.isAuthenticated(),

  login: async (email, password) => {
    try {
      const response = await authService.login(email, password);
      authService.setAuth(response.token, {
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      });
      set({
        user: {
          id: response.userId,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
        },
        token: response.token,
        isAuthenticated: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hasRole: (role) => {
    const state = useAuthStore.getState();
    return state.user?.role === role;
  },

  hasAnyRole: (roles) => {
    const state = useAuthStore.getState();
    return roles.includes(state.user?.role);
  },
}));

