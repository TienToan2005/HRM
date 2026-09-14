/**
 * Attendance Service
 * ---
 * Punch clock, attendance records, and correction requests.
 * Maps to: /api/v1/attendance/* endpoints
 */
import api from './axios';

const attendanceService = {
  /** Submit a raw punch (clock-in / clock-out) */
  punch: async (userId, punchTime) => {
    const response = await api.post('/attendance/punch', { userId, punchTime });
    return response.data;
  },

  /** Get current user's attendance records (paginated) */
  getMyAttendance: async (page = 0, size = 10) => {
    const response = await api.get('/attendance/me', { params: { page, size } });
    return response.data.data;
  },

  /** Get all attendance records — HR/ADMIN only (paginated) */
  getAllAttendance: async (page = 0, size = 10) => {
    const response = await api.get('/attendance', { params: { page, size } });
    return response.data.data;
  },

  /** Submit a punch correction request */
  submitCorrectionRequest: async (data) => {
    const response = await api.post('/attendance/requests', data);
    return response.data;
  },

  /** Approve a punch correction request (MANAGER/HR/ADMIN) */
  approveCorrectionRequest: async (id) => {
    const response = await api.put(`/attendance/requests/${id}/approve`);
    return response.data;
  },

  /** Reject a punch correction request (MANAGER/HR/ADMIN) */
  rejectCorrectionRequest: async (id) => {
    const response = await api.put(`/attendance/requests/${id}/reject`);
    return response.data;
  },

  /** Trigger manual recalculation for a specific date (HR/ADMIN) */
  recalculate: async (targetDate) => {
    const response = await api.post('/attendance/recalculate', null, {
      params: { targetDate },
    });
    return response.data;
  },
};

export default attendanceService;
