import { useState } from 'react';
import { HiOutlineUserAdd } from 'react-icons/hi';
import authService from '../api/authService';
import useAuth from '../hooks/useAuth';
import { getRoleLabel } from '../utils/helpers';

export default function RegisterEmployeeModal({ show, onClose, onSuccess }) {
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    birthday: '',
    address: '',
    role: 'EMPLOYEE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register(formData);
      setSuccess('Đăng ký nhân viên thành công!');
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          phoneNumber: '',
          birthday: '',
          address: '',
          role: 'EMPLOYEE',
        });
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Đã xảy ra lỗi khi đăng ký nhân viên.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = hasRole('PRESIDENT')
    ? ['EMPLOYEE', 'MANAGER', 'HR', 'PRESIDENT']
    : ['EMPLOYEE', 'MANAGER', 'HR'];

  const roleAccent = {
    EMPLOYEE: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', color: 'var(--wf-primary)' },
    MANAGER: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', color: 'var(--wf-warning)' },
    HR: { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)', color: 'var(--wf-accent)' },
    PRESIDENT: { bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' },
  };

  const selectedAccent = roleAccent[formData.role] || roleAccent.EMPLOYEE;

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(0,0,0,0.6)', overflowY: 'auto' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content glass-card border-0">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title d-flex align-items-center gap-2" style={{ fontWeight: 700 }}>
              <HiOutlineUserAdd style={{ color: selectedAccent.color }} />
              Đăng Ký Nhân Viên Mới
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Vai trò <span className="text-danger">*</span></label>
                <div className="row g-2">
                  {roleOptions.map((role) => {
                    const accent = roleAccent[role];
                    const isSelected = formData.role === role;
                    return (
                      <div className="col-6 col-md-3" key={role}>
                        <div
                          onClick={() => setFormData({ ...formData, role })}
                          style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--wf-radius)',
                            border: `2px solid ${isSelected ? accent.color : 'var(--wf-glass-border)'}`,
                            background: isSelected ? accent.bg : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? accent.color : 'var(--wf-text)' }}>
                            {getRoleLabel(role)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Họ và tên <span className="text-danger">*</span></label>
                  <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Mật khẩu <span className="text-danger">*</span></label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Số điện thoại <span className="text-danger">*</span></label>
                  <input type="tel" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} required pattern="^0[0-9]{9}$" title="Phải có 10 chữ số và bắt đầu bằng 0" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Ngày sinh</label>
                  <input type="date" name="birthday" className="form-control" value={formData.birthday} onChange={handleChange} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Địa chỉ</label>
                  <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-light" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
