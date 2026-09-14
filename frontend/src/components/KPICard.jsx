/**
 * KPICard Component
 * ---
 * Reusable stat card for dashboard overview.
 */
export default function KPICard({ icon, label, value, color, loading }) {
  return (
    <div className="kpi-card kpi-pulse">
      <div
        className="kpi-icon"
        style={{
          background: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </div>
      <div className="kpi-value">
        {loading ? (
          <div
            className="placeholder-glow"
            style={{ width: 60, height: 32 }}
          >
            <span className="placeholder col-12" style={{ borderRadius: 4 }} />
          </div>
        ) : (
          value ?? '—'
        )}
      </div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}
