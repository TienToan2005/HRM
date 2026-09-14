/**
 * Testimonials Component
 * ---
 * Các thẻ đánh giá từ khách hàng trong lưới responsive.
 */
import { HiStar } from 'react-icons/hi';

const testimonials = [
  {
    name: 'Nguyễn Thị Hương',
    role: 'Giám đốc Nhân sự, TechCorp',
    quote:
      'WorkFlow HR đã thay đổi hoàn toàn cách vận hành nhân sự của chúng tôi. Những gì trước đây mất cả ngày giờ chỉ còn vài phút. Riêng tính năng tự động hóa bảng lương đã giúp tiết kiệm hơn 20 giờ mỗi tháng.',
    stars: 5,
    initials: 'NH',
    color: 'var(--wf-primary)',
  },
  {
    name: 'Trần Minh Đức',
    role: 'CEO, StartupXYZ',
    quote:
      'Hệ thống chấm công cực kỳ trực quan. Nhân viên rất thích cổng tự phục vụ, còn quản lý thì đánh giá cao tính năng duyệt nghỉ phép chỉ bằng một cú nhấp.',
    stars: 5,
    initials: 'MD',
    color: 'var(--wf-secondary)',
  },
  {
    name: 'Lê Thị Thanh',
    role: 'Trưởng phòng Vận hành, GrowthCo',
    quote:
      'HRMS tốt nhất mà chúng tôi từng sử dụng. Hệ thống phân quyền theo vai trò giúp chúng tôi an tâm rằng dữ liệu nhạy cảm được bảo mật đúng cách. Dịch vụ hỗ trợ khách hàng cũng xuất sắc!',
    stars: 5,
    initials: 'TT',
    color: 'var(--wf-accent)',
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding"
      style={{ background: 'var(--wf-bg-card)' }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span
            className="d-inline-block px-3 py-1 mb-3"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: 50,
              fontSize: '0.85rem',
              color: 'var(--wf-accent)',
              fontWeight: 600,
            }}
          >
            Đánh giá
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Được tin dùng bởi các{' '}
            <span className="text-gradient">Công ty Hàng đầu</span>
          </h2>
          <p
            style={{
              color: 'var(--wf-text-muted)',
              maxWidth: 500,
              margin: '0 auto',
              fontSize: '1.05rem',
            }}
          >
            Xem khách hàng nói gì về WorkFlow HR.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="row g-4">
          {testimonials.map((t, i) => (
            <div className="col-md-4" key={i}>
              <div className="glass-card h-100 p-4">
                {/* Stars */}
                <div className="d-flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <HiStar key={j} style={{ color: '#f59e0b', fontSize: '1.1rem' }} />
                  ))}
                </div>
                {/* Quote */}
                <p
                  style={{
                    color: 'var(--wf-text)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                    fontStyle: 'italic',
                  }}
                >
                  "{t.quote}"
                </p>
                {/* Author */}
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: `${t.color}20`,
                      color: t.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--wf-text-muted)', fontSize: '0.8rem' }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
