/**
 * Salary Service
 * ---
 * View payslips and generate payroll.
 * Maps to: /api/v1/salaries/* endpoints
 */
import api from './axios';

const salaryService = {
  /** Get current user's salary for a given month/year */
  getMySalary: async (month, year) => {
    const response = await api.get('/salaries/me', { params: { month, year } });
    return response.data.data;
  },

  /** Get all salary slips — HR/ADMIN (paginated) */
  getAllSalary: async ({ page = 0, size = 10, month, year }) => {
    const response = await api.get('/salaries', { params: { page, size, month, year } });
    return response.data.data;
  },

  /** Generate paycheck for a single user (HR/ADMIN) */
  generatePaycheck: async (userId, month, year) => {
    const response = await api.post(`/salaries/generate/${userId}`, null, {
      params: { month, year },
    });
    return response.data.data;
  },

  /** Generate paychecks for all employees (HR/ADMIN) */
  generatePaycheckForAll: async (month, year) => {
    const response = await api.post('/salaries/generate-all', null, {
      params: { month, year },
    });
    return response.data;
  },

  /** Mark a salary as PAID (HR/ADMIN) */
  paySalary: async (salaryId) => {
    const response = await api.put(`/salaries/${salaryId}/pay`);
    return response.data.data;
  },
};

export default salaryService;
