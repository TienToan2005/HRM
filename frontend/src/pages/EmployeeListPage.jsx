/**
 * EmployeeListPage
 * ---
 * Bảng danh sách nhân viên có phân trang, tìm kiếm và lọc phòng ban.
 * GET /users?keyword=&departmentId=&page=&size=
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import RegisterEmployeeModal from '../components/RegisterEmployeeModal';
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';
import userService from '../api/userService';
import departmentService from '../api/departmentService';
import { getRoleLabel } from '../utils/helpers';
import useAuth from '../hooks/useAuth';

export default function EmployeeListPage() {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.searchUsers({
        keyword: keyword || undefined,
        departmentId: departmentId || undefined,
        page,
        size: 10,
      });
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, departmentId, page]);

  // Fetch departments for filter dropdown
  useEffect(() => {
    departmentService
      .searchDepartments({ size: 100 })
      .then((data) => setDepartments(data.content || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 style={{ fontWeight: 700, margin: 0 }}>Nhân viên</h4>
        {hasRole('HR', 'PRESIDENT') && (
          <button 
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => setShowCreateModal(true)}
          >
            <HiOutlinePlus /> Thêm Nhân viên
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="position-relative">
              <HiOutlineSearch
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--wf-text-muted)',
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo tên hoặc email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Tất cả Phòng ban</option>
              {departments.map((d, i) => (
                <option key={i} value={d.id || i}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4"
                    style={{ color: 'var(--wf-text-muted)' }}
                  >
                    Không tìm thấy nhân viên nào.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.userId}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background:
                              'linear-gradient(135deg, var(--wf-primary), var(--wf-accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            color: '#fff',
                            flexShrink: 0,
                          }}
                        >
                          {u.fullName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--wf-text-muted)' }}>{u.email}</td>
                    <td>{u.departmentName || '—'}</td>
                    <td>{u.positionName || '—'}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: 'var(--wf-primary)',
                        }}
                      >
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/dashboard/employees/${u.userId}`}
                        className="btn btn-sm btn-outline-light"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Xem
                      </Link>
                    </td>
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
                <li
                  className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}
                >
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal Đăng Ký Nhân Viên */}
      <RegisterEmployeeModal 
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setPage(0);
          fetchUsers();
        }}
      />
    </>
  );
}
