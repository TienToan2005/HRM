/**
 * User Service
 * ---
 * CRUD operations for users/employees.
 * Maps to: /api/v1/users/* endpoints
 */
import api from './axios';

const userService = {
  /** Get current user's profile */
  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  /** Update current user's profile (phone, address, birthday) */
  updateMyProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  /** Change current user's password */
  changePassword: async (data) => {
    const response = await api.patch('/users/me/password', data);
    return response.data.data;
  },

  /** Search users with optional keyword, departmentId, pagination (HR/MANAGER/PRESIDENT) */
  searchUsers: async ({ keyword, departmentId, page = 0, size = 10 } = {}) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (departmentId) params.departmentId = departmentId;
    const response = await api.get('/users', { params });
    return response.data.data;
  },

  /** Get a single user by ID (HR) */
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  /** Create a new user (HR) */
  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  /** Update a user by ID (HR) */
  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  /** Soft-delete a user by ID (HR) */
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  },
};

export default userService;
