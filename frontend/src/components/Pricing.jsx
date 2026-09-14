/**
 * Pricing Component
 * ---
 * Ba gói giá — dùng cho mục đích giới thiệu/demo.
 */
import { HiCheck } from 'react-icons/hi';

const plans = [
  {
    name: 'Khởi đầu',
    price: 'Miễn phí',
    period: '',
    desc: 'Hoàn hảo cho đội nhóm nhỏ mới bắt đầu.',
    features: [
      'Tối đa 10 nhân viên',
      'Chấm công cơ bản',
      'Quản lý nghỉ phép',
      'Cổng tự phục vụ cho nhân viên',
      'Hỗ trợ qua email',
    ],
    cta: 'Bắt đầu ngay',
    highlighted: false,
  },
  {
    name: 'Chuyên nghiệp',
    price: '699K',
    period: '/tháng',
    desc: 'Tốt nhất cho công ty đang phát triển.',
    features: [
      'Tối đa 100 nhân viên',
      'Chấm công nâng cao & tăng ca',
      'Xử lý bảng lương',
      'Quản lý phòng ban',
      'Phân quyền theo vai trò',
      'Hỗ trợ ưu tiên',
    ],
    cta: 'Dùng thử miễn phí',
    highlighted: true,
  },
  {
    name: 'Doanh nghiệp',
    price: 'Liên hệ',
    period: '',
    desc: 'Cho tổ chức lớn với nhu cầu tùy chỉnh.',
    features: [
      'Không giới hạn nhân viên',
      'Tích hợp tùy chỉnh',
      'Phân tích nâng cao',
      'Quản lý tài khoản chuyên trách',
      'Cam kết SLA',
      'Triển khai nội bộ',
    ],
    cta: 'Liên hệ tư vấn',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span
            className="d-inline-block px-3 py-1 mb-3"
            style={{
              background: 'rgba(6, 214, 160, 0.1)',
              border: '1px solid rgba(6, 214, 160, 0.2)',
              borderRadius: 50,
              fontSize: '0.85rem',
              color: 'var(--wf-secondary)',
              fontWeight: 600,
            }}
          >
            Bảng giá
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Giá cả <span className="text-gradient">Minh bạch, Đơn giản</span>
          </h2>
          <p
            style={{
              color: 'var(--wf-text-muted)',
              maxWidth: 500,
              margin: '0 auto',
              fontSize: '1.05rem',
            }}
          >
            Chọn gói phù hợp với tổ chức của bạn. Không có phí ẩn.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="row g-4 justify-content-center">
          {plans.map((plan, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div
                className={`card h-100 ${plan.highlighted ? 'gradient-border' : ''}`}
                style={
                  plan.highlighted
                    ? {
                        background: 'var(--wf-bg-surface)',
                        transform: 'scale(1.03)',
                        zIndex: 2,
                      }
                    : {}
                }
              >
                <div className="card-body d-flex flex-column p-4">
                  {plan.highlighted && (
                    <span
                      className="badge mb-3 align-self-start"
                      style={{
                        background: 'linear-gradient(135deg, var(--wf-primary), var(--wf-secondary))',
                        color: '#fff',
                      }}
                    >
                      Phổ biến nhất
                    </span>
                  )}
                  <h5 style={{ fontWeight: 700 }}>{plan.name}</h5>
                  <div className="d-flex align-items-end gap-1 mb-2">
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                    {plan.period && (
                      <span
                        style={{
                          color: 'var(--wf-text-muted)',
                          fontSize: '0.9rem',
                          marginBottom: 6,
                        }}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      color: 'var(--wf-text-muted)',
                      fontSize: '0.9rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {plan.desc}
                  </p>
                  <ul className="list-unstyled mb-4 flex-grow-1">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="d-flex align-items-center gap-2 mb-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        <HiCheck style={{ color: 'var(--wf-secondary)', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn w-100 ${plan.highlighted ? 'btn-primary' : 'btn-outline-light'}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
