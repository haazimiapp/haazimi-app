import { STAFF } from '../data/mockData';

function BarChart({ data, horizontal = false }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className={`bar-chart ${horizontal ? 'horizontal' : ''}`}>
      {data.map((item, i) => (
        <div key={i} className="bar-wrapper">
          {!horizontal && <div className="bar-label">{item.label}</div>}
          {horizontal ? (
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', gap: 12 }}>
              <div className="bar-label" style={{ textAlign: 'right' }}>{item.label}</div>
              <div className="bar" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || 'var(--accent-color)', padding: '8px 12px', justifyContent: 'flex-end', color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>{item.value}{item.unit || ''}</span>
              </div>
            </div>
          ) : (
            <div className="bar" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || 'var(--accent-color)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const gradient = data.map(d => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return `${d.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="pie-chart-container">
      <div className="pie-chart" style={{ background: `conic-gradient(${gradient})` }} />
      <div className="pie-chart-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: d.color }} />
            <span>{d.label}: <strong>{d.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports() {
  const activeStaff = STAFF.filter(s => s.status === 'Active').length;
  const onLeave = STAFF.filter(s => s.status === 'On Leave').length;
  const inactive = STAFF.filter(s => s.status === 'Inactive').length;

  const attendanceData = [
    { label: 'Hifz Class A', value: 92, color: '#2ecc71' },
    { label: 'Nazra Class B', value: 81, color: '#3498db' },
    { label: 'Tajweed Class C', value: 86, color: '#9b59b6' },
  ];

  const staffByCenter = [
    { label: 'Head Office', value: 2, color: '#3498db' },
    { label: 'Branch A', value: 2, color: '#2ecc71' },
    { label: 'Branch B', value: 2, color: '#e67e22' },
    { label: 'Branch C', value: 1, color: '#e74c3c' },
  ];

  const monthlyHours = [
    { label: 'Jan', value: 160 },
    { label: 'Feb', value: 152 },
    { label: 'Mar', value: 172 },
    { label: 'Apr', value: 168 },
    { label: 'May', value: 145 },
  ];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Reports</h2>
          <p>Insights and analytics for your institution</p>
        </div>
      </div>

      <div className="reports-layout">
        <div className="report-widget">
          <h3>Staff Status Breakdown</h3>
          <PieChart data={[
            { label: 'Active', value: activeStaff, color: '#2ecc71' },
            { label: 'On Leave', value: onLeave, color: '#f39c12' },
            { label: 'Inactive', value: inactive, color: '#e74c3c' },
          ]} />
        </div>

        <div className="report-widget">
          <h3>Staff by Center</h3>
          <BarChart data={staffByCenter} horizontal />
        </div>

        <div className="report-widget">
          <h3>Class Attendance Rate (%)</h3>
          <BarChart data={attendanceData} horizontal />
        </div>

        <div className="report-widget">
          <h3>Monthly Hours Logged</h3>
          <BarChart data={monthlyHours} />
        </div>

        <div className="report-widget large-widget">
          <h3>Leave Summary</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Total Leaves</th>
                <th>Used</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STAFF.map(s => {
                const remaining = Math.max(0, 10 - s.leaves);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>10</td>
                    <td>{s.leaves}</td>
                    <td>{remaining}</td>
                    <td>
                      <span className={`status-badge ${s.leaves > 10 ? 'status-incomplete' : s.leaves > 7 ? 'status-in-progress' : 'status-completed'}`}>
                        {s.leaves > 10 ? 'Over Limit' : s.leaves > 7 ? 'Near Limit' : 'Good'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
