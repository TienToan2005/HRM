/**
 * MyProfilePage
 * ---
 * Trang hồ sơ cá nhân: xem, cập nhật thông tin, đổi mật khẩu.
 */
import { useState, useEffect } from 'react';
import userService from '../api/userService';
import useAuth from '../hooks/useAuth';
import { getRoleLabel, formatDate } from '../utils/helpers';

export default function MyProfilePage() {
  const { user, fetchUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: '',
    address: '',
    birthday: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Change password
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        birthday: user.birthday || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateMyProfile(form);
      await fetchUserProfile();
      setEditing(false);
      setMessage({ text: 'Cập nhật hồ sơ thành công!', type: 'success' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Cập nhật hồ sơ thất bại.',
        type: 'error',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setMessage({ text: 'Mật khẩu mới không khớp.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return;
    }
    setPwSaving(true);
    try {
      await userService.changePassword(pwForm);
      setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
      setShowPwForm(false);
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Đổi mật khẩu thất bại.',
        type: 'error',
      });
    } finally {
      setPwSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  if (!user) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <>
      <h4 style={{ fontWeight: 700 }} className="mb-4">
        Hồ sơ cá nhân
      </h4>

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

      <div className="glass-card p-4 mb-4">
        <div className="row g-4">
          {/* Avatar */}
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
              {user.fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <h6 style={{ fontWeight: 700 }}>{user.fullName}</h6>
            <span
              className="badge"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--wf-primary)',
              }}
            >
              {getRoleLabel(user.role)}
            </span>
            <div
              className="mt-2"
              style={{ color: 'var(--wf-text-muted)', fontSize: '0.85rem' }}
            >
              {user.departmentName || 'Chưa có Phòng ban'}
            </div>
          </div>

          {/* Info */}
          <div className="col-md-9">
            {editing ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.birthday}
                    onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
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
                    onClick={() => setEditing(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {[
                    { label: 'Email', value: user.email },
                    { label: 'Số điện thoại', value: user.phoneNumber },
                    { label: 'Địa chỉ', value: user.address },
                    { label: 'Ngày sinh', value: formatDate(user.birthday) },
                    { label: 'Phòng ban', value: user.departmentName },
                    { label: 'Chức vụ', value: user.positionName },
                  ].map((item) => (
                    <div className="col-md-6" key={item.label}>
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
                      <div style={{ fontWeight: 500 }}>{item.value || '—'}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setEditing(true)}
                  >
                    Chỉnh sửa Hồ sơ
                  </button>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setShowPwForm(!showPwForm)}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      {showPwForm && (
        <div className="glass-card p-4">
          <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Đổi mật khẩu</h6>
          <form onSubmit={handleChangePassword}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwForm.oldPassword}
                  onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={pwSaving}
                >
                  {pwSaving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={() => setShowPwForm(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
