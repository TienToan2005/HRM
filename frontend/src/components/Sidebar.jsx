/**
 * Sidebar Component
 * ---
 * Thanh điều hướng bên trái với menu theo phân quyền.
 */
import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
} from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

export default function Sidebar({ show, onClose }) {
  const { hasRole } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      icon: <HiOutlineHome />,
      label: 'Tổng quan',
      end: true,
      show: true,
    },
    {
      to: '/dashboard/employees',
      icon: <HiOutlineUserGroup />,
      label: 'Nhân viên',
      show: hasRole('HR', 'MANAGER', 'PRESIDENT'),
    },

    {
      to: '/dashboard/attendance',
      icon: <HiOutlineClock />,
      label: 'Chấm công',
      show: true,
    },
    {
      to: '/dashboard/leave-requests',
      icon: <HiOutlineCalendar />,
      label: 'Nghỉ phép',
      show: true,
    },
    {
      to: '/dashboard/salaries',
      icon: <HiOutlineCurrencyDollar />,
      label: 'Bảng lương',
      show: true,
    },
    {
      to: '/dashboard/departments',
      icon: <HiOutlineOfficeBuilding />,
      label: 'Phòng ban',
      show: hasRole('HR', 'PRESIDENT'),
    },
    {
      to: '/dashboard/profile',
      icon: <HiOutlineUser />,
      label: 'Hồ sơ cá nhân',
      show: true,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {show && (
        <div
          className="d-lg-none"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1039,
          }}
          onClick={onClose}
        />
      )}

      <aside className={`dashboard-sidebar ${show ? 'show' : ''}`}>
        {/* Logo */}
        <div
          className="d-flex align-items-center px-3 py-3"
          style={{ borderBottom: '1px solid var(--wf-glass-border)' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                'linear-gradient(135deg, var(--wf-primary), var(--wf-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#fff',
              marginRight: 10,
            }}
          >
            W
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
            WorkFlow <span style={{ color: 'var(--wf-secondary)' }}>HR</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="py-3">
          <div
            className="px-4 mb-2"
            style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--wf-text-muted)',
              fontWeight: 600,
            }}
          >
            Menu chính
          </div>
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
}
