/**
 * Department Service
 * ---
 * CRUD operations for departments.
 * Maps to: /api/v1/departments/* endpoints
 */
import api from './axios';

const departmentService = {
  /** Search departments with optional keyword, pagination */
  searchDepartments: async ({ keyword, page = 0, size = 10 } = {}) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    const response = await api.get('/departments', { params });
    return response.data.data;
  },

  /** Create a new department (HR/ADMIN) */
  createDepartment: async (data) => {
    const response = await api.post('/departments', data);
    return response.data.data;
  },

  /** Update a department (HR/ADMIN) */
  updateDepartment: async (id, data) => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.data;
  },

  /** Delete a department (HR/ADMIN) */
  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};

export default departmentService;
