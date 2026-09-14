/**
 * LeaveRequestPage
 * ---
 * - Nhân viên: Gửi đơn nghỉ phép + xem lịch sử cá nhân.
 * - Quản lý/HR: Xem tất cả + duyệt/từ chối đơn chờ xử lý.
 */
import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import leaveService from '../api/leaveService';
import useAuth from '../hooks/useAuth';
import { formatDate, getStatusBadgeClass, getStatusLabel } from '../utils/helpers';

export default function LeaveRequestPage() {
  const { hasRole } = useAuth();
  const isManager = hasRole('MANAGER', 'HR', 'PRESIDENT');
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('my');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dateFrom: '', dateTo: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        viewMode === 'all' && isManager
          ? await leaveService.getAllLeaveRequests(page, 10)
          : await leaveService.getMyLeaveRequests(page, 10);
      setRequests(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [page, viewMode, isManager]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leaveService.createLeaveRequest(form);
      setMessage({ text: 'Gửi đơn nghỉ phép thành công!', type: 'success' });
      setShowForm(false);
      setForm({ dateFrom: '', dateTo: '', reason: '' });
      fetchRequests();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Gửi đơn thất bại.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await leaveService.approveLeaveRequest(id);
      } else {
        await leaveService.rejectLeaveRequest(id);
      }
      setMessage({
        text: `Đã ${action === 'approve' ? 'duyệt' : 'từ chối'} đơn thành công!`,
        type: 'success',
      });
      fetchRequests();
    } catch {
      setMessage({ text: `${action === 'approve' ? 'Duyệt' : 'Từ chối'} đơn thất bại.`, type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 style={{ fontWeight: 700, margin: 0 }}>Nghỉ phép</h4>
        <div className="d-flex gap-2">
          {isManager && (
            <div className="btn-group btn-group-sm">
              <button
                className={`btn ${viewMode === 'my' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => { setViewMode('my'); setPage(0); }}
              >
                Đơn của tôi
              </button>
              <button
                className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => { setViewMode('all'); setPage(0); }}
              >
                Tất cả đơn
              </button>
            </div>
          )}
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => setShowForm(!showForm)}
          >
            <HiOutlinePlus /> Tạo đơn mới
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className="alert py-2 px-3 mb-3"
          style={{
            background:
              message.type === 'success'
                ? 'rgba(6, 214, 160, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${
              message.type === 'success'
                ? 'rgba(6, 214, 160, 0.2)'
                : 'rgba(239, 68, 68, 0.2)'
            }`,
            borderRadius: 'var(--wf-radius)',
            color:
              message.type === 'success' ? 'var(--wf-secondary)' : 'var(--wf-danger)',
            fontSize: '0.85rem',
          }}
        >
          {message.text}
        </div>
      )}

      {/* New Request Form */}
      {showForm && (
        <div className="glass-card p-4 mb-4">
          <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Gửi đơn Nghỉ phép</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Từ ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.dateFrom}
                  onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Đến ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.dateTo}
                  onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Lý do</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Nghỉ phép cá nhân"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đơn'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Requests Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                {viewMode === 'all' && <th>Mã NV</th>}
                <th>Từ ngày</th>
                <th>Đến ngày</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
                {viewMode === 'all' && isManager && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={viewMode === 'all' ? 6 : 4}
                    className="text-center py-4"
                  >
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={viewMode === 'all' ? 6 : 4}
                    className="text-center py-4"
                    style={{ color: 'var(--wf-text-muted)' }}
                  >
                    Không có đơn nghỉ phép nào.
                  </td>
                </tr>
              ) : (
                requests.map((r, i) => (
                  <tr key={i}>
                    {viewMode === 'all' && <td>{r.userId}</td>}
                    <td>{formatDate(r.dateFrom)}</td>
                    <td>{formatDate(r.dateTo)}</td>
                    <td>{r.reason || '—'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(r.status)}`}>
                        {getStatusLabel(r.status)}
                      </span>
                    </td>
                    {viewMode === 'all' && isManager && (
                      <td>
                        {r.status === 'PENDING' && (
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-success btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => handleAction(r.id, 'approve')}
                            >
                              Duyệt
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => handleAction(r.id, 'reject')}
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center p-3">
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    Trước
                  </button>
                </li>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i
                      : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${page === pageNum ? 'active' : ''}`}
                    >
                      <button className="page-link" onClick={() => setPage(pageNum)}>
                        {pageNum + 1}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
