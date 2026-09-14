/**
 * Footer Component
 * ---
 * Footer trang giới thiệu với thông tin công ty, liên kết và mạng xã hội.
 */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--wf-bg-card)',
        borderTop: '1px solid var(--wf-glass-border)',
        padding: '4rem 0 2rem',
      }}
    >
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 mb-3">
            <div className="d-flex align-items-center mb-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background:
                    'linear-gradient(135deg, var(--wf-primary), var(--wf-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#fff',
                  marginRight: 10,
                }}
              >
                W
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                WorkFlow{' '}
                <span style={{ color: 'var(--wf-secondary)' }}>HR</span>
              </span>
            </div>
            <p
              style={{
                color: 'var(--wf-text-muted)',
                fontSize: '0.9rem',
                maxWidth: 300,
              }}
            >
              Giải pháp quản lý nhân sự hiện đại được thiết kế để tối ưu hóa vận hành,
              trao quyền cho nhân viên và giúp tổ chức phát triển.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Sản phẩm</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {['Tính năng', 'Bảng giá', 'Bảo mật', 'Tích hợp'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{ color: 'var(--wf-text-muted)', fontSize: '0.9rem' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-6 col-lg-2">
            <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Công ty</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {['Giới thiệu', 'Tuyển dụng', 'Blog', 'Liên hệ'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{ color: 'var(--wf-text-muted)', fontSize: '0.9rem' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Cập nhật tin tức</h6>
            <p
              style={{
                color: 'var(--wf-text-muted)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              Đăng ký nhận bản tin để cập nhật thông tin mới nhất.
            </p>
            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email của bạn"
                style={{ maxWidth: 250 }}
              />
              <button className="btn btn-primary">Đăng ký</button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="d-flex flex-wrap justify-content-between align-items-center mt-5 pt-4"
          style={{ borderTop: '1px solid var(--wf-glass-border)' }}
        >
          <p
            style={{
              color: 'var(--wf-text-muted)',
              fontSize: '0.85rem',
              margin: 0,
            }}
          >
            © 2026 WorkFlow HR. Bảo lưu mọi quyền.
          </p>
          <div className="d-flex gap-3">
            <a href="#" style={{ color: 'var(--wf-text-muted)', fontSize: '0.85rem' }}>
              Chính sách Bảo mật
            </a>
            <a href="#" style={{ color: 'var(--wf-text-muted)', fontSize: '0.85rem' }}>
              Điều khoản Dịch vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
