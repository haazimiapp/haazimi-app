import { useState } from 'react';
import { Plus, MoreVertical, Search } from 'lucide-react';
import { STAFF as INITIAL_STAFF } from '../data/mockData';

function AddStaffModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', role: 'Teacher', center: '', phone: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, id: Date.now(), status: 'Active', joinDate: new Date().toISOString().split('T')[0], leaves: 0 });
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
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Abdullah Khan" />
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

export default function StaffManagement() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.center.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Staff Management</h2>
          <p>{staff.length} total staff members</p>
        </div>
        <button className="button-primary icon-button" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Staff
        </button>
      </div>

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
              <th>Name</th>
              <th>Role</th>
              <th>Center</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Leaves</th>
              <th>Actions</th>
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
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--subtle-text-color)', padding: 40 }}>No staff found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && <AddStaffModal onClose={() => setShowAdd(false)} onAdd={m => setStaff(s => [...s, m])} />}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to remove ${confirmDelete.name}? This action cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
