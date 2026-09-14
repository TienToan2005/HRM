/**
 * Utility Helpers
 */

/** Format a LocalDate string (yyyy-MM-dd) to dd/MM/yyyy display */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
}

/** Format a LocalDateTime string to dd/MM/yyyy HH:mm */
export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format a BigDecimal / number to VND currency */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/** Get a CSS class for status badges */
export function getStatusBadgeClass(status) {
  const map = {
    OK: 'badge-status-ok',
    APPROVED: 'badge-status-ok',
    PAID: 'badge-status-ok',
    PENDING: 'badge-status-pending',
    MISSING_CHECKOUT: 'badge-status-missing',
    REJECTED: 'badge-status-rejected',
    CANCELLED: 'badge-status-rejected',
    ABSENT: 'badge-status-absent',
    ON_LEAVE: 'badge-status-pending',
  };
  return map[status] || 'bg-secondary';
}

/** Map role enum to human-readable label */
export function getRoleLabel(role) {
  const map = {
    EMPLOYEE: 'Nhân viên',
    MANAGER: 'Quản lý',
    HR: 'Nhân sự',
    PRESIDENT: 'Giám đốc',
  };
  return map[role] || role;
}

/** Map status enum to Vietnamese label */
export function getStatusLabel(status) {
  const map = {
    OK: 'Hoàn thành',
    APPROVED: 'Đã duyệt',
    PAID: 'Đã thanh toán',
    PENDING: 'Chờ xử lý',
    MISSING_CHECKOUT: 'Thiếu checkout',
    REJECTED: 'Từ chối',
    CANCELLED: 'Đã hủy',
    ABSENT: 'Vắng mặt',
    ON_LEAVE: 'Nghỉ phép',
  };
  return map[status] || status;
}

/** Get current date in yyyy-MM-dd format */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

/** Get current datetime in ISO format */
export function getNowISO() {
  return new Date().toISOString().slice(0, 19);
}
