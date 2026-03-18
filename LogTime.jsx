import { useState } from 'react';
import { TIME_LOGS as INITIAL_LOGS } from '../data/mockData';

const TEACHING_ACTIVITIES = ['Teaching', 'Teaching + Admin'];

function activityLabel(log) {
  if (log.activity === 'Other' && log.otherActivity) return `Other: ${log.otherActivity}`;
  if (TEACHING_ACTIVITIES.includes(log.activity) && log.studentCount) return `${log.activity} (${log.studentCount} students)`;
  return log.activity;
}

export default function LogTime() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:00',
    checkOut: '14:00',
    activity: 'Teaching',
    studentCount: '',
    otherActivity: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isTeaching = TEACHING_ACTIVITIES.includes(form.activity);
  const isOther = form.activity === 'Other';

  const calcHours = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const [ih, im] = form.checkIn.split(':').map(Number);
    const [oh, om] = form.checkOut.split(':').map(Number);
    return Math.max(0, (oh * 60 + om - ih * 60 - im) / 60).toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hours = parseFloat(calcHours());
    const newLog = { id: Date.now(), ...form, hours };
    setLogs(l => [newLog, ...l]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(f => ({ ...f, notes: '', studentCount: '', otherActivity: '' }));
  };

  const handleActivityChange = (e) => {
    set('activity', e.target.value);
    set('studentCount', '');
    set('otherActivity', '');
  };

  const totalHours = logs.reduce((s, l) => s + l.hours, 0);

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Log Time</h2>
          <p>Record your daily attendance and work hours</p>
        </div>
      </div>

      <div className="log-time-layout">
        <div>
          <div className="form-container" style={{ maxWidth: 'none', padding: 0, boxShadow: 'none', background: 'none' }}>
            <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px var(--shadow-color)' }}>
              <div className="form-header">
                <h2>New Time Entry</h2>
                <p>Log your working hours for today</p>
              </div>

              {submitted && (
                <div className="forgot-password-success" style={{ marginBottom: 20 }}>
                  Time entry logged successfully!
                </div>
              )}

              <form className="generic-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label>Activity</label>
                    <select value={form.activity} onChange={handleActivityChange}>
                      <option>Teaching</option>
                      <option>Admin</option>
                      <option>Teaching + Admin</option>
                      <option>Exam Supervision</option>
                      <option>Meeting</option>
                      <option>Planning</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {isTeaching && (
                    <div className="form-group">
                      <label>
                        Number of Students <span style={{ color: '#e74c3c' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        placeholder="e.g. 12"
                        value={form.studentCount}
                        onChange={e => set('studentCount', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {isOther && (
                    <div className="form-group">
                      <label>
                        Please specify <span style={{ color: '#e74c3c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Describe the activity..."
                        value={form.otherActivity}
                        onChange={e => set('otherActivity', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Check In Time</label>
                    <input type="time" value={form.checkIn} onChange={e => set('checkIn', e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label>Check Out Time</label>
                    <input type="time" value={form.checkOut} onChange={e => set('checkOut', e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label>Duration</label>
                    <div className="duration-display">{calcHours()} hours</div>
                  </div>

                  <div className="form-group full-width">
                    <label>Notes (optional)</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any additional notes..." />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="button-primary">Log Hours</button>
                </div>
              </form>
            </div>

            <div className="calculations-display" style={{ marginTop: 20 }}>
              <div className="calc-item"><span>{logs.length}</span>Days Logged</div>
              <div className="calc-item"><span>{totalHours.toFixed(0)}h</span>Total Hours</div>
              <div className="calc-item"><span>{(totalHours / Math.max(1, logs.length)).toFixed(1)}h</span>Daily Average</div>
            </div>
          </div>
        </div>

        <div className="previous-logs-container" style={{ marginTop: 0 }}>
          <h3>Previous Logs</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Activity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.checkIn}</td>
                  <td>{log.checkOut}</td>
                  <td><strong>{log.hours}h</strong></td>
                  <td>{activityLabel(log)}</td>
                  <td className="notes-cell">{log.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
