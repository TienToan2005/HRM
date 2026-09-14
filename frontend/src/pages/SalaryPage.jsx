/**
 * SalaryPage
 * ---
 * - Nhân viên: Xem phiếu lương theo tháng/năm.
 * - HR: Xem tất cả phiếu lương + tạo bảng lương.
 */
import { useState, useEffect, useCallback } from 'react';
import salaryService from '../api/salaryService';
import useAuth from '../hooks/useAuth';
import { formatCurrency, getStatusBadgeClass, getStatusLabel } from '../utils/helpers';

export default function SalaryPage() {
  const { hasRole } = useAuth();
  const isHR = hasRole('HR', 'PRESIDENT');

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [viewMode, setViewMode] = useState('my');

  // Employee view
  const [mySalary, setMySalary] = useState(null);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState('');

  // HR view
  const [salaries, setSalaries] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allLoading, setAllLoading] = useState(false);

  const [message, setMessage] = useState({ text: '', type: '' });
  const [generating, setGenerating] = useState(false);

  const fetchMySalary = useCallback(async () => {
    setMyLoading(true);
    setMyError('');
    try {
      const data = await salaryService.getMySalary(month, year);
      setMySalary(data);
    } catch {
      setMySalary(null);
      setMyError('Không tìm thấy phiếu lương cho kỳ này.');
    } finally {
      setMyLoading(false);
    }
  }, [month, year]);

  const fetchAllSalaries = useCallback(async () => {
    setAllLoading(true);
    try {
      const data = await salaryService.getAllSalary({ page, size: 10, month, year });
      setSalaries(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setSalaries([]);
    } finally {
      setAllLoading(false);
    }
  }, [month, year, page]);

  useEffect(() => {
    if (viewMode === 'my') {
      fetchMySalary();
    } else {
      fetchAllSalaries();
    }
  }, [viewMode, fetchMySalary, fetchAllSalaries]);

  const handleGenerate = async () => {
    if (!window.confirm(`Tạo bảng lương tháng ${month}/${year} cho tất cả nhân viên?`)) return;
    setGenerating(true);
    try {
      await salaryService.generatePaycheckForAll(month, year);
      setMessage({ text: 'Đã tạo bảng lương thành công!', type: 'success' });
      fetchAllSalaries();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Tạo bảng lương thất bại.',
        type: 'error',
      });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handlePay = async (salaryId) => {
    try {
      await salaryService.paySalary(salaryId);
      setMessage({ text: 'Đã đánh dấu thanh toán!', type: 'success' });
      fetchAllSalaries();
    } catch {
      setMessage({ text: 'Thanh toán thất bại.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 style={{ fontWeight: 700, margin: 0 }}>Bảng lương</h4>
        {isHR && (
          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${viewMode === 'my' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => setViewMode('my')}
            >
              Phiếu lương của tôi
            </button>
            <button
              className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => setViewMode('all')}
            >
              Tất cả Phiếu lương
            </button>
          </div>
        )}
      </div>

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
            color: message.type === 'success' ? 'var(--wf-secondary)' : 'var(--wf-danger)',
            fontSize: '0.85rem',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Month/Year Selector */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-auto">
            <label className="form-label">Tháng</label>
            <select
              className="form-select"
              value={month}
              onChange={(e) => { setMonth(+e.target.value); setPage(0); }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {monthNames[i]}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <label className="form-label">Năm</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => { setYear(+e.target.value); setPage(0); }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = now.getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          {isHR && viewMode === 'all' && (
            <div className="col-auto">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Đang tạo...' : 'Tạo Bảng lương'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* My Payslip View */}
      {viewMode === 'my' && (
        <div className="glass-card p-4">
          {myLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" />
            </div>
          ) : myError ? (
            <p className="text-center py-4" style={{ color: 'var(--wf-text-muted)' }}>
              {myError}
            </p>
          ) : mySalary ? (
            <div className="row g-3">
              {[
                { label: 'Lương cơ bản', value: formatCurrency(mySalary.baseSalary) },
                { label: 'Lương tăng ca', value: formatCurrency(mySalary.overtimePay) },
                { label: 'Phụ cấp', value: formatCurrency(mySalary.allowance) },
                { label: 'Lương nghỉ lễ', value: formatCurrency(mySalary.holidayPay) },
                { label: 'Phạt', value: formatCurrency(mySalary.penalty) },
                { label: 'Trừ vắng mặt', value: formatCurrency(mySalary.absentDeduction) },
                { label: 'Tổng giờ làm', value: mySalary.totalWorkingHours ?? '—' },
                { label: 'Giờ tăng ca', value: mySalary.totalOvertimeHours ?? '—' },
                { label: 'Ngày vắng', value: mySalary.absentDays ?? '—' },
                { label: 'Trạng thái', value: mySalary.status },
              ].map((item) => (
                <div className="col-md-4 col-6" key={item.label}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--wf-text-muted)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {item.label === 'Trạng thái' ? (
                      <span className={`badge ${getStatusBadgeClass(item.value)}`}>
                        {getStatusLabel(item.value)}
                      </span>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              ))}
              <div
                className="col-12 mt-3 pt-3"
                style={{ borderTop: '1px solid var(--wf-glass-border)' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Tổng lương
                  </span>
                  <span
                    style={{ fontSize: '1.5rem', fontWeight: 800 }}
                    className="text-gradient"
                  >
                    {formatCurrency(mySalary.totalSalary)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* All Payslips View (HR) */}
      {viewMode === 'all' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Lương cơ bản</th>
                  <th>Tăng ca</th>
                  <th>Khấu trừ</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {allLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" />
                    </td>
                  </tr>
                ) : salaries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4"
                      style={{ color: 'var(--wf-text-muted)' }}
                    >
                      Không tìm thấy phiếu lương cho kỳ này.
                    </td>
                  </tr>
                ) : (
                  salaries.map((s, i) => (
                    <tr key={i}>
                      <td>#{s.userId}</td>
                      <td>{formatCurrency(s.baseSalary)}</td>
                      <td>{formatCurrency(s.overtimePay)}</td>
                      <td>{formatCurrency(s.penalty)}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(s.totalSalary)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(s.status)}`}>
                          {getStatusLabel(s.status)}
                        </span>
                      </td>
                      <td>
                        {s.status === 'PENDING' && (
                          <button
                            className="btn btn-success btn-sm"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => handlePay(s.id)}
                          >
                            Thanh toán
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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
      )}
    </>
  );
}
