/**
 * EmployeeDetailPage
 * ---
 * Xem và chỉnh sửa hồ sơ nhân viên (chỉ HR).
 * GET /users/:id, PUT /users/:id, DELETE /users/:id
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../api/userService';
import { getRoleLabel, formatDate } from '../utils/helpers';
import useAuth from '../hooks/useAuth';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await userService.getUser(id);
        setEmployee(data);
        setForm(data);
      } catch {
        setError('Không thể tải thông tin nhân viên.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await userService.updateUser(id, {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        birthday: form.birthday,
        role: form.role,
        password: form.password || undefined,
      });
      setEmployee(updated);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật nhân viên thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn vô hiệu hóa nhân viên này?')) return;
    try {
      await userService.deleteUser(id);
      navigate('/dashboard/employees');
    } catch {
      setError('Xóa nhân viên thất bại.');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="glass-card p-4 text-center">
        <p style={{ color: 'var(--wf-text-muted)' }}>Không tìm thấy nhân viên.</p>
      </div>
    );
  }

  const fields = [
    { key: 'fullName', label: 'Họ và tên', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phoneNumber', label: 'Số điện thoại', type: 'text' },
    { key: 'address', label: 'Địa chỉ', type: 'text' },
    { key: 'birthday', label: 'Ngày sinh', type: 'date' },
  ];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <button
            className="btn btn-sm btn-outline-light mb-2"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
          <h4 style={{ fontWeight: 700, margin: 0 }}>Chi tiết Nhân viên</h4>
        </div>
        {hasRole('HR') && !editing && (
          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
              Chỉnh sửa
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Vô hiệu hóa
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          className="alert py-2 px-3 mb-3"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--wf-radius)',
            color: 'var(--wf-danger)',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      <div className="glass-card p-4">
        <div className="row g-4">
          {/* Avatar & Role */}
          <div className="col-md-3 text-center">
            <div
              className="mx-auto mb-3"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--wf-primary), var(--wf-accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: '#fff',
              }}
            >
              {employee.fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <h6 style={{ fontWeight: 700 }}>{employee.fullName}</h6>
            <span
              className="badge"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--wf-primary)',
              }}
            >
              {getRoleLabel(employee.role)}
            </span>
            <div
              className="mt-2"
              style={{ color: 'var(--wf-text-muted)', fontSize: '0.85rem' }}
            >
              {employee.departmentName || 'Chưa có Phòng ban'}
              {employee.positionName && ` · ${employee.positionName}`}
            </div>
          </div>

          {/* Details */}
          <div className="col-md-9">
            {editing ? (
              <div className="row g-3">
                {fields.map((f) => (
                  <div className="col-md-6" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input
                      type={f.type}
                      className="form-control"
                      value={form[f.key] || ''}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <div className="col-md-6">
                  <label className="form-label">Vai trò</label>
                  <select
                    className="form-select"
                    value={form.role || ''}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {['EMPLOYEE', 'MANAGER', 'HR', 'PRESIDENT'].map((r) => (
                      <option key={r} value={r}>
                        {getRoleLabel(r)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 d-flex gap-2 mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      setForm(employee);
                      setEditing(false);
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {[
                  { label: 'Email', value: employee.email },
                  { label: 'Số điện thoại', value: employee.phoneNumber },
                  { label: 'Địa chỉ', value: employee.address },
                  { label: 'Ngày sinh', value: formatDate(employee.birthday) },
                  { label: 'Phòng ban', value: employee.departmentName },
                  { label: 'Chức vụ', value: employee.positionName },
                ].map((item) => (
                  <div className="col-md-6" key={item.label}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--wf-text-muted)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontWeight: 500 }}>{item.value || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
