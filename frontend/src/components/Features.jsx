/**
 * Features Component
 * ---
 * Sáu thẻ tính năng giới thiệu khả năng HRMS.
 * Sử dụng hiệu ứng fade-in khi cuộn qua IntersectionObserver.
 */
import { useEffect, useRef } from 'react';
import {
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const features = [
  {
    icon: <HiOutlineUserGroup />,
    title: 'Quản lý Nhân viên',
    desc: 'Hồ sơ nhân viên tập trung với đầy đủ dữ liệu HR — từ tuyển dụng đến nghỉ việc. Cổng tự phục vụ cho nhân viên cập nhật thông tin cá nhân.',
    color: 'var(--wf-primary)',
  },
  {
    icon: <HiOutlineClock />,
    title: 'Chấm công',
    desc: 'Hệ thống chấm công vào/ra thời gian thực với tính toán giờ làm tự động, theo dõi đi muộn/về sớm và quy trình sửa chấm công.',
    color: 'var(--wf-secondary)',
  },
  {
    icon: <HiOutlineCalendar />,
    title: 'Quản lý Nghỉ phép',
    desc: 'Quy trình xin và duyệt nghỉ phép được tinh gọn. Nhân viên gửi đơn; quản lý duyệt hoặc từ chối chỉ bằng một cú nhấp.',
    color: 'var(--wf-accent)',
  },
  {
    icon: <HiOutlineCurrencyDollar />,
    title: 'Xử lý Bảng lương',
    desc: 'Tạo bảng lương tự động dựa trên dữ liệu chấm công, tăng ca, khấu trừ và phụ cấp. Xử lý hàng loạt cho toàn công ty chỉ bằng một cú nhấp.',
    color: 'var(--wf-warning)',
  },
  {
    icon: <HiOutlineOfficeBuilding />,
    title: 'Tổ chức Phòng ban',
    desc: 'Tổ chức nhân viên theo phòng ban với quản lý được chỉ định. Theo dõi cơ cấu đội nhóm và hệ thống báo cáo dễ dàng.',
    color: '#ec4899',
  },
  {
    icon: <HiOutlineShieldCheck />,
    title: 'Phân quyền theo Vai trò',
    desc: 'Hệ thống phân quyền 4 cấp — Nhân viên, Quản lý, Nhân sự và Giám đốc — đảm bảo đúng người có quyền truy cập đúng dữ liệu nhạy cảm.',
    color: '#14b8a6',
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.fade-in');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="section-padding" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span
            className="d-inline-block px-3 py-1 mb-3"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 50,
              fontSize: '0.85rem',
              color: 'var(--wf-primary)',
              fontWeight: 600,
            }}
          >
            Tính năng
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Tất cả những gì bạn cần để{' '}
            <span className="text-gradient">Quản lý Đội nhóm</span>
          </h2>
          <p
            style={{
              color: 'var(--wf-text-muted)',
              maxWidth: 600,
              margin: '0 auto',
              fontSize: '1.05rem',
            }}
          >
            Bộ công cụ HR toàn diện được thiết kế để đơn giản hóa quản lý nhân lực
            và nâng cao hiệu suất tổ chức.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="row g-4">
          {features.map((f, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div
                className="card h-100 fade-in"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="card-body d-flex flex-column">
                  {/* Icon */}
                  <div
                    className="mb-3"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      background: `${f.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: f.color,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h5>
                  <p
                    style={{
                      color: 'var(--wf-text-muted)',
                      fontSize: '0.9rem',
                      flex: 1,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
