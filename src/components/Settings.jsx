import { useState } from 'react';
import { Sun, Moon, Globe, Bell, Shield, User } from 'lucide-react';

export default function Settings({ user, language, onNavigate }) {
  const [notifications, setNotifications] = useState({
    leaveApproval: true,
    newRequest: true,
    redFlags: true,
    calendarEvents: false,
    weeklyReport: true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => setNotifications(n => ({ ...n, [key]: !n[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const notifItems = [
    { key: 'leaveApproval', label: 'Leave Approvals', desc: 'Notify when your leave request status changes' },
    { key: 'newRequest', label: 'New Leave Requests', desc: 'Notify when staff submit new leave requests' },
    { key: 'redFlags', label: 'Red Flag Alerts', desc: 'Notify when new red flags are raised' },
    { key: 'calendarEvents', label: 'Calendar Events', desc: 'Notify 24 hours before scheduled events' },
    { key: 'weeklyReport', label: 'Weekly Summary', desc: 'Receive a weekly summary every Monday' },
  ];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your preferences and account settings</p>
        </div>
      </div>

      <div className="form-container" style={{ maxWidth: 700 }}>
        {saved && <div className="forgot-password-success" style={{ marginBottom: 24 }}>Settings saved successfully!</div>}

        <div className="settings-layout">
          <div className="settings-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <User size={20} color="var(--accent-color)" />
              <h3>Profile</h3>
            </div>
            <p>Your account information</p>
            <div className="generic-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label>Center / Branch</label>
                  <input type="text" defaultValue={user.center} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" defaultValue={user.role} disabled style={{ opacity: 0.7 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Bell size={20} color="var(--accent-color)" />
              <h3>Notifications</h3>
            </div>
            <p>Choose what you want to be notified about</p>
            <div className="checkbox-grid">
              {notifItems.map(item => (
                <label key={item.key} className="custom-checkbox-label" onClick={() => toggle(item.key)}>
                  <input type="checkbox" checked={notifications[item.key]} readOnly />
                  <span className={`checkbox-icon ${notifications[item.key] ? 'checked' : ''}`} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>{item.label}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--subtle-text-color)' }}>{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Shield size={20} color="var(--accent-color)" />
              <h3>Security</h3>
            </div>
            <p>Manage your password and security settings</p>
            <div className="generic-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group full-width">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 8 }}>
          <button className="button-secondary">Discard Changes</button>
          <button className="button-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
