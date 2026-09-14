/**
 * Auth Service
 * ---
 * Handles login, logout, and token refresh.
 * Maps to: /api/v1/auth/* endpoints
 */
import api from './axios';

const authService = {
  /**
   * Login with email and password.
   * Backend sets refreshToken as httpOnly cookie; returns accessToken in body.
   * @param {string} email
   * @param {string} password
   * @returns {{ accessToken: string, authenticated: boolean }}
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  /**
   * Register a new employee (HR only).
   * @param {{ fullName, password, email, phoneNumber, birthday, address }} data
   * @returns {{ userId, email, role }}
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  /**
   * Refresh the access token using the httpOnly cookie.
   * @returns {{ accessToken: string, authenticated: boolean }}
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data.data;
  },

  /**
   * Logout — revokes refresh token and clears cookie.
   */
  logout: async () => {
    await api.post('/auth/refresh/logout');
  },
};

export default authService;
