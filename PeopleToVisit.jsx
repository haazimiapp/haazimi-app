import { useState } from 'react';
import { PEOPLE_TO_VISIT as INITIAL } from '../data/mockData';
import { MapPin, CheckCircle } from 'lucide-react';

export default function PeopleToVisit() {
  const [people, setPeople] = useState(INITIAL);
  const [view, setView] = useState('table');
  const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' });
  const [groupBy, setGroupBy] = useState('none');

  const handleSort = (key) => {
    setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const sorted = [...people].sort((a, b) => {
    const va = a[sort.key] || '';
    const vb = b[sort.key] || '';
    return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const logVisit = (id) => {
    setPeople(ps => ps.map(p => p.id === id ? { ...p, status: 'upcoming', lastVisit: new Date().toISOString().split('T')[0] } : p));
  };

  const SortArrow = ({ k }) => {
    if (sort.key !== k) return <span className="sort-arrow" />;
    return <span className={`sort-arrow ${sort.dir}`} />;
  };

  const statusLabel = { overdue: 'Overdue', due: 'Due Soon', upcoming: 'Upcoming' };
  const statusClass = { overdue: 'status-incomplete', due: 'status-in-progress', upcoming: 'status-completed' };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>People to Visit</h2>
          <p>Track outreach visits and follow-ups</p>
        </div>
      </div>

      <div className="view-controls">
        <div className="toggle-buttons">
          <span>View:</span>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
          <button className={view === 'group' ? 'active' : ''} onClick={() => setView('group')}>Grouped</button>
        </div>
        {view === 'group' && (
          <div className="group-by-selector">
            <label>Group by:</label>
            <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="none">Status</option>
              <option value="area">Area</option>
              <option value="relation">Relation</option>
            </select>
          </div>
        )}
      </div>

      {view === 'table' ? (
        <div className="table-container">
          <table className="staff-table">
            <thead>
              <tr>
                <th className="sortable-header" onClick={() => handleSort('name')}>Name <SortArrow k="name" /></th>
                <th>Relation</th>
                <th>Student/Contact</th>
                <th>Area</th>
                <th className="sortable-header" onClick={() => handleSort('dueDate')}>Due Date <SortArrow k="dueDate" /></th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p.id} className={p.status === 'overdue' ? 'overdue' : ''}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.relation}</td>
                  <td>{p.student || '—'}</td>
                  <td><MapPin size={13} style={{ marginRight: 4 }} />{p.area}</td>
                  <td>{p.dueDate}</td>
                  <td>{p.lastVisit}</td>
                  <td><span className={`status-badge ${statusClass[p.status]}`}>{statusLabel[p.status]}</span></td>
                  <td>
                    <button className="button-log-visit" onClick={() => logVisit(p.id)}>
                      <CheckCircle size={13} style={{ marginRight: 4 }} />Log Visit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grouped-view-container">
          {['overdue', 'due', 'upcoming'].map(status => {
            const items = people.filter(p => p.status === status);
            return (
              <div key={status} className="group-column">
                <div className="group-header" style={{ color: status === 'overdue' ? 'var(--danger-color)' : status === 'due' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                  {statusLabel[status]} ({items.length})
                </div>
                <div className="group-items">
                  {items.map(p => (
                    <div key={p.id} className={`group-item-card ${p.status === 'overdue' ? 'overdue' : ''}`}>
                      <div className="card-row">
                        <strong className="card-row-value">{p.name}</strong>
                      </div>
                      <div className="card-row" style={{ marginTop: 6 }}>
                        <span className="card-row-label">{p.relation}</span>
                        <span className="card-row-label">{p.area}</span>
                      </div>
                      <div className="card-row" style={{ marginTop: 6 }}>
                        <span className="card-row-label">Due: {p.dueDate}</span>
                        <button className="button-log-visit" onClick={() => logVisit(p.id)}>Log</button>
                      </div>
                      {p.notes && <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--subtle-text-color)', fontStyle: 'italic' }}>{p.notes}</div>}
                    </div>
                  ))}
                  {items.length === 0 && <div style={{ color: 'var(--subtle-text-color)', fontSize: '0.9rem', padding: 8 }}>None</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
