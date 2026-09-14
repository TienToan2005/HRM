/**
 * AttendancePage
 * ---
 * - Nhân viên: Chấm công vào/ra + xem lịch sử cá nhân.
 * - HR/Admin: Bảng chấm công toàn công ty.
 */
import { useState, useEffect, useCallback } from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import attendanceService from '../api/attendanceService';
import useAuth from '../hooks/useAuth';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../utils/helpers';

export default function AttendancePage() {
  const { user, hasRole } = useAuth();
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [punchMessage, setPunchMessage] = useState('');
  const [viewMode, setViewMode] = useState('my'); // 'my' or 'all'

  const isHR = hasRole('HR', 'PRESIDENT');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        viewMode === 'all' && isHR
          ? await attendanceService.getAllAttendance(page, 10)
          : await attendanceService.getMyAttendance(page, 10);
      setRecords(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, viewMode, isHR]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handlePunch = async () => {
    setPunching(true);
    setPunchMessage('');
    try {
      const now = new Date().toISOString().slice(0, 19);
      await attendanceService.punch(user.userId, now);
      setPunchMessage('Chấm công thành công!');
      fetchRecords();
    } catch (err) {
      setPunchMessage(err.response?.data?.message || 'Chấm công thất bại.');
    } finally {
      setPunching(false);
      setTimeout(() => setPunchMessage(''), 3000);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 style={{ fontWeight: 700, margin: 0 }}>Chấm công</h4>
        {isHR && (
          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${viewMode === 'my' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => { setViewMode('my'); setPage(0); }}
            >
              Của tôi
            </button>
            <button
              className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => { setViewMode('all'); setPage(0); }}
            >
              Tất cả Nhân viên
            </button>
          </div>
        )}
      </div>

      {/* Clock In/Out Card */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h6 style={{ fontWeight: 700, marginBottom: 4 }}>Chấm công Vào / Ra</h6>
            <p style={{ color: 'var(--wf-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Ghi nhận chấm công hôm nay ({new Date().toLocaleDateString('vi-VN')})
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            {punchMessage && (
              <span
                style={{
                  fontSize: '0.85rem',
                  color: punchMessage.includes('thành công')
                    ? 'var(--wf-secondary)'
                    : 'var(--wf-danger)',
                }}
              >
                {punchMessage}
              </span>
            )}
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handlePunch}
              disabled={punching}
            >
              <HiOutlineClock />
              {punching ? 'Đang ghi nhận...' : 'Chấm công'}
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Ngày</th>
                {viewMode === 'all' && <th>Mã NV</th>}
                <th>Giờ vào</th>
                <th>Giờ ra</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={viewMode === 'all' ? 4 : 3} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={viewMode === 'all' ? 4 : 3}
                    className="text-center py-4"
                    style={{ color: 'var(--wf-text-muted)' }}
                  >
                    Không có bản ghi chấm công nào.
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{formatDate(r.date)}</td>
                    {viewMode === 'all' && <td>{r.userId}</td>}
                    <td>{formatDateTime(r.first_in)}</td>
                    <td>{formatDateTime(r.last_out)}</td>
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
