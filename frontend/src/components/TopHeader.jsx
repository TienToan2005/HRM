/**
 * TopHeader Component
 * ---
 * Thanh tiêu đề trên cùng với thông tin người dùng và nút đăng xuất.
 */
import { HiOutlineMenu, HiOutlineLogout } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import { getRoleLabel } from '../utils/helpers';

export default function TopHeader({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-topbar">
      <div className="d-flex align-items-center gap-3">
        {/* Mobile toggle */}
        <button
          className="btn d-lg-none p-0"
          style={{ color: 'var(--wf-text)', fontSize: '1.3rem' }}
          onClick={onToggleSidebar}
          aria-label="Mở/đóng menu"
        >
          <HiOutlineMenu />
        </button>
        <h5
          className="mb-0 d-none d-sm-block"
          style={{ fontWeight: 700, fontSize: '1.1rem' }}
        >
          Tổng quan
        </h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* User Info */}
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, var(--wf-primary), var(--wf-accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#fff',
            }}
          >
            {user?.fullName
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'U'}
          </div>
          <div className="d-none d-md-block">
            <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
              {user?.fullName || 'Người dùng'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--wf-text-muted)' }}>
              {getRoleLabel(user?.role)}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-sm"
          style={{
            color: 'var(--wf-text-muted)',
            border: '1px solid var(--wf-glass-border)',
            borderRadius: 'var(--wf-radius)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onClick={handleLogout}
        >
          <HiOutlineLogout />
          <span className="d-none d-sm-inline">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
