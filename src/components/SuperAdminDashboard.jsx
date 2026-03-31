import { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Globe, ToggleRight, Shield, BookOpen, MapPin, CheckCircle, Clock, XCircle, RefreshCw, Loader, Trash2, Search, Filter, Edit2, Check, X } from 'lucide-react';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const FEATURE_KEYS = ['logtime', 'leaves', 'budget', 'calendar', 'reimbursement', 'redflags', 'reports', 'classes'];
const FEATURE_LABELS = { logtime: 'Log Time', leaves: 'Leave Management', budget: 'Budget', calendar: 'Calendar', reimbursement: 'Reimbursements', redflags: 'Red Flags', reports: 'Reports', classes: 'My Classes' };
const ROLES = ['Staff', 'Centre Manager', 'Country Admin', 'Super Admin'];
const STATUSES = ['Pending', 'Approved', 'Denied'];

function normalizeGSUser(u) {
  return {
    name: u.Name || u.name || '',
    email: (u.Email || u.email || '').toLowerCase().trim(),
    role: u.Role || u.role || 'Staff',
    country: u.Country || u.country || '',
    centre: u.Centre || u.centre || '',
    status: u.Status || u.status || 'Pending',
    password: u.Password || u.password || '',
    registeredAt: u.RegisteredAt || u.registeredAt || '',
  };
}

function mergeAccounts(gsUsers, localAccounts) {
  const map = new Map();
  localAccounts.forEach(u => { if (u.email) map.set(u.email.toLowerCase(), u); });
  gsUsers.forEach(u => {
    const norm = normalizeGSUser(u);
    if (norm.email) map.set(norm.email, norm);
  });
  return Array.from(map.values());
}

export default function SuperAdminDashboard({ user, language, onNavigate }) {
  const [accounts, setAccounts] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_accounts') || '[]'); } catch { return []; } });
  const [leaves, setLeaves] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_leaves') || '[]'); } catch { return []; } });
  const [toggles, setToggles] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_feature_toggles') || '{}'); } catch { return {}; } });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState('');

  // Inline Editing States
  const [editingEmail, setEditingEmail] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchFromSheets = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      const gsUsers = Array.isArray(data) ? data : (data.users || []);
      const localAccounts = (() => { try { return JSON.parse(localStorage.getItem('haazimi_accounts') || '[]'); } catch { return []; } })();
      const merged = mergeAccounts(gsUsers, localAccounts);
      setAccounts(merged);
      localStorage.setItem('haazimi_accounts', JSON.stringify(merged));
    } catch {
      setFetchError('Could not reach Google Sheets — showing local data only.');
    }
    if (showLoading) setLoading(false);
  }, []);

  useEffect(() => { fetchFromSheets(); }, [fetchFromSheets]);

  const postUpdate = async (payload) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'updateUser', ...payload }),
      });
    } catch {}
  };

  const handleUpdateUser = async (email, updatedFields) => {
    setUpdatingEmail(email);
    const updated = accounts.map(u => u.email === email ? { ...u, ...updatedFields } : u);
    setAccounts(updated);
    localStorage.setItem('haazimi_accounts', JSON.stringify(updated));
    await postUpdate({ email, ...updatedFields });
    setUpdatingEmail('');
    setEditingEmail(null);
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to permanently delete user: ${email}? This cannot be undone.`)) return;
    setUpdatingEmail(email + '_del');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'deleteUser', email }),
      });
      const updated = accounts.filter(u => u.email !== email);
      setAccounts(updated);
      localStorage.setItem('haazimi_accounts', JSON.stringify(updated));
    } catch (e) { console.error("Delete failed", e); }
    setUpdatingEmail('');
  };

  const byCountry = accounts.reduce((acc, u) => { 
    const c = u.country || 'Unknown'; 
    if (!acc[c]) acc[c] = []; 
    acc[c].push(u); 
    return acc; 
  }, {});

  const filteredAccounts = useMemo(() => {
    return accounts.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.country || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || (u.status || 'Pending') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchQuery, statusFilter]);

  const pendingUsers = accounts.filter(u => !u.status || u.status === 'Pending');
  const approvedUsers = accounts.filter(u => u.status === 'Approved');
  const allCentres = [...new Set(accounts.map(u => u.centre).filter(Boolean))];

  const getToggleForCentre = (centre, feature) => {
    if (!toggles[centre]) return true;
    return toggles[centre][feature] !== false;
  };

  const setToggle = (centre, feature, val) => {
    const updated = { ...toggles, [centre]: { ...(toggles[centre] || {}), [feature]: val } };
    setToggles(updated);
    localStorage.setItem('haazimi_feature_toggles', JSON.stringify(updated));
  };

  const statCards = [
    { label: 'Total Users', value: loading ? '…' : accounts.length, color: '#6366f1' },
    { label: 'Pending Approvals', value: loading ? '…' : pendingUsers.length, color: '#f59e0b' },
    { label: 'Approved', value: loading ? '…' : approvedUsers.length, color: '#10b981' },
    { label: 'Countries', value: loading ? '…' : Object.keys(byCountry).length, color: '#8b5cf6' },
  ];

  const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'users', label: `Users${loading ? '' : ` (${accounts.length})`}` }, { id: 'toggles', label: 'Feature Toggles' }];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={22} /> Super Admin Dashboard</h2>
          <p>Global overview — all countries and centres</p>
        </div>
        <button
          onClick={() => fetchFromSheets()}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.83rem', fontWeight: 500 }}
        >
          {loading ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />}
          {loading ? 'Syncing…' : 'Sync from Sheets'}
        </button>
      </div>

      {fetchError && (
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.83rem', color: '#92400e' }}>
          {fetchError}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--card-bg)', borderRadius: 10, padding: 4, width: 'fit-content', boxShadow: '0 2px 8px var(--shadow-color)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', borderRadius: 12, padding: '20px 18px', boxShadow: '0 2px 8px var(--shadow-color)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)' }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} /> Users by Country</h3>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                <Loader size={14} className="spin" /> Syncing with Google Sheets…
              </div>
            ) : Object.keys(byCountry).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No registered users yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {Object.entries(byCountry).map(([country, users]) => (
                  <div key={country} style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <MapPin size={13} style={{ color: 'var(--accent-color)' }} />
                      <strong style={{ fontSize: '0.88rem' }}>{country}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {users.length} user{users.length !== 1 ? 's' : ''} · {users.filter(u => u.status === 'Approved').length} active
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>System User Directory</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0' }}>Manage permissions and global account status.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Filter size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px 8px 30px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Approved">Approved Only</option>
                  <option value="Denied">Denied Only</option>
                </select>
              </div>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="staff-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Location</th>
                  <th>Access Level</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Management</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc, i) => {
                  const isBusy = updatingEmail.startsWith(acc.email);
                  const isEditing = editingEmail === acc.email;
                  return (
                    <tr key={i} style={{ opacity: isBusy ? 0.6 : 1 }}>
                      <td>
                        {isEditing ? (
                          <input 
                            style={{ fontSize: '0.85rem', padding: '4px', width: '100%' }}
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                          />
                        ) : (
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name || 'Unnamed User'}</div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{acc.email}</div>
                      </td>
                      <td>
                        {isEditing ? (
                          <>
                            <input 
                              placeholder="Country"
                              style={{ fontSize: '0.75rem', padding: '2px', width: '100%', marginBottom: '4px' }}
                              value={editForm.country} 
                              onChange={e => setEditForm({...editForm, country: e.target.value})}
                            />
                            <input 
                              placeholder="Centre"
                              style={{ fontSize: '0.75rem', padding: '2px', width: '100%' }}
                              value={editForm.centre} 
                              onChange={e => setEditForm({...editForm, centre: e.target.value})}
                            />
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.85rem' }}>{acc.country || '—'}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{acc.centre || 'Unassigned'}</div>
                          </>
                        )}
                      </td>
                      <td>
                        <select 
                          value={isEditing ? editForm.role : (acc.role || 'Staff')} 
                          onChange={e => isEditing ? setEditForm({...editForm, role: e.target.value}) : handleUpdateUser(acc.email, { role: e.target.value })}
                          style={{ fontSize: '0.78rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td>
                        {isEditing ? (
                          <select 
                            value={editForm.status} 
                            onChange={e => setEditForm({...editForm, status: e.target.value})}
                            style={{ fontSize: '0.78rem', padding: '4px' }}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`status-badge status-${(acc.status || 'pending').toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                            {acc.status || 'Pending'}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                          {isEditing ? (
                            <>
                              <button onClick={() => handleUpdateUser(acc.email, editForm)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }} title="Save"><Check size={18}/></button>
                              <button onClick={() => setEditingEmail(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Cancel"><X size={18}/></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingEmail(acc.email); setEditForm({...acc}); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit"><Edit2 size={16}/></button>
                              <button onClick={() => handleDelete(acc.email)} disabled={isBusy} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'toggles' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)' }}>
          <h3 style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}><ToggleRight size={18} /> Feature Toggles by Centre</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: 20 }}>Enable or disable features globally for specific centres.</p>
          <div style={{ overflowX: 'auto' }}>
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Centre</th>
                  {FEATURE_KEYS.map(f => <th key={f} style={{ textAlign: 'center', fontSize: '0.75rem' }}>{FEATURE_LABELS[f]}</th>)}
                </tr>
              </thead>
              <tbody>
                {allCentres.map(centre => (
                  <tr key={centre}>
                    <td style={{ fontWeight: 500 }}>{centre}</td>
                    {FEATURE_KEYS.map(f => {
                      const on = getToggleForCentre(centre, f);
                      return (
                        <td key={f} style={{ textAlign: 'center' }}>
                          <button onClick={() => setToggle(centre, f, !on)} style={{ background: on ? '#dcfce7' : '#fee2e2', border: 'none', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600, color: on ? '#16a34a' : '#dc2626', cursor: 'pointer' }}>
                            {on ? 'ON' : 'OFF'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}