import { useState } from 'react';
import { LEAVE_REQUESTS } from '../data/mockData';

const STATUS_CLASS = { approved: 'status-completed', rejected: 'status-incomplete', pending: 'status-in-progress' };
const STATUS_LABEL = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending' };

export default function LeaveRequest({ user }) {
  const [form, setForm] = useState({ type: 'Casual', from: '', to: '', reason: '', emergency: false });
  const [submitted, setSubmitted] = useState(false);
  const [myLeaves, setMyLeaves] = useState(() => {
    return LEAVE_REQUESTS.filter(l => l.staffName === user.name);
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24) + 1;
    return Math.max(0, diff);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      staffId: user.id,
      staffName: user.name,
      type: form.type,
      from: form.from,
      to: form.to,
      days: calcDays(),
      reason: form.reason,
      status: 'pending',
      tally: { total: myLeaves.length + 1, approved: 0, rejected: 0 },
    };
    setMyLeaves(l => [newRequest, ...l]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ type: 'Casual', from: '', to: '', reason: '', emergency: false });
    }, 4000);
  };

  const approved = myLeaves.filter(l => l.status === 'approved').length;
  const rejected = myLeaves.filter(l => l.status === 'rejected').length;
  const pending = myLeaves.filter(l => l.status === 'pending').length;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Request Leave</h2>
          <p>Submit a leave application for approval</p>
        </div>
      </div>

      <div className="leave-page-layout">
        <div className="form-container" style={{ flex: '1 1 420px' }}>
          <div className="form-header">
            <h2>Leave Application Form</h2>
            <p>Fill in the details below. Your manager will be notified.</p>
          </div>

          {submitted && (
            <div className="forgot-password-success" style={{ marginBottom: 24 }}>
              Your leave request has been submitted successfully!
            </div>
          )}

          <form className="generic-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Leave Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Casual</option>
                  <option>Medical</option>
                  <option>Emergency</option>
                  <option>Study</option>
                  <option>Maternity / Paternity</option>
                  <option>Annual</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Applicant</label>
                <input type="text" value={user.name} disabled style={{ opacity: 0.7 }} />
              </div>
              <div className="form-group">
                <label>From Date</label>
                <input type="date" value={form.from} onChange={e => set('from', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>To Date</label>
                <input type="date" value={form.to} min={form.from} onChange={e => set('to', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <div className="duration-display">{calcDays()} day{calcDays() !== 1 ? 's' : ''}</div>
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="emergency" checked={form.emergency} onChange={e => set('emergency', e.target.checked)} />
                <label htmlFor="emergency">Mark as Emergency</label>
              </div>
              <div className="form-group full-width">
                <label>Reason / Details</label>
                <textarea
                  value={form.reason}
                  onChange={e => set('reason', e.target.value)}
                  rows={4}
                  required
                  placeholder="Please provide a clear reason for your leave request..."
                />
              </div>
            </div>

            <div className="calculations-display">
              <div className="calc-item"><span>{approved}</span>Approved</div>
              <div className="calc-item"><span>{pending}</span>Pending</div>
              <div className="calc-item"><span>{rejected}</span>Rejected</div>
            </div>

            <div className="form-actions">
              <button type="button" className="button-secondary" onClick={() => setForm({ type: 'Casual', from: '', to: '', reason: '', emergency: false })}>
                Clear
              </button>
              <button type="submit" className="button-primary">Submit Request</button>
            </div>
          </form>
        </div>

        <div className="leave-history-panel" style={{ flex: '1 1 360px' }}>
          <h3>My Leave History</h3>
          {myLeaves.length === 0 ? (
            <div className="prompt-container" style={{ marginTop: 0 }}>No previous leave requests found.</div>
          ) : (
            <div className="leave-history-list">
              {myLeaves.map(req => (
                <div key={req.id} className={`leave-history-card leave-history-card--${req.status}`}>
                  <div className="leave-history-card-top">
                    <div className="leave-history-type">{req.type}</div>
                    <span className={`status-badge ${STATUS_CLASS[req.status]}`}>
                      {STATUS_LABEL[req.status]}
                    </span>
                  </div>
                  <div className="leave-history-dates">
                    {req.from} → {req.to}
                    <span className="leave-history-days">{req.days} day{req.days !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="leave-history-reason">{req.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
