/**
 * Leave Request Service
 * ---
 * Create, view, approve, and reject leave requests.
 * Maps to: /api/v1/leave-requests/* endpoints
 */
import api from './axios';

const leaveService = {
  /** Create a new leave request (EMPLOYEE) */
  createLeaveRequest: async ({ dateFrom, dateTo, reason }) => {
    const response = await api.post('/leave-requests', { dateFrom, dateTo, reason });
    return response.data.data;
  },

  /** Get current user's leave requests (paginated) */
  getMyLeaveRequests: async (page = 0, size = 10) => {
    const response = await api.get('/leave-requests/me', { params: { page, size } });
    return response.data.data;
  },

  /** Get all leave requests — MANAGER/HR/ADMIN (paginated) */
  getAllLeaveRequests: async (page = 0, size = 10) => {
    const response = await api.get('/leave-requests', { params: { page, size } });
    return response.data.data;
  },

  /** Approve a leave request (MANAGER/HR/ADMIN) */
  approveLeaveRequest: async (id) => {
    const response = await api.put(`/leave-requests/${id}/approve`);
    return response.data.data;
  },

  /** Reject a leave request (MANAGER/HR/ADMIN) */
  rejectLeaveRequest: async (id) => {
    const response = await api.put(`/leave-requests/${id}/reject`);
    return response.data.data;
  },
};

export default leaveService;
