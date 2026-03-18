import { useState } from 'react';
import {
  Users, CheckCircle, AlertTriangle, FileText, Clock,
  BookOpen, TrendingUp, Send, Plus, CalendarOff, ChevronDown, ChevronUp
} from 'lucide-react';
import { STAFF, LEAVE_REQUESTS, RED_FLAGS, TIME_LOGS } from '../data/mockData';

function InfoCard({ icon: Icon, iconClass, value, label, onClick }) {
  return (
    <div className={`info-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className={`icon ${iconClass}`}>
        <Icon />
      </div>
      <div className="details">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
}

function LogTimeButton({ onNavigate }) {
  return (
    <div className="log-time-hero" onClick={() => onNavigate('logtime')}>
      <div className="log-time-hero-icon">
        <Clock size={28} />
      </div>
      <div className="log-time-hero-text">
        <strong>Log Today's Hours</strong>
        <span>Tap to record your time</span>
      </div>
      <div className="log-time-hero-arrow">
        <Plus size={22} />
      </div>
    </div>
  );
}

const LEAVE_TYPES = ['Medical', 'Casual', 'Annual', 'Emergency', 'Personal'];

function QuickLeaveRequest({ userName }) {
  const today = new Date().toISOString().split('T')[0];
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ type: 'Casual', from: today, to: today, reason: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / 86400000;
    return Math.max(0, diff + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setOpen(false);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ type: 'Casual', from: today, to: today, reason: '' });
  };

  return (
    <div className="quick-leave-panel">
      <button
        className={`quick-leave-toggle ${open ? 'open' : ''} ${submitted ? 'submitted' : ''}`}
        onClick={() => { setOpen(o => !o); setSubmitted(false); }}
        type="button"
      >
        <div className="quick-leave-toggle-left">
          <CalendarOff size={22} />
          <div>
            <strong>{submitted ? 'Leave request submitted!' : 'Request Leave'}</strong>
            <span>{submitted ? 'Your request is pending approval' : 'Submit a leave request'}</span>
          </div>
        </div>
        <div className="quick-leave-toggle-arrow">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {open && (
        <div className="quick-leave-form">
          <form onSubmit={handleSubmit}>
            <div className="quick-leave-grid">
              <div className="form-group">
                <label>Leave Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>From</label>
                <input type="date" value={form.from} min={today} onChange={e => set('from', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>To</label>
                <input type="date" value={form.to} min={form.from} onChange={e => set('to', e.target.value)} required />
              </div>
              <div className="form-group quick-leave-days">
                <label>Duration</label>
                <div className="duration-display">{calcDays()} day{calcDays() !== 1 ? 's' : ''}</div>
              </div>
              <div className="form-group quick-leave-reason">
                <label>Reason <span style={{ color: '#e74c3c' }}>*</span></label>
                <textarea
                  rows={2}
                  placeholder="Brief reason for your leave..."
                  value={form.reason}
                  onChange={e => set('reason', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="quick-leave-actions">
              <button type="button" className="button-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="button-primary">Submit Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ManagerDashboard({ onNavigate }) {
  const totalStaff = STAFF.length;
  const activeToday = STAFF.filter(s => s.status === 'Active').length;
  const redFlags = RED_FLAGS.length;
  const pendingLeaves = LEAVE_REQUESTS.filter(l => l.status === 'pending').length;

  const recentActivity = [
    { name: 'Usman Tariq', action: 'Submitted leave request', time: '2h ago', status: 'in-progress' },
    { name: 'Fatima Malik', action: 'Submitted leave request', time: '4h ago', status: 'in-progress' },
    { name: 'Ahmad Ali', action: 'Leave approved', time: 'Yesterday', status: 'completed' },
    { name: 'Ibrahim Shah', action: 'Leave rejected', time: 'Yesterday', status: 'incomplete' },
    { name: 'Bilal Hassan', action: 'Logged 6 hours', time: '2 days ago', status: 'completed' },
  ];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Manager Dashboard</h2>
          <p>Overview of your institution's performance</p>
        </div>
      </div>

      <div className="dashboard-hero-row">
        <LogTimeButton onNavigate={onNavigate} />
        <QuickLeaveRequest />
      </div>

      <div className="dashboard-grid dashboard-grid--manager">
        <InfoCard icon={Users} iconClass="total-staff" value={totalStaff} label="Total Staff" onClick={() => onNavigate('staff')} />
        <InfoCard icon={CheckCircle} iconClass="active-today" value={activeToday} label="Active Today" />
        <InfoCard icon={AlertTriangle} iconClass="red-flags" value={redFlags} label="Red Flags" onClick={() => onNavigate('redflags')} />
        <InfoCard icon={FileText} iconClass="pending-leaves" value={pendingLeaves} label="Pending Leaves" onClick={() => onNavigate('pendingleaves')} />
        <InfoCard icon={Clock} iconClass="hours" value="172h" label="Hrs Logged (Month)" onClick={() => onNavigate('logtime')} />
        <InfoCard icon={BookOpen} iconClass="classes" value="3" label="Active Classes" onClick={() => onNavigate('classes')} />
        <InfoCard icon={Users} iconClass="students" value="9" label="Total Students" />
        <InfoCard icon={TrendingUp} iconClass="efficiency" value="87%" label="Avg Attendance" />
      </div>

      <div className="dashboard-lower-grid">
        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-buttons">
            <button className="quick-action-button" onClick={() => onNavigate('logtime')}>
              <Clock size={20} /> Log Time
            </button>
            <button className="quick-action-button" onClick={() => onNavigate('staff')}>
              <Users size={20} /> Add Staff
            </button>
            <button className="quick-action-button" onClick={() => onNavigate('pendingleaves')}>
              <FileText size={20} /> Review Leaves
            </button>
            <button className="quick-action-button" onClick={() => onNavigate('redflags')}>
              <AlertTriangle size={20} /> View Flags
            </button>
          </div>
        </div>
        <div className="dashboard-section">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {recentActivity.map((item, i) => (
              <li key={i} className="activity-item">
                <div className="activity-details">
                  <strong>{item.name}</strong>
                  <span>{item.action}</span>
                </div>
                <div className="activity-time">
                  <span>{item.time}</span>
                  <span className={`status-badge status-${item.status}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StaffDashboard({ user, onNavigate }) {
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const myLogs = TIME_LOGS.slice(0, 3);
  const totalHours = TIME_LOGS.reduce((s, l) => s + l.hours, 0);

  const handleAsk = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    await new Promise(r => setTimeout(r, 1200));
    setAiResponse(`Based on your records, you have logged ${totalHours} hours this month across ${TIME_LOGS.length} sessions. Your class attendance average is 88%. You have 3 students that need attention. Keep up the great work!`);
    setAiLoading(false);
  };

  return (
    <div className="dhimmedaar-home-layout">
      <div className="view-header">
        <div>
          <h2>Assalamu Alaikum, {user.name.split(' ')[0]}</h2>
          <p>{today}</p>
        </div>
      </div>

      <div className="dashboard-hero-row">
        <LogTimeButton onNavigate={onNavigate} />
        <QuickLeaveRequest userName={user.name} />
      </div>

      <div className="dashboard-grid">
        <InfoCard icon={Clock} iconClass="hours" value={`${totalHours}h`} label="Hours This Month" onClick={() => onNavigate('logtime')} />
        <InfoCard icon={BookOpen} iconClass="classes" value="3" label="My Classes" onClick={() => onNavigate('classes')} />
        <InfoCard icon={Users} iconClass="students" value="9" label="My Students" />
        <InfoCard icon={CheckCircle} iconClass="active-today" value="88%" label="Avg Attendance" />
      </div>

      <div className="dashboard-section ai-assistant-section">
        <h3>AI Assistant</h3>
        <p className="ai-assistant-description">Ask anything about your classes, students, or schedule.</p>
        <div className="ai-input-area">
          <input
            type="text"
            placeholder="e.g. How are my students performing this month?"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
          />
          <button className="button-primary icon-button" onClick={handleAsk} disabled={aiLoading}>
            <Send size={16} /> Ask
          </button>
        </div>
        <div className="ai-response-area">
          {aiLoading ? (
            <div className="loading-spinner" />
          ) : aiResponse ? (
            <p>{aiResponse}</p>
          ) : (
            <p style={{ color: 'var(--subtle-text-color)', fontStyle: 'italic' }}>Your response will appear here...</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Time Logs</h3>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {myLogs.map(log => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.checkIn}</td>
                <td>{log.checkOut}</td>
                <td>{log.hours}h</td>
                <td>{log.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onNavigate }) {
  if (user.role === 'manager') return <ManagerDashboard onNavigate={onNavigate} />;
  return <StaffDashboard user={user} onNavigate={onNavigate} />;
}
