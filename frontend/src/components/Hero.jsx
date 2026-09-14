/**
 * Hero Component
 * ---
 * Phần hero toàn màn hình với nền gradient động,
 * tiêu đề, mô tả và nút CTA.
 */
import { Link } from 'react-router-dom';
import { HiArrowRight, HiPlay } from 'react-icons/hi';

export default function Hero() {
  return (
    <section className="landing-hero">
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center">
          <div className="col-lg-7">
            {/* Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 50,
                fontSize: '0.85rem',
                color: 'var(--wf-primary)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--wf-secondary)',
                  display: 'inline-block',
                }}
              />
              Nền tảng Quản lý Nhân sự #1
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              Tối ưu hóa{' '}
              <span className="text-gradient">Vận hành Nhân sự</span>{' '}
              Một cách Tự tin
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--wf-text-muted)',
                maxWidth: 540,
                marginBottom: '2rem',
                lineHeight: 1.7,
              }}
            >
              WorkFlow HR giúp tổ chức của bạn quản lý nhân viên hiện đại,
              chấm công tự động, duyệt nghỉ phép nhanh chóng và
              xử lý bảng lương thông minh — tất cả trong một nền tảng thống nhất.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex flex-wrap gap-3">
              <Link to="/login" className="btn btn-primary btn-lg d-flex align-items-center gap-2">
                Bắt đầu ngay <HiArrowRight />
              </Link>
              <button
                className="btn btn-outline-light btn-lg d-flex align-items-center gap-2"
                onClick={() =>
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <HiPlay /> Tìm hiểu thêm
              </button>
            </div>

            {/* Stats Row */}
            <div className="d-flex flex-wrap gap-4 mt-5 pt-3">
              {[
                { value: '10K+', label: 'Người dùng' },
                { value: '500+', label: 'Công ty' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--wf-text-heading)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--wf-text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — decorative dashboard preview */}
          <div className="col-lg-5 d-none d-lg-block">
            <div
              className="glass-card p-4"
              style={{
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Mini dashboard preview */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#f59e0b',
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#06d6a0',
                  }}
                />
              </div>
              <div
                style={{
                  background: 'var(--wf-bg-surface)',
                  borderRadius: 'var(--wf-radius)',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--wf-text-muted)',
                    marginBottom: 4,
                  }}
                >
                  Tổng Nhân viên
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>1.247</div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <div
                    style={{
                      background: 'rgba(6, 214, 160, 0.1)',
                      borderRadius: 'var(--wf-radius)',
                      padding: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--wf-secondary)' }}>
                      Có mặt
                    </div>
                    <div style={{ fontWeight: 700 }}>1.189</div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: 'var(--wf-radius)',
                      padding: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--wf-warning)' }}>
                      Nghỉ phép
                    </div>
                    <div style={{ fontWeight: 700 }}>58</div>
                  </div>
                </div>
              </div>
              {/* Mini chart bars */}
              <div className="mt-3 d-flex align-items-end gap-1" style={{ height: 60 }}>
                {[40, 65, 50, 80, 70, 90, 60, 75, 85, 55, 70, 95].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: 3,
                      background:
                        i === 11
                          ? 'var(--wf-primary)'
                          : 'rgba(59, 130, 246, 0.2)',
                      transition: 'height 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
