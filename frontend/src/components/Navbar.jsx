/**
 * Navbar Component
 * ---
 * Thanh điều hướng cố định trong suốt, chuyển sang đặc khi cuộn.
 * Sử dụng trên trang chủ giới thiệu.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-3">
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--wf-primary), var(--wf-secondary))',
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
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
              WorkFlow <span style={{ color: 'var(--wf-secondary)' }}>HR</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <button
              className="btn btn-link text-decoration-none"
              style={{ color: 'var(--wf-text-muted)', fontWeight: 500 }}
              onClick={() => scrollToSection('features')}
            >
              Tính năng
            </button>
            <button
              className="btn btn-link text-decoration-none"
              style={{ color: 'var(--wf-text-muted)', fontWeight: 500 }}
              onClick={() => scrollToSection('pricing')}
            >
              Bảng giá
            </button>
            <button
              className="btn btn-link text-decoration-none"
              style={{ color: 'var(--wf-text-muted)', fontWeight: 500 }}
              onClick={() => scrollToSection('testimonials')}
            >
              Đánh giá
            </button>
            <Link to="/login" className="btn btn-primary ms-2">
              Đăng nhập
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="btn d-lg-none"
            style={{ color: '#fff', fontSize: '1.5rem' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở/đóng điều hướng"
          >
            {mobileOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="d-lg-none pb-3"
            style={{
              borderTop: '1px solid var(--wf-glass-border)',
            }}
          >
            <div className="d-flex flex-column gap-2 pt-3">
              <button
                className="btn btn-link text-decoration-none text-start"
                style={{ color: 'var(--wf-text)' }}
                onClick={() => scrollToSection('features')}
              >
                Tính năng
              </button>
              <button
                className="btn btn-link text-decoration-none text-start"
                style={{ color: 'var(--wf-text)' }}
                onClick={() => scrollToSection('pricing')}
              >
                Bảng giá
              </button>
              <button
                className="btn btn-link text-decoration-none text-start"
                style={{ color: 'var(--wf-text)' }}
                onClick={() => scrollToSection('testimonials')}
              >
                Đánh giá
              </button>
              <Link to="/login" className="btn btn-primary mt-2">
                Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
