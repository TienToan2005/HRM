/**
 * Auth Context
 * ---
 * Provides authentication state and actions to the entire app.
 * Stores accessToken in localStorage, user profile fetched from /users/me.
 */
import { createContext, useState, useEffect, useCallback } from 'react';
import authServiceApi from '../api/authService';
import userService from '../api/userService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Decode role from JWT without an API call */
  const getRoleFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  };

  /** Fetch user profile and set state */
  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await userService.getMyProfile();
      setUser(profile);
    } catch {
      // Token might be invalid — clear everything
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  }, []);

  /** Initialize: check for existing token on mount */
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  /** Login action */
  const login = async (email, password) => {
    const data = await authServiceApi.login(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    await fetchUserProfile();
    return data;
  };

  /** Logout action */
  const logout = async () => {
    try {
      await authServiceApi.logout();
    } catch {
      // Even if the API call fails, clear local state
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  /** Check if the current user has a specific role */
  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    fetchUserProfile,
    getRoleFromToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
