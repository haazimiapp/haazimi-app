import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Search, Loader2 } from 'lucide-react';
import { STAFF as INITIAL_STAFF } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';

// --- MODAL COMPONENTS ---

function AddStaffModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', role: 'Staff', center: '', phone: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ 
      ...form, 
      id: Date.now(), 
      status: 'Active', 
      joinDate: new Date().toISOString().split('T')[0], 
      leaves: 0 
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Add New Staff Member</h3>
        <form onSubmit={handleSubmit}>
          <div className="add-staff-form">
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Muhammad Haffejee" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}>
                <option>Teacher</option>
                <option>Admin</option>
                <option>Coordinator</option>
                <option>Support</option>
              </select>
            </div>
            <div className="form-group">
              <label>Center / Branch</label>
              <input value={form.center} onChange={e => set('center', e.target.value)} required placeholder="e.g. Branch A" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0300-0000000" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button-primary">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose}>Cancel</button>
          <button className="button-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function StaffManagement({ user, isDev: isDevProp }) {
  const isDev = (() => {
    if (isDevProp === true) return true;
    if (user?.isDev === true) return true;
    try {
      const stored = JSON.parse(localStorage.getItem('haazimi_user') || '{}');
      return stored.isDev === true;
    } catch { return false; }
  })();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (isDev) {
      setStaff(INITIAL_STAFF);
      setLoading(false);
    } else {
      loadLiveStaff();
    }
  }, [isDev]);

  const loadLiveStaff = async () => {
    if (isDev) return;
    setLoading(true);
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`);
      const data = await res.json();
      const liveData = (Array.isArray(data) ? data : (data.users || [])).map(u => ({
        id: u.Email || Math.random(),
        name: u.Name || 'Unknown',
        role: u.Role || 'Staff',
        center: u.Centre || u.Country || 'Main',
        status: u.Status || 'Active',
        phone: u.Phone || '-',
        joinDate: u.JoinDate || '-',
        leaves: u.Leaves || 0
      }));
      if (!isDev) setStaff(liveData);
    } catch (err) {
      console.error("Cloud fetch failed:", err);
      if (!isDev) setStaff([]);
    } finally {
      if (!isDev) setLoading(false);
    }
  };

  const filtered = staff.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.role || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.center || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setStaff(s => s.filter(m => m.id !== id));
    setConfirmDelete(null);
    setOpenMenu(null);
  };

  const toggleStatus = (id) => {
    setStaff(s => s.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m));
    setOpenMenu(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary-color)', marginBottom: 16 }} />
        <p style={{ color: 'var(--subtle-text-color)', fontSize: '1.1rem' }}>Loading staff directory...</p>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .dev-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fbbf24;
          color: #1c1917;
          border: 2px solid #f59e0b;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 12px;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.3);
          animation: dev-pulse 2s infinite;
        }
        @keyframes dev-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(251,191,36,0.1); }
        }
        .dev-mode-banner {
          background: linear-gradient(90deg, #fef3c7, #fde68a);
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 8px 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #78350f;
        }
      `}</style>

      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2>Staff Management</h2>
            {isDev && <span className="dev-badge">⚗ Mock Data Active</span>}
          </div>
          <p>{staff.length} total staff members</p>
        </div>
        <button className="button-primary icon-button" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {isDev && (
        <div className="dev-mode-banner">
          ⚗ MOCK DATA MODE — Showing local sample data. No live API calls are being made.
        </div>
      )}

      <div className="table-container">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <Search size={18} style={{ color: 'var(--subtle-text-color)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search staff by name, role, or center..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--input-bg)', color: 'var(--text-dark)' }}
          />
        </div>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Name</th><th>Role</th><th>Center</th><th>Status</th><th>Phone</th><th>Join Date</th><th>Leaves</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(member => (
              <tr key={member.id}>
                <td><strong>{member.name}</strong></td>
                <td>{member.role}</td>
                <td>{member.center}</td>
                <td>
                  <span className={`status-badge ${member.status === 'Active' ? 'status-completed' : member.status === 'On Leave' ? 'status-in-progress' : 'status-incomplete'}`}>
                    {member.status}
                  </span>
                </td>
                <td>{member.phone}</td>
                <td>{member.joinDate}</td>
                <td>{member.leaves}</td>
                <td className="actions-cell">
                  <button className="action-button" onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}>
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === member.id && (
                    <div className="actions-dropdown">
                      <button onClick={() => toggleStatus(member.id)}>
                        {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="danger-action" onClick={() => { setConfirmDelete(member); setOpenMenu(null); }}>
                        Remove
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddStaffModal onClose={() => setShowAdd(false)} onAdd={m => setStaff(s => [...s, m])} />}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to remove ${confirmDelete.name}?`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}