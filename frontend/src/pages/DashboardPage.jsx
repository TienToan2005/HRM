/**
 * DashboardPage
 * ---
 * Trang tổng quan với các thẻ KPI hiển thị chỉ số HR chính.
 * Giao diện khác nhau theo vai trò: EMPLOYEE, MANAGER, HR, PRESIDENT.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineUserAdd,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineChartBar,
} from 'react-icons/hi';
import KPICard from '../components/KPICard';
import useAuth from '../hooks/useAuth';
import userService from '../api/userService';
import leaveService from '../api/leaveService';
import { getRoleLabel } from '../utils/helpers';

/* ── Role color mapping ───────────────────────────────────── */
const roleConfig = {
  EMPLOYEE: {
    gradient: 'linear-gradient(135deg, #3b82f6, #06d6a0)',
    accentColor: 'var(--wf-primary)',
    greeting: 'Chào bạn',
    subtitle: 'Đây là tình hình công việc của bạn hôm nay.',
  },
  MANAGER: {
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    accentColor: 'var(--wf-warning)',
    greeting: 'Xin chào Quản lý',
    subtitle: 'Tổng quan tình hình đội nhóm của bạn.',
  },
  HR: {
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    accentColor: 'var(--wf-accent)',
    greeting: 'Xin chào HR',
    subtitle: 'Tổng quan quản lý nhân sự toàn công ty.',
  },
  PRESIDENT: {
    gradient: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    accentColor: '#06b6d4',
    greeting: 'Kính chào Giám đốc',
    subtitle: 'Báo cáo tổng quan hoạt động toàn công ty.',
  },
};

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: null,
    pendingLeaves: null,
    todayPresent: null,
    thisMonthPayroll: null,
  });
  const [loading, setLoading] = useState(true);

  const config = roleConfig[user?.role] || roleConfig.EMPLOYEE;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const promises = [];

        // HR/Manager/President can see total employees
        if (hasRole('HR', 'MANAGER', 'PRESIDENT')) {
          promises.push(
            userService
              .searchUsers({ page: 0, size: 1 })
              .then((data) => ({ totalEmployees: data.totalElements }))
              .catch(() => ({ totalEmployees: '—' }))
          );

          promises.push(
            leaveService
              .getAllLeaveRequests(0, 1)
              .then((data) => ({
                pendingLeaves: data.content?.filter((l) => l.status === 'PENDING').length ?? '—',
              }))
              .catch(() => ({ pendingLeaves: '—' }))
          );
        }

        const results = await Promise.all(promises);
        const merged = results.reduce((acc, r) => ({ ...acc, ...r }), {});
        setStats((prev) => ({ ...prev, ...merged }));
      } catch {
        // Fail gracefully — KPI cards show '—'
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [hasRole]);

  /* ── KPI cards per role ─────────────────────────────── */
  const kpis = [
    {
      icon: <HiOutlineUserGroup />,
      label: 'Tổng Nhân viên',
      value: stats.totalEmployees,
      color: 'var(--wf-primary)',
      show: hasRole('HR', 'MANAGER', 'PRESIDENT'),
    },
    {
      icon: <HiOutlineCalendar />,
      label: 'Đơn Nghỉ phép Chờ duyệt',
      value: stats.pendingLeaves,
      color: 'var(--wf-warning)',
      show: hasRole('HR', 'MANAGER', 'PRESIDENT'),
    },
    {
      icon: <HiOutlineClock />,
      label: 'Chấm công Hôm nay',
      value: stats.todayPresent ?? '—',
      color: 'var(--wf-secondary)',
      show: true,
    },
    {
      icon: <HiOutlineCurrencyDollar />,
      label: 'Trạng thái Bảng lương',
      value: stats.thisMonthPayroll ?? '—',
      color: 'var(--wf-accent)',
      show: hasRole('HR', 'PRESIDENT'),
    },
  ];

  /* ── Quick actions per role ────────────────────────── */
  const quickActions = [
    // Common to all
    { to: '/dashboard/attendance', icon: <HiOutlineClock />, label: 'Chấm công', variant: 'primary', show: true },
    { to: '/dashboard/leave-requests', icon: <HiOutlineCalendar />, label: 'Xin nghỉ phép', variant: 'outline-light', show: true },
    { to: '/dashboard/profile', icon: <HiOutlineClipboardList />, label: 'Xem hồ sơ', variant: 'outline-light', show: true },
    { to: '/dashboard/salaries', icon: <HiOutlineCurrencyDollar />, label: 'Xem bảng lương', variant: 'outline-light', show: true },

    // Manager+
    { to: '/dashboard/employees', icon: <HiOutlineUserGroup />, label: 'Quản lý Nhân viên', variant: 'outline-light', show: hasRole('MANAGER', 'HR', 'PRESIDENT') },

    // HR/PRESIDENT only

    { to: '/dashboard/salaries', icon: <HiOutlineCurrencyDollar />, label: 'Xử lý Bảng lương', variant: 'outline-light', show: hasRole('HR', 'PRESIDENT') },
    { to: '/dashboard/departments', icon: <HiOutlineOfficeBuilding />, label: 'Quản lý Phòng ban', variant: 'outline-light', show: hasRole('HR', 'PRESIDENT') },
  ];

  return (
    <>
      {/* ── Welcome banner with role-specific style ──────── */}
      <div
        className="glass-card p-4 mb-4"
        style={{
          background: config.gradient,
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            right: 60,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span
                className="badge"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {getRoleLabel(user?.role)}
              </span>
            </div>
            <h4 style={{ fontWeight: 700, color: '#fff', margin: 0 }}>
              {config.greeting}, {user?.fullName?.split(' ').slice(-1)[0] || 'Người dùng'} 👋
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0, marginTop: 4 }}>
              {config.subtitle}
            </p>
          </div>


        </div>
      </div>

      {/* ── KPI Grid ───────────────────────────────────── */}
      <div className="row g-4 mb-4">
        {kpis
          .filter((k) => k.show)
          .map((kpi, i) => (
            <div className="col-sm-6 col-xl-3" key={i}>
              <KPICard {...kpi} loading={loading} />
            </div>
          ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────── */}
      <div className="glass-card p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <HiOutlineChartBar style={{ color: config.accentColor, fontSize: '1.2rem' }} />
          <h6 style={{ fontWeight: 700, margin: 0 }}>Thao tác nhanh</h6>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {quickActions
            .filter((a) => a.show)
            .map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className={`btn btn-${action.variant} btn-sm d-flex align-items-center gap-1`}
              >
                {action.icon}
                {action.label}
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
