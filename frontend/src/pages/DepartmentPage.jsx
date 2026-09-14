/**
 * DepartmentPage
 * ---
 * Danh sách phòng ban với CRUD cho HR.
 */
import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import departmentService from '../api/departmentService';
import useAuth from '../hooks/useAuth';

export default function DepartmentPage() {
  const { hasRole } = useAuth();
  const isHR = hasRole('HR', 'PRESIDENT');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await departmentService.searchDepartments({
        keyword: keyword || undefined,
        page,
        size: 10,
      });
      setDepartments(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setEditingId(dept.id);
    setForm({ name: dept.name, description: dept.description || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await departmentService.updateDepartment(editingId, form);
        setMessage({ text: 'Cập nhật phòng ban thành công!', type: 'success' });
      } else {
        await departmentService.createDepartment(form);
        setMessage({ text: 'Tạo phòng ban thành công!', type: 'success' });
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Thao tác thất bại.',
        type: 'error',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) return;
    try {
      await departmentService.deleteDepartment(id);
      setMessage({ text: 'Đã xóa phòng ban.', type: 'success' });
      fetchDepartments();
    } catch {
      setMessage({ text: 'Xóa phòng ban thất bại.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 style={{ fontWeight: 700, margin: 0 }}>Phòng ban</h4>
        {isHR && (
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={openCreate}
          >
            <HiOutlinePlus /> Thêm Phòng ban
          </button>
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

      {/* Search */}
      <div className="glass-card p-3 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm phòng ban..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
        />
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Tên Phòng ban</th>
                <th>Mô tả</th>
                <th>Thành viên</th>
                {isHR && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isHR ? 4 : 3} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={isHR ? 4 : 3}
                    className="text-center py-4"
                    style={{ color: 'var(--wf-text-muted)' }}
                  >
                    Không tìm thấy phòng ban nào.
                  </td>
                </tr>
              ) : (
                departments.map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td style={{ color: 'var(--wf-text-muted)' }}>
                      {d.description || '—'}
                    </td>
                    <td>{d.ListUserId?.length ?? 0}</td>
                    {isHR && (
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-light"
                            onClick={() => openEdit(d)}
                          >
                            <HiOutlinePencil />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(d.id)}
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </td>
                    )}
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
                  <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                </li>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pn = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                  return (
                    <li key={pn} className={`page-item ${page === pn ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(pn)}>{pn + 1}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontWeight: 700 }}>
                  {editingId ? 'Chỉnh sửa Phòng ban' : 'Phòng ban mới'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
