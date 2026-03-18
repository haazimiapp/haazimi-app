import { useState } from 'react';
import { LEAVE_REQUESTS as INITIAL } from '../data/mockData';

export default function PendingLeaves() {
  const [requests, setRequests] = useState(INITIAL);
  const [tab, setTab] = useState('pending');

  const pending = requests.filter(r => r.status === 'pending');
  const history = requests.filter(r => r.status !== 'pending');
  const shown = tab === 'pending' ? pending : history;

  const updateStatus = (id, status) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Leave Requests</h2>
          <p>{pending.length} pending approval</p>
        </div>
      </div>

      <div className="pending-leaves-layout">
        {tab === 'pending' && pending.length > 0 && (
          <div className="request-section">
            <h3>Pending Requests ({pending.length})</h3>
            <div className="requests-grid">
              {pending.map(req => (
                <div key={req.id} className={`request-card status-${req.status}`}>
                  <div className="request-card-header">
                    <div className="request-user-info">
                      <h4>{req.staffName}</h4>
                      <div className="request-dates">
                        {req.type} Leave · {req.from} → {req.to}
                      </div>
                    </div>
                    <div className="duration-pill">{req.days} day{req.days !== 1 ? 's' : ''}</div>
                  </div>
                  <p className="request-reason">{req.reason}</p>
                  <div className="request-card-footer">
                    <div className="user-leave-tally">
                      <span className="tally-item total">Total: {req.tally.total}</span>
                      <span className="tally-item approved">Approved: {req.tally.approved}</span>
                      <span className="tally-item rejected">Rejected: {req.tally.rejected}</span>
                    </div>
                    <div className="request-actions">
                      <button className="button-approve" onClick={() => updateStatus(req.id, 'approved')}>Approve</button>
                      <button className="button-reject" onClick={() => updateStatus(req.id, 'rejected')}>Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="request-section">
          <div className="history-tabs">
            <button className={`history-tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
              Pending ({pending.length})
            </button>
            <button className={`history-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
              History ({history.length})
            </button>
          </div>

          {tab === 'history' && (
            <div className="requests-grid">
              {history.map(req => (
                <div key={req.id} className={`request-card status-${req.status}`}>
                  <div className="request-card-header">
                    <div className="request-user-info">
                      <h4>{req.staffName}</h4>
                      <div className="request-dates">
                        {req.type} Leave · {req.from} → {req.to}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="duration-pill">{req.days} days</div>
                      <span className={`status-badge ${req.status === 'approved' ? 'status-completed' : 'status-incomplete'}`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                  <p className="request-reason">{req.reason}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'pending' && pending.length === 0 && (
            <div className="prompt-container">
              No pending leave requests. All caught up! ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
