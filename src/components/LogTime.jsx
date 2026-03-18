import { useState, useEffect } from 'react';
import { TIME_LOGS as INITIAL_LOGS } from '../data/mockData';

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxON3JkEXF9BuRQOKUAI-cu-fdn7XBitCrDzxY9a84yKmO97zQtkddlsqxT6kZ5eIOR/exec";
const TEACHING_ACTIVITIES = ['Teaching', 'Teaching + Admin'];

function activityLabel(log) {
  if (log.activity === 'Other' && log.otherActivity) return `Other: ${log.otherActivity}`;
  if (TEACHING_ACTIVITIES.includes(log.activity) && log.studentCount) return `${log.activity} (${log.studentCount} students)`;
  return log.activity;
}

export default function LogTime() {
  // FIX: Load history from LocalStorage first, fallback to mock data if empty
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('haazimi_display_logs');
    return savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS;
  });

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

  // --- OFFLINE SYNC LOGIC ---
  useEffect(() => {
    attemptSync();
    window.addEventListener('online', attemptSync);
    return () => window.removeEventListener('online', attemptSync);
  }, []);

const attemptSync = async () => {
    const offlineQueue = JSON.parse(localStorage.getItem('haazimi_offline_logs') || '[]');
    if (offlineQueue.length === 0) return;

    // We use a copy to avoid glitches during the loop
    const newQueue = [...offlineQueue];

    for (let i = 0; i < newQueue.length; i++) {
      try {
        const log = newQueue[i];
        
        // This is the "Magic Map" - it ensures Google gets exactly what it needs
        const payload = {
          date: log.date,
          activity: log.activity,
          hours: log.hours,
          checkIn: log.checkIn,
          checkOut: log.checkOut,
          notes: log.notes,
          studentCount: log.studentCount,
          otherActivity: log.otherActivity
        };

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload) // We send the mapped payload, not the raw log
        });

        // If we reach here, it's a success! Remove from queue
        newQueue.splice(i, 1);
        i--; 
      } catch (err) {
        console.log("Sync failed, keeping data in storage for next attempt.");
        break; 
      }
    }
    // Update the storage with whatever is left
    localStorage.setItem('haazimi_offline_logs', JSON.stringify(newQueue));
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isTeaching = TEACHING_ACTIVITIES.includes(form.activity);
  const isOther = form.activity === 'Other';

  const calcHours = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const [ih, im] = form.checkIn.split(':').map(Number);
    const [oh, om] = form.checkOut.split(':').map(Number);
    return Math.max(0, (oh * 60 + om - ih * 60 - im) / 60).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hours = parseFloat(calcHours());
    const newLog = { 
      id: Date.now(), 
      ...form, 
      hours,
      status: 'pending' 
    };

    // 1. Update UI AND save visual history so it survives page reloads (The Fix)
    setLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      localStorage.setItem('haazimi_display_logs', JSON.stringify(updatedLogs));
      return updatedLogs;
    });
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // 2. Save to the invisible Offline Queue (for Google Sheets)
    const queue = JSON.parse(localStorage.getItem('haazimi_offline_logs') || '[]');
    queue.push(newLog);
    localStorage.setItem('haazimi_offline_logs', JSON.stringify(queue));

    // 3. Clear Form fields that need to be reset
    setForm(f => ({ ...f, notes: '', studentCount: '', otherActivity: '' }));

    // 4. Try to push to Google Sheets immediately
    attemptSync();
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
          <p>Record your daily attendance and work hours (Offline-Enabled)</p>
        </div>
      </div>

      <div className="log-time-layout">
        <div>
          <div className="form-container" style={{ maxWidth: 'none', padding: 0, boxShadow: 'none', background: 'none' }}>
            <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px var(--shadow-color)' }}>
              <div className="form-header">
                <h2>New Time Entry</h2>
                <p>Data is saved locally and synced to cloud when online.</p>
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
          <h3>Recent Session Log</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>In/Out</th>
                <th>Hours</th>
                <th>Activity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.checkIn} - {log.checkOut}</td>
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
