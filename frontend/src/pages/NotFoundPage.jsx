/**
 * NotFoundPage
 * ---
 * Trang 404 với điều hướng quay về trang chủ.
 */
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        className="text-gradient"
        style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1 }}
      >
        404
      </div>
      <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Không tìm thấy trang</h2>
      <p
        style={{
          color: 'var(--wf-text-muted)',
          maxWidth: 400,
          marginBottom: '2rem',
        }}
      >
        Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <div className="d-flex gap-3">
        <Link to="/" className="btn btn-primary">
          Về Trang chủ
        </Link>
        <Link to="/dashboard" className="btn btn-outline-light">
          Tổng quan
        </Link>
      </div>
    </div>
  );
}
